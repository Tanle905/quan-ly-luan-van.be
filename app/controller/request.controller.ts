import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { RequestModel } from "../model/request.model";
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
      }).populate({ path: "profile", select: " -password" });
      const teacherDocument = await TeacherModel.findOne({
        MSCB,
      }).populate({ path: "profile", select: " -password" });

      const newRequest = new RequestModel({
        MSSV,
        MSCB,
        studentId: (studentDocument as any).profile._id,
        teacherId: (teacherDocument as any).profile._id,
        teacherName: `${(teacherDocument as any).profile.lastName} ${
          (teacherDocument as any).profile.firstName
        }`,
        teacherEmail: (teacherDocument as any).profile.email,
        studentName: `${(studentDocument as any).profile.lastName} ${
          (studentDocument as any).profile.firstName
        }`,
        studentEmail: (studentDocument as any).profile.email,
      });

      studentDocument.sentRequestList.push(newRequest);
      teacherDocument.receivedRequestList.push(newRequest);

      studentDocument.save();
      teacherDocument.save();
      newRequest.save();

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
  acceptRequest: async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({ message: "Request id is required !!!" });

    try {
      const requestDocument = await RequestModel.findById(id);

      const studentDocument = await StudentModel.findOne({
        MSSV: requestDocument.MSSV,
      }).populate("profile");
      const teacherDocument = await TeacherModel.findOne({
        MSCB: requestDocument.MSCB,
      }).populate("profile");

      studentDocument.teacher = new mongoose.Types.ObjectId(
        teacherDocument._id
      );
      teacherDocument.studentList.push(
        new mongoose.Types.ObjectId(studentDocument._id)
      );

      const filteredSentRequestList = studentDocument.sentRequestList.filter(
        (request) => request._id != id
      );
      studentDocument.sentRequestList = filteredSentRequestList;
      const filteredReceivedRequestList =
        teacherDocument.receivedRequestList.filter(
          (request) => request._id != id
        );
      teacherDocument.receivedRequestList = filteredReceivedRequestList;

      await studentDocument.save();
      await teacherDocument.save();
      requestDocument.remove();

      return res.status(200).json({
        message: "Request Accepted!",
        studentData: studentDocument,
        teacherData: teacherDocument,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  },
  rejectRequest: async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({ message: "Request id is required !!!" });

    try {
      const requestDocument = await RequestModel.findById(id);
      const studentDocument = await StudentModel.findOne({
        MSSV: requestDocument.MSSV,
      });
      const teacherDocument = await TeacherModel.findOne({
        MSCB: requestDocument.MSCB,
      });

      const filteredSentRequestList = studentDocument.sentRequestList.filter(
        (request) => request._id != id
      );
      studentDocument.sentRequestList = filteredSentRequestList;
      const filteredReceivedRequestList =
        teacherDocument.receivedRequestList.filter(
          (request) => request._id != id
        );
      teacherDocument.receivedRequestList = filteredReceivedRequestList;

      await studentDocument.save();
      await teacherDocument.save();
      requestDocument.remove();

      return res.status(200).json({
        message: "Request Deleted!",
        studentData: studentDocument,
        teacherData: teacherDocument,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  },
};
