import dayjs from "dayjs";
import { ScheduleEventType, Slot } from "../constants and enums/variable";
import { ScheduleEventTime } from "../interface/schedule.interface";
import { Student } from "../interface/student.interface";

export function isStudentHaveThesisSchedule(
  student: Student,
  events: ScheduleEventTime[]
) {
  return events.find(
    (e) =>
      e.type === ScheduleEventType.ThesisDefenseEvent &&
      e.thesisDefenseTimeData.MSSV === student.MSSV
  );
}

export function formatStandardDate(date: any) {
  return dayjs(date).utcOffset(0).startOf("day").format("DD-MM-YYYY");
}

export function isCurEventDateMatchCurSelectedDate(
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

export function isCurDateSlotsListContainCurSlot(
  todayBusyTime: ScheduleEventTime,
  slot: Slot
) {
  return (
    todayBusyTime?.busyTimeData?.slots?.includes(slot) ||
    todayBusyTime?.thesisDefenseTimeData?.slots === slot
  );
}

export function isCurEventBelongToCurTeacher(
  event: ScheduleEventTime,
  MSCB: string
) {
  return (
    [event?.busyTimeData?.MSCB].includes(MSCB) ||
    event?.thesisDefenseTimeData?.MSCB.includes(MSCB)
  );
}
