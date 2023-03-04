import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import mongoose, { SortOrder } from "mongoose";
import { RequestModel } from "../model/request.model";
import { StudentModel } from "../model/student.model";
import { TeacherModel } from "../model/teacher.model";

export const requestController = {
  getRequest: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;
    const { userId } = res.locals;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    try {
      const requestDocument = await RequestModel.find({
        $or: [
          { studentId: new ObjectId(userId) },
          { teacherId: new ObjectId(userId) },
        ],
        ...(search
          ? {
              $or: [
                { studentName: { $regex: search, $options: "i" } },
                { studentEmail: { $regex: search, $options: "i" } },
                { teacherName: { $regex: search, $options: "i" } },
                { teacherEmail: { $regex: search, $options: "i" } },
                { MSSV: { $regex: search, $options: "i" } },
                { MSCB: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      }).sort(
        sortBy && {
          [sortBy as string]: parseInt(isAscSorting as string) as SortOrder,
        }
      );

      return res.status(200).json({ data: requestDocument });
    } catch (error: any) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  sendRequest: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.body;

    if (!MSCB && !MSSV)
      return res.status(400).json({ message: "MSCB and MSSV is required" });

    try {
      const studentDocument = await StudentModel.findOne({
        MSSV,
      });
      const teacherDocument = await TeacherModel.findOne({
        MSCB,
      });
      const newRequest = new RequestModel({
        MSSV,
        MSCB,
        studentId: new ObjectId(studentDocument._id),
        teacherId: new ObjectId(teacherDocument._id),
        teacherName: `${teacherDocument.lastName} ${teacherDocument.firstName}`,
        teacherEmail: teacherDocument.email,
        studentName: `${studentDocument.lastName} ${studentDocument.firstName}`,
        studentEmail: studentDocument.email,
      });

      studentDocument.sentRequestsList.push(teacherDocument._id);

      await Promise.all([studentDocument.save(), newRequest.save()]);

      return res.status(200).json({
        message: "Request Sent!",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  acceptRequest: async (req: Request, res: Response) => {
    const { id: requestId } = req.body;
    if (!requestId)
      return res.status(400).json({ message: "Request id is required" });

    try {
      const requestDocument = await RequestModel.findById(requestId);
      const studentDocument = await StudentModel.findOne({
        MSSV: requestDocument.MSSV,
      });
      const teacherDocument = await TeacherModel.findOne({
        MSCB: requestDocument.MSCB,
      });

      studentDocument.teacher = new mongoose.Types.ObjectId(
        teacherDocument._id
      );
      studentDocument.sentRequestsList = null;
      teacherDocument.studentList.unshift(
        new mongoose.Types.ObjectId(studentDocument._id)
      );

      await Promise.all([
        studentDocument.save(),
        teacherDocument.save(),
        await RequestModel.deleteMany({
          studentId: new ObjectId(studentDocument._id),
        }),
      ]);

      return res.status(200).json({
        message: "Request Accepted!",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  rejectRequest: async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({ message: "Request id is required !!!" });

    try {
      const requestDocument = await RequestModel.findById(id);

      await requestDocument.remove();

      return res.status(200).json({
        message: "Request Deleted!",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
