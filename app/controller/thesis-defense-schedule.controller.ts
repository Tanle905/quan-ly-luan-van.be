import { parse } from "csv-parse";
import { Request, Response } from "express";
import { readFileSync } from "fs";
import { cloneDeep } from "lodash";
import { StudentList } from "../interface/schedule.interface";
import { Student } from "../interface/student.interface";

export const thesisDefenseScheduleController = {
  studentList: {
    import: async (req: Request, res: Response) => {
      const data = readFileSync(req.file?.path);

      if (!data) return res.status(400);

      parse(data, (e, r) => handleParseStudentList(res, e, r));
      return res.status(200);
    },
  },
};

export function handleParseStudentList(res, err, records) {
  if (err) {
    return res
      .status(400)
      .json({ success: false, message: "An error occurred" });
  }

  console.log(handleConvertStudentList(records));

  return res.json({ data: records });
}

export function handleConvertStudentList(list: any[][]): Student[] {
  const listKeys = cloneDeep(list[0]);
  list.shift();

  const reducedStudentList: any[] = list.reduce((prevArr, curArr) => {
    const mapped = listKeys.reduce((prevKey, curKey, index) => {
      return { ...prevKey, [curKey]: curArr[index] };
    }, {});

    return [...prevArr, mapped];
  }, []);

  return reducedStudentList.reduce((prevStudent, curStudent): Student[] => {
    return [
      ...prevStudent,
      {
        MSSV: curStudent.MSSV,
        class: curStudent.class,
        department: curStudent.department,
        major: curStudent.major,
        email: curStudent.email,
        firstName: curStudent.firstName,
        lastName: curStudent.lastName,
        thesisDefenseTime: undefined,
      },
    ];
  }, []);
}
