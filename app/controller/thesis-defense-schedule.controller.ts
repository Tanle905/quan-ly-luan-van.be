import dayjs from "dayjs";
import { Request, Response } from "express";
import { cloneDeep } from "lodash";
import mongoose from "mongoose";
import {
  ROLES,
  ScheduleEventType,
  Slot,
  SLOTS,
  slotsData,
} from "../constants and enums/variable";
import {
  ScheduleEventTime,
  ThesisDefenseTime,
} from "../interface/schedule.interface";
import { ScheduleModel } from "../model/schedule.model";
import { TeacherModel } from "../model/teacher.model";
import { TopicModel } from "../model/topic.model";
import {
  isCurEventBelongToCurTeacher,
  isCurEventDateMatchCurSelectedDate,
  isCurDateSlotsListContainCurSlot,
  isStudentHaveThesisSchedule,
} from "../util/schedule.util";
import { StudentModel } from "../model/student.model";
import { NotificationModel } from "../model/notification.model";
import { sendEmail } from "../util/mail.util";
import { haveScheduleEmailContent } from "../util/mail.util";

export const thesisDefenseScheduleController = {
  gradingStatus: {
    get: async (req: Request, res: Response) => {
      const scheduleDocument = await ScheduleModel.findOne({});

      return res
        .status(200)
        .json({ data: scheduleDocument.isOpenForGradeInput });
    },
    edit: async (req: Request, res: Response) => {
      const { status } = req.body;

      const scheduleDocument = await ScheduleModel.findOne({});

      scheduleDocument.isOpenForGradeInput = status;

      await scheduleDocument.save();

      return res
        .status(200)
        .json({ data: scheduleDocument.isOpenForGradeInput });
    },
  },
  studentList: {
    getAll: async (req: Request, res: Response) => {
      const scheduleDocument = await ScheduleModel.findOne({});

      return res.status(200).json({ data: scheduleDocument });
    },
    import: async (req: Request, res: Response) => {
      const { data } = req.body;
      const { students, incompleteStudents } = data;

      try {
        const scheduleDocument = await ScheduleModel.findOne({});

        //If schedule is not yet created, create a new one
        if (!scheduleDocument) {
          const newSchedule = new ScheduleModel();

          newSchedule.studentLists.push(data);
          await newSchedule.save();
        } else {
          scheduleDocument.studentLists.push(data);
          await scheduleDocument.save();
        }
        const teacherDocument = await TeacherModel.findOne({ MSCB: data.MSCB });

        teacherDocument.isImportedStudentListToSystem = true;

        await Promise.all([
          ...students.map(async (student) => {
            const doc = await StudentModel.findOne({ MSSV: student.MSSV });
            doc.status = student.status;

            await doc.save();
          }),
          ...incompleteStudents.map(async (student) => {
            const doc = await StudentModel.findOne({ MSSV: student.MSSV });
            doc.status = student.status;

            await doc.save();
          }),
          teacherDocument.save(),
        ]);

        return res.status(200).json({ message: "Add student list completed." });
      } catch (error: any) {
        return res.status(500).json({ message: "Internal Error" });
      }
    },
  },
  calendar: {
    getScheduleWeeks: async (req: Request, res: Response) => {
      try {
        const scheduleDocument = await ScheduleModel.findOne({});

        return res.status(200).json({
          data: {
            thesisDefenseWeek: scheduleDocument.calendar.thesisDefenseWeek,
            reportPrepareWeek: scheduleDocument.calendar.reportPrepareWeek,
          },
        });
      } catch (error: any) {
        return res.status(500).json({ message: "Internal Error" });
      }
    },
    getCalendarEvents: async (req: Request, res: Response) => {
      const { MSCB, MSSV, role } = req.body;

      try {
        const [scheduleDocument, teacherDocuments, topicDocuments] =
          await Promise.all([
            ScheduleModel.findOne({}),
            TeacherModel.find({}),
            TopicModel.find({}),
          ]);
        const busyTimeList = scheduleDocument.calendar.scheduleEventList.filter(
          (event) => event.type === ScheduleEventType.BusyEvent
        );
        const thesisDefenseTimeList =
          scheduleDocument.calendar.scheduleEventList.filter(
            (event) => event.type === ScheduleEventType.ThesisDefenseEvent
          );
        const mappedBusyTimeList = busyTimeList
          .map((event) => {
            const day = dayjs(event.busyTimeData?.start)
              .utcOffset(0)
              .startOf("day");

            return role !== ROLES.TEACHER ||
              (role === ROLES.TEACHER && event.busyTimeData.MSCB === MSCB)
              ? {
                  id: event.busyTimeData?.id,
                  MSCB: event.busyTimeData.MSCB,
                  start: day,
                  slots: event.busyTimeData?.slots.map((slot, index) => {
                    const startDur = slot + (slot > 5 ? 7 : 6);
                    const endDur = startDur + 1;
                    return {
                      slot,
                      title: `Buổi bận ${
                        role === ROLES.ADMIN ? event.busyTimeData.MSCB : ""
                      }`,
                      start: day.add(startDur, "hour").toDate(),
                      end: day.add(endDur, "hour").toDate(),
                    };
                  }),
                }
              : null;
          })
          .filter((e) => e);
        const mappedThesisDefenseTimeList = thesisDefenseTimeList
          .map((event) => {
            const day = dayjs(event.thesisDefenseTimeData?.start)
              .utcOffset(0)
              .startOf("day");

            return role === ROLES.ADMIN ||
              (role === ROLES.STUDENT &&
                event.thesisDefenseTimeData.MSSV === MSSV) ||
              (role === ROLES.TEACHER &&
                event.thesisDefenseTimeData.MSCB.includes(MSCB))
              ? {
                  slots: [event.thesisDefenseTimeData?.slots].map(
                    (slot, index) => {
                      const startDur = slot + (slot > 5 ? 7 : 6);
                      const endDur = startDur + 1;
                      return {
                        slot,
                        type: event.type,
                        title: `Buổi báo cáo ${
                          role === ROLES.ADMIN
                            ? event.thesisDefenseTimeData?.MSCB
                            : ""
                        }`,
                        start: day.add(startDur, "hour").toDate(),
                        end: day.add(endDur, "hour").toDate(),
                      };
                    }
                  ),
                  ...(event.type && { type: event.type }),
                  id: event.thesisDefenseTimeData?.id,
                  MSSV: event.thesisDefenseTimeData?.MSSV,
                  MSCB: event.thesisDefenseTimeData?.MSCB,
                  studentName: event.thesisDefenseTimeData?.studentName,
                  topic: topicDocuments.find(
                    (topic) =>
                      event.thesisDefenseTimeData.topic.toString() ===
                      topic._id.toString()
                  ),
                  teacherName: event.thesisDefenseTimeData?.MSCB.map((cb) => {
                    const teacher = teacherDocuments.find((t) => t.MSCB === cb);
                    return `${teacher.lastName} ${teacher.firstName}`;
                  }),
                  start: day,
                }
              : null;
          })
          .filter((e) => e);

        if (role === ROLES.TEACHER && MSCB) {
          return res.status(200).json({
            data: [
              ...mappedBusyTimeList,
              ...mappedThesisDefenseTimeList,
              scheduleDocument.calendar.reportPrepareWeek,
              scheduleDocument.calendar.thesisDefenseWeek,
            ],
          });
        }
        if (role === ROLES.STUDENT) {
          return res.status(200).json({
            data: [
              ...mappedThesisDefenseTimeList,
              scheduleDocument.calendar.reportPrepareWeek,
              scheduleDocument.calendar.thesisDefenseWeek,
            ],
          });
        }
        if (role === ROLES.ADMIN) {
          return res.status(200).json({
            data: [
              ...mappedThesisDefenseTimeList,
              scheduleDocument.calendar.reportPrepareWeek,
              scheduleDocument.calendar.thesisDefenseWeek,
            ],
          });
        }
      } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
      }
    },
    getCalendarEventsByDate: async (req: Request, res: Response) => {
      const date = dayjs(req.params.date).format("DD-MM-YYYY");

      try {
        const scheduleDocument = await ScheduleModel.findOne({});
        const selectedDateEvents = await Promise.all(
          scheduleDocument.calendar.scheduleEventList
            .filter(
              (event) =>
                (event.busyTimeData &&
                  dayjs(event.busyTimeData?.start).format("DD-MM-YYYY") ===
                    date) ||
                (event.thesisDefenseTimeData &&
                  dayjs(event.thesisDefenseTimeData?.start).format(
                    "DD-MM-YYYY"
                  ) === date)
            )
            .map(async (e: any) => {
              if (e.type === ScheduleEventType.BusyEvent) return e;

              const clonedEvent = cloneDeep(e.toObject());
              const topic = await TopicModel.findOne({
                _id: e.thesisDefenseTimeData.topic,
              });
              clonedEvent.thesisDefenseTimeData.topic = topic;

              return clonedEvent;
            })
        );

        return res.status(200).json({ data: selectedDateEvents });
      } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
      }
    },
    editScheduleWeeks: async (req: Request, res: Response) => {
      const { thesisDefenseWeek, reportPrepareWeek } = req.body;
      try {
        const scheduleDocument = await ScheduleModel.findOne({});
        console.log(thesisDefenseWeek);
        scheduleDocument.calendar.reportPrepareWeek = {
          ...reportPrepareWeek,
          backgroundColor: "#C53113",
          display: "background",
        };
        scheduleDocument.calendar.thesisDefenseWeek = {
          ...thesisDefenseWeek,
          backgroundColor: "#358630",
          display: "background",
        };

        await scheduleDocument.save();

        return res.status(200).json({ message: "Added schedule successfully" });
      } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
      }
    },
    busyTime: {
      import: async (req: Request, res: Response) => {
        const { type, busyTimeData } = req.body;

        try {
          const scheduleDocument = await ScheduleModel.findOne({});

          scheduleDocument.calendar.scheduleEventList.push({
            type,
            busyTimeData,
          });

          await scheduleDocument.save();

          return res.status(200).json({ message: "Add busy time complete." });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
      edit: async (req: Request, res: Response) => {
        const { id } = req.body;

        try {
          const scheduleDocument = await ScheduleModel.findOne({});

          scheduleDocument.calendar.scheduleEventList =
            scheduleDocument.calendar.scheduleEventList.map((event) => {
              if (
                event.type === ScheduleEventType.BusyEvent &&
                event.busyTimeData.id.toString() === id
              )
                return req.body as unknown as ScheduleEventTime;
              return event;
            });

          await scheduleDocument.save();

          return res.status(200).json({ message: "Edit busy time completed" });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
      delete: async (req: Request, res: Response) => {
        const { id } = req.body;

        try {
          const scheduleDocument = await ScheduleModel.findOne({});

          scheduleDocument.calendar.scheduleEventList =
            scheduleDocument.calendar.scheduleEventList.filter(
              (event) => event.busyTimeData.id.toString() !== id
            );

          await scheduleDocument.save();

          return res
            .status(200)
            .json({ message: "Delete busy time completed" });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
    },
    thesisDefenseTime: {
      addScheduleManually: async (req: Request, res: Response) => {
        try {
          const scheduleDocument = await ScheduleModel.findOne({});
          const topicDocument = await TopicModel.findOne({
            MSSV: req.body.MSSV,
          });
          const studentDocument = await StudentModel.findOne({
            MSSV: req.body.MSSV,
          });

          scheduleDocument.calendar.scheduleEventList.push({
            type: ScheduleEventType.ThesisDefenseEvent,
            editable: true,
            thesisDefenseTimeData: { ...req.body, topic: topicDocument._id },
          });

          await Promise.all([
            NotificationModel.create({
              sender: "admin",
              receiver: req.body.MSSV,
              content: `Bạn đã có lịch báo cáo. Vui lòng xem lịch biểu`,
            }),
            scheduleDocument.save(),
          ]);
          sendEmail(
            studentDocument.email,
            "Lịch báo cáo luận văn",
            haveScheduleEmailContent(
              `${studentDocument.lastName} ${studentDocument.firstName}`,
              slotsData.find((s) => s.value === req.body.slots).name,
              dayjs(req.body.start).format("DD-MM-YYYY")
            )
          );
          return res.status(200).json({});
        } catch (error: any) {
          console.log(error);
          return res.status(500).json({ message: "Internal Error" });
        }
      },
      autoSchedule: async (req: Request, res: Response) => {
        try {
          const scheduleDocument = await ScheduleModel.findOne({});
          const studentLists = scheduleDocument.studentLists;
          const thesisDefenseStartDate = dayjs(
            scheduleDocument.calendar.thesisDefenseWeek.start
          )
            .utcOffset(0)
            .startOf("day");
          await Promise.all(
            studentLists.map(async (list) => {
              //Check for student list owner's free slot
              const currentTeacherBusyTimeList =
                scheduleDocument.calendar.scheduleEventList.filter((event) =>
                  isCurEventBelongToCurTeacher(event, list.MSCB)
                );

              await Promise.all(
                list.students.map(async (student, index) => {
                  //Check if student is already have schedule
                  if (
                    isStudentHaveThesisSchedule(
                      student,
                      scheduleDocument.calendar.scheduleEventList
                    )
                  )
                    return student;

                  for (let index = 0; index < 6; index++) {
                    const currentSelectedDate = thesisDefenseStartDate.add(
                      index,
                      "day"
                    );
                    const currentSelectedDateFormated =
                      currentSelectedDate.format("DD-MM-YYYY");
                    const isSelectedDateHaveBusyTime =
                      currentTeacherBusyTimeList.find((event) =>
                        isCurEventDateMatchCurSelectedDate(
                          event,
                          currentSelectedDateFormated
                        )
                      );
                    const freeSlotsCurSelectedDate = isSelectedDateHaveBusyTime
                      ? SLOTS.filter(
                          (slot) =>
                            !isCurDateSlotsListContainCurSlot(
                              isSelectedDateHaveBusyTime,
                              slot
                            )
                        )
                      : SLOTS;
                    //if student list's owner dont have free slot in selected day, return.
                    if (freeSlotsCurSelectedDate.length === 0) return;
                    const topicDocument = await TopicModel.findById(
                      student.topic
                    );
                    //Search for teacher that have matching major with topic
                    const matchMajorTeacherList = (
                      await TeacherModel.aggregate([
                        {
                          $project: {
                            MSCB: 1,
                            firstName: 1,
                            lastName: 1,
                            majorTags: 1,
                            count: {
                              $size: {
                                $filter: {
                                  input: "$majorTags",
                                  as: "tag",
                                  cond: {
                                    $in: [
                                      "$$tag",
                                      topicDocument.majorTag.reduce(
                                        (prev: any, cur: any) => [
                                          ...prev,
                                          cur.value,
                                        ],
                                        []
                                      ),
                                    ],
                                  },
                                },
                              },
                            },
                          },
                        },
                      ])
                    ).filter(
                      (teacher) =>
                        teacher.count !== 0 && teacher.MSCB !== list.MSCB
                    );
                    //Loop to find if other teachers have free slots that match current slots
                    for (
                      let index = 0;
                      index < freeSlotsCurSelectedDate.length;
                      index++
                    ) {
                      const slot = freeSlotsCurSelectedDate[index];
                      const freeTeacherList: any[] =
                        matchMajorTeacherList.reduce(
                          (prevTeacher, curTeacher) =>
                            prevTeacher.length >= 2 ||
                            scheduleDocument.calendar.scheduleEventList.find(
                              (event) =>
                                isCurEventDateMatchCurSelectedDate(
                                  event,
                                  currentSelectedDateFormated
                                ) &&
                                isCurEventBelongToCurTeacher(
                                  event,
                                  curTeacher.MSCB
                                ) &&
                                isCurDateSlotsListContainCurSlot(event, slot)
                            )
                              ? prevTeacher
                              : [...prevTeacher, curTeacher.MSCB],
                          []
                        );

                      if (freeTeacherList.length >= 2) {
                        freeTeacherList.push(list.MSCB);
                        const thesisDefenseTime: ThesisDefenseTime = {
                          start: dayjs(currentSelectedDate).toDate(),
                          MSCB: freeTeacherList,
                          MSSV: student.MSSV,
                          studentName: `${student.lastName} ${student.firstName}`,
                          teacherName: list.teacherName,
                          topic: topicDocument._id,
                          slots: slot,
                          id: new mongoose.Types.ObjectId(),
                        };

                        scheduleDocument.calendar.scheduleEventList.push({
                          type: ScheduleEventType.ThesisDefenseEvent,
                          thesisDefenseTimeData: thesisDefenseTime,
                        });
                        Promise.all([
                          NotificationModel.create({
                            sender: list.MSCB,
                            receiver: student.MSSV,
                            content: `Bạn đã có lịch báo cáo. Vui lòng xem lịch biểu`,
                          }),
                          NotificationModel.create({
                            sender: list.MSCB,
                            receiver: list.MSCB,
                            content: `Bạn đã có lịch báo cáo. Vui lòng xem lịch biểu`,
                          }),
                        ]);
                        sendEmail(
                          student.email,
                          "Lịch báo cáo luận văn",
                          haveScheduleEmailContent(
                            `${student.lastName} ${student.firstName}`,
                            slotsData.find((s) => s.value === slot).name,
                            dayjs(currentSelectedDate).format("DD-MM-YYYY")
                          )
                        );

                        return student;
                      }
                    }
                  }
                  return student;
                })
              );

              return list;
            })
          );

          await scheduleDocument.save();

          return res.status(200).json({ data: scheduleDocument });
        } catch (error: any) {
          console.log(error);
          return res.status(500).json({ message: "Internal Error" });
        }
      },
      delete: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
          const scheduleDocument = await ScheduleModel.findOne({});
          const filteredScheduleEventList =
            scheduleDocument.calendar.scheduleEventList.filter(
              (e) => e._id.toString() !== id
            );

          scheduleDocument.calendar.scheduleEventList =
            filteredScheduleEventList;
          await scheduleDocument.save();

          return res.status(200).json({ message: "Delete complete" });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
    },
  },
};
