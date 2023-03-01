import { cloneDeep, orderBy } from "lodash";
import {
  BusyTime,
  CalculatedCalendar,
  ScheduleCalendar,
  StudentList,
  ThesisDefenseTime,
} from "../interface/schedule.interface";
import { Student } from "../interface/student.interface";

export interface MatchedTeacher {
  MSCB: string;
  teacherName: string;
  matchedTags: number;
}

export function handleCalCulateThesisDefenseTime(
  studentLists: StudentList[],
  calendar: ScheduleCalendar,
  calculatedClendar: CalculatedCalendar
) {
  const mappedStudentLists = studentLists.map((list): StudentList => {
    const mappedStudentList = list.students.map((student, index): Student => {
      let suitableThesisDefenseTeacherList: MatchedTeacher[] | null = null;
      let selectedTimeIndex = 0;

      while (
        !suitableThesisDefenseTeacherList &&
        selectedTimeIndex < calculatedClendar.calculatedFreeTimesList.length
      ) {
        const matchedTagsFreeTeacherList: MatchedTeacher[] =
          calculatedClendar.calculatedFreeTimesList[
            selectedTimeIndex
          ].calculatedFreeTeachersList.reduce((prevTeacher, curTeacher) => {
            const matchedTags = student.sentTopic.tags?.reduce((prev, cur) => {
              if (curTeacher.majorTags.includes(cur.name)) return (prev += 1);
              return prev;
            }, 0);

            if (matchedTags > 0)
              return [
                ...prevTeacher,
                {
                  MSCB: curTeacher.MSCB,
                  teacherName: `${curTeacher.firstName} ${curTeacher.lastName}`,
                  matchedTags,
                },
              ];

            return prevTeacher;
          }, []);

        if (matchedTagsFreeTeacherList.length > 3) {
          suitableThesisDefenseTeacherList = cloneDeep<MatchedTeacher[]>(
            orderBy(
              matchedTagsFreeTeacherList,
              (teacher) => teacher.matchedTags,
              "desc"
            ).slice(0, 3)
          );
          return;
        }
        selectedTimeIndex += 1;
      }
      if (suitableThesisDefenseTeacherList) {
        suitableThesisDefenseTeacherList.forEach((teacher) => {
          const newThesisDefenseTime: ThesisDefenseTime = {
            ...calculatedClendar.calculatedFreeTimesList[selectedTimeIndex],
            MSCB: teacher.MSCB,
            MSSV: student.MSSV,
            studentName: `${student.firstName} ${student.lastName}`,
            teacherName: teacher.teacherName,
            topicName: student.sentTopic.topicName,
          };

          calendar.thesisDefenseTimesList.push(newThesisDefenseTime);
        });

        return {
          ...student,
          suitableThesisDefenseTeacherList,
          thesisDefenseTime:
            calculatedClendar.calculatedFreeTimesList[selectedTimeIndex],
        };
      }

      return student;
    });
    const filteredStudentList = mappedStudentList.filter(
      (student) => student.suitableThesisDefenseTeacherList
    );

    return { ...list, students: filteredStudentList };
  });
  const filterStudentLists = mappedStudentLists.filter(
    (studentList) =>
      !studentList.students.find((student) => student.thesisDefenseTime)
  );

  return { filterStudentLists, calendar, calculatedClendar };
}
