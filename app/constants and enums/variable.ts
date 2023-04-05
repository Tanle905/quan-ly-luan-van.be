export const ROLES = {
  STUDENT: "ROLE_STUDENT",
  TEACHER: "ROLE_TEACHER",
  ADMIN: "ROLE_ADMIN",
};
export const SYSTEM_ROLES = [ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER];
export enum TopicStatus {
  Pending = "pending",
  RequestChange = "requestChange",
  Accepted = "accepted",
}
export enum ThesisStatus {
  IsReadyForThesisDefense = "isReadyForThesisDefense",
  IsMarkedForIncomplete = "isMarkedForIncomplete",
}
export enum ScheduleEventType {
  BusyEvent = "busyEvent",
  ThesisDefenseEvent = "thesisDefenseEvent",
}
export enum Slot {
  Slot1 = 1, //7h-8h
  Slot2 = 2, //8h-9h
  Slot3 = 3, //9h-10h
  Slot4 = 4, //10h-11h
  Slot5 = 5, //11h-12h
  Slot6 = 6, //13h-14h
  Slot7 = 7, //14h-5h
  Slot8 = 8, //15h-16h
  Slot9 = 9, //16h-17h
  Slot10 = 10, //17h-18h
}
export const SLOTS: Slot[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const slotsData: { name: string; value: Slot }[] = [
  { name: "7h", value: Slot.Slot1 },
  { name: "8h", value: Slot.Slot2 },
  { name: "9h", value: Slot.Slot3 },
  { name: "10h", value: Slot.Slot4 },
  { name: "11h", value: Slot.Slot5 },
  { name: "13h", value: Slot.Slot6 },
  { name: "14h", value: Slot.Slot7 },
  { name: "15h", value: Slot.Slot8 },
  { name: "16h", value: Slot.Slot9 },
  { name: "17h", value: Slot.Slot10 },
];
