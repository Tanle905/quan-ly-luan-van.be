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
