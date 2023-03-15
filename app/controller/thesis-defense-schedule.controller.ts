import dayjs from "dayjs";
import { Request, Response } from "express";
import {
  ROLES,
  ScheduleEventType,
  SLOTS,
} from "../constants and enums/variable";
import { ScheduleEventTime } from "../interface/schedule.interface";
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
      const eventList = scheduleDocument.calendar.scheduleEventList;
      const thesisDefenseStartDate = dayjs(
        scheduleDocument.calendar.thesisDefenseWeek
      )
        .utcOffset(0)
        .startOf("day");

      studentLists.forEach((list) => {
        //Check for student list owner's free slot
        if (list.MSCB === "CB22222") return;
        const currentTeacherBusyTimeList = eventList.filter((event) =>
          [
            event?.busyTimeData?.MSCB,
            event?.thesisDefenseTimeData?.MSCB,
          ].includes(list.MSCB)
        );

        list.students.map(async (student, index) => {
          //TODO: change later
          if (index > 0) return;
          //TODO: change later
          for (let index = 0; index < 1; index++) {
            const currentSelectedDate = thesisDefenseStartDate
              .add(index, "day")
              .format("DD-MM-YYYY");
            const todayBusyTime = currentTeacherBusyTimeList.find((event) =>
              [
                event?.busyTimeData?.start &&
                  dayjs(event?.busyTimeData?.start)
                    .utcOffset(0)
                    .startOf("day")
                    .format("DD-MM-YYYY"),
                event?.thesisDefenseTimeData?.start &&
                  dayjs(event?.thesisDefenseTimeData?.start)
                    .utcOffset(0)
                    .startOf("day")
                    .format("DD-MM-YYYY"),
              ].includes(currentSelectedDate)
            );
            const freeSlotsCurSelectedDate = todayBusyTime
              ? SLOTS.filter(
                  (slot) =>
                    !(
                      todayBusyTime?.busyTimeData?.slots?.includes(slot) ||
                      todayBusyTime?.thesisDefenseTimeData?.slots.includes(slot)
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
            ).filter((teacher) => teacher.count !== 0);
            //Loop to find if other teachers have free slots that match current slots
            freeSlotsCurSelectedDate.map((slot) => {
              const freeTeacherList = matchMajorTeacherList.reduce(
                (prevTeacher, curTeacher) => {
                  return eventList.find(
                    (event) =>
                      [
                        event?.busyTimeData?.start &&
                          dayjs(event?.busyTimeData?.start)
                            .utcOffset(0)
                            .startOf("day")
                            .format("DD-MM-YYYY"),
                        event?.thesisDefenseTimeData?.start &&
                          dayjs(event?.thesisDefenseTimeData?.start)
                            .utcOffset(0)
                            .startOf("day")
                            .format("DD-MM-YYYY"),
                      ].includes(currentSelectedDate) &&
                      [
                        event?.busyTimeData?.MSCB,
                        event?.thesisDefenseTimeData?.MSCB,
                      ].includes(curTeacher.MSCB) &&
                      (event?.busyTimeData?.slots?.includes(slot) ||
                        event?.thesisDefenseTimeData?.slots.includes(slot))
                  )
                    ? prevTeacher
                    : [...prevTeacher, curTeacher.MSCB];
                },
                []
              );

              console.log(freeTeacherList, slot, currentSelectedDate);
            });
          }
        });
      });
    },
  },
};
