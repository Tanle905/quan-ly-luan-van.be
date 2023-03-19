import dayjs from "dayjs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  ROLES,
  ScheduleEventType,
  Slot,
  SLOTS,
} from "../constants and enums/variable";
import {
  ScheduleEventTime,
  ThesisDefenseTime,
} from "../interface/schedule.interface";
import { ScheduleModel } from "../model/schedule.model";
import { TeacherModel } from "../model/teacher.model";
import { TopicModel } from "../model/topic.model";

export const thesisDefenseScheduleController = {
  studentList: {
    import: async (req: Request, res: Response) => {
      const { data } = req.body;

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

        await teacherDocument.save();

        return res.status(200).json({ message: "Add student list completed." });
      } catch (error: any) {
        return res.status(500).json({ message: "Internal Error" });
      }
    },
  },
  calendar: {
    getCalendarEvents: async (req: Request, res: Response) => {
      const { MSCB, MSSV, role } = req.body;

      try {
        const scheduleDocument = await ScheduleModel.findOne({});

        if (role === ROLES.TEACHER && MSCB) {
          const teacherBusyTimeList =
            scheduleDocument.calendar.scheduleEventList.filter(
              (event) =>
                event.type === ScheduleEventType.BusyEvent &&
                event.busyTimeData.MSCB === MSCB
            );
          const mappedBusyTimeList = teacherBusyTimeList.map((event) => {
            const day = dayjs(event.busyTimeData.start)
              .utcOffset(0)
              .startOf("day");

            return {
              id: event.busyTimeData.id,
              start: day,
              slots: event.busyTimeData.slots.map((slot, index) => {
                const startDur = slot + (slot > 5 ? 7 : 6);
                const endDur = startDur + 1;
                return {
                  slot,
                  title: "Buổi bận",
                  start: day.add(startDur, "hour").toDate(),
                  end: day.add(endDur, "hour").toDate(),
                };
              }),
            };
          });

          return res.status(200).json({ data: mappedBusyTimeList });
        }
        if (role === ROLES.STUDENT) {
          return res.status(200).json({ data: [] });
        }
        if (role === ROLES.ADMIN) {
          const mappedBusyTimeList =
            scheduleDocument.calendar.scheduleEventList.map((event) => {
              const day = dayjs(event.busyTimeData.start)
                .utcOffset(0)
                .startOf("day");

              return {
                id: event.busyTimeData.id,
                start: day,
                slots: event.busyTimeData.slots.map((slot, index) => {
                  const startDur = slot + (slot > 5 ? 7 : 6);
                  const endDur = startDur + 1;
                  return {
                    slot,
                    type: event.type,
                    title: `Buổi bận ${event.busyTimeData.MSCB}`,
                    start: day.add(startDur, "hour").toDate(),
                    end: day.add(endDur, "hour").toDate(),
                  };
                }),
              };
            });

          return res.status(200).json({ data: mappedBusyTimeList });
        }
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
    autoSchedule: async (req: Request, res: Response) => {
      const scheduleDocument = await ScheduleModel.findOne({});
      const studentLists = scheduleDocument.studentLists;
      const thesisDefenseStartDate = dayjs(
        scheduleDocument.calendar.thesisDefenseWeek
      )
        .utcOffset(0)
        .startOf("day");

      const mappedStudentList = await Promise.all(
        studentLists.map(async (list) => {
          //Check for student list owner's free slot
          const currentTeacherBusyTimeList =
            scheduleDocument.calendar.scheduleEventList.filter((event) =>
              isCurEventBelongToCurTeacher(event, list.MSCB)
            );

          const mappedStudents = await Promise.all(
            list.students.map(async (student, index) => {
              if (student.isHaveThesisSchedule) return student;

              let isHaveThesisSchedule: Boolean = false;

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
                const topicDocument = await TopicModel.findById(student.topic);
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
                              cond: { $eq: ["$$tag", topicDocument.majorTag] },
                            },
                          },
                        },
                      },
                    },
                  ])
                ).filter(
                  (teacher) => teacher.count !== 0 && teacher.MSCB !== list.MSCB
                );
                //Loop to find if other teachers have free slots that match current slots
                for (
                  let index = 0;
                  index < freeSlotsCurSelectedDate.length;
                  index++
                ) {
                  const slot = freeSlotsCurSelectedDate[index];
                  const freeTeacherList: any[] = matchMajorTeacherList.reduce(
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
                      teacherName: "",
                      topicName: topicDocument.topicName,
                      slots: slot,
                      id: new mongoose.Types.ObjectId(),
                    };
                    isHaveThesisSchedule = true;
                    console.log(
                      student.MSSV,
                      freeTeacherList,
                      slot,
                      currentSelectedDateFormated,
                      isHaveThesisSchedule
                    );
                    scheduleDocument.calendar.scheduleEventList.push({
                      type: ScheduleEventType.ThesisDefenseEvent,
                      thesisDefenseTimeData: thesisDefenseTime,
                    });
                    console.log(student.MSSV, isHaveThesisSchedule);

                    return {
                      ...(student as any).toObject(),
                      isHaveThesisSchedule,
                    };
                  }
                }
              }
              console.log(student.MSSV, isHaveThesisSchedule);
              return { ...(student as any).toObject(), isHaveThesisSchedule };
            })
          );

          return { ...(list as any).toObject(), students: mappedStudents };
        })
      );

      scheduleDocument.studentLists = mappedStudentList;

      return res.status(200).json({ data: scheduleDocument.toObject() });
    },
  },
};

function formatStandardDate(date: any) {
  return dayjs(date).utcOffset(0).startOf("day").format("DD-MM-YYYY");
}

function isCurEventDateMatchCurSelectedDate(
  event: ScheduleEventTime,
  currentSelectedDateFormated: string
) {
  return [
    event?.busyTimeData?.start &&
      formatStandardDate(event?.busyTimeData?.start),
    event?.thesisDefenseTimeData?.start &&
      formatStandardDate(event?.thesisDefenseTimeData?.start),
  ].includes(currentSelectedDateFormated);
}

function isCurDateSlotsListContainCurSlot(
  todayBusyTime: ScheduleEventTime,
  slot: Slot
) {
  return (
    todayBusyTime?.busyTimeData?.slots?.includes(slot) ||
    todayBusyTime?.thesisDefenseTimeData?.slots === slot
  );
}

function isCurEventBelongToCurTeacher(event: ScheduleEventTime, MSCB: string) {
  return (
    [event?.busyTimeData?.MSCB].includes(MSCB) ||
    event?.thesisDefenseTimeData?.MSCB.includes(MSCB)
  );
}
