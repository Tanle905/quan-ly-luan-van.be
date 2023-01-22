import { Request, Response } from "express";
import { User } from "../interface/user_and_roles.interface";
import { StudentModel } from "../model/student.model";
import { TeacherModel } from "../model/teacher.model";

export const requestController = {
  sendRequest: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.body;

    if (!MSCB && !MSSV)
      return res.status(400).json({ message: "MSCB and MSSV is required !!!" });

    try {
      const studentDocument = await StudentModel.findOne({
        MSSV,
      }).populate({ path: "profile", select: "-_id -password" });
      const teacherDocument = await TeacherModel.findOne({
        MSCB,
      }).populate({ path: "profile", select: "-_id -password" });

      studentDocument.sentRequestList.push({
        MSCB,
        name: (teacherDocument as any).profile.name,
        email: (teacherDocument as any).profile.email,
      });
      teacherDocument.receivedRequestList.push({
        MSSV,
        name: (studentDocument as any).profile.name,
        email: (studentDocument as any).profile.email,
      });

      studentDocument.save();
      teacherDocument.save();

      delete (studentDocument as any).profile;
      delete (teacherDocument as any).profile;

      return res.status(200).json({
        message: "Request Sent!",
        studentData: studentDocument,
        teacherData: teacherDocument,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
  deleteRequest: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.body;

    if (!MSCB && !MSSV)
      return res.status(400).json({ message: "MSCB and MSSV is required !!!" });

    try {
      const studentDocument = await StudentModel.findOne({
        MSSV,
      });
      const teacherDocument = await TeacherModel.findOne({
        MSCB,
      });

      const filteredSentRequestList = studentDocument.sentRequestList.filter(
        (request) => request.MSCB != MSCB
      );
      studentDocument.sentRequestList = filteredSentRequestList;
      const filteredReceivedRequestList =
        teacherDocument.receivedRequestList.filter(
          (request) => request.MSSV != MSSV
        );
      teacherDocument.receivedRequestList = filteredReceivedRequestList;

      studentDocument.save();
      teacherDocument.save();

      return res.status(200).json({
        message: "Request Deleted!",
        studentData: studentDocument,
        teacherData: teacherDocument,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
