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
      });
      const teacherDocument = await TeacherModel.findOne({
        MSCB,
      });

      const newRequest = new RequestModel({
        MSSV,
        MSCB,
        studentId: studentDocument._id,
        teacherId: teacherDocument._id,
        teacherName: `${teacherDocument.lastName} ${teacherDocument.firstName}`,
        teacherEmail: teacherDocument.email,
        studentName: `${studentDocument.lastName} ${studentDocument.firstName}`,
        studentEmail: studentDocument.email,
      });

      studentDocument.sentRequestList.unshift(newRequest);
      teacherDocument.receivedRequestList.unshift(newRequest);

      await Promise.all([
        studentDocument.save(),
        teacherDocument.save(),
        newRequest.save(),
      ]);

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
      });
      const teacherDocument = await TeacherModel.findOne({
        MSCB: requestDocument.MSCB,
      });

      studentDocument.teacher = new mongoose.Types.ObjectId(
        teacherDocument._id
      );
      teacherDocument.studentList.unshift(
        new mongoose.Types.ObjectId(studentDocument._id)
      );

      studentDocument.sentRequestList = [];
      const filteredReceivedRequestList =
        teacherDocument.receivedRequestList.filter(
          (request) => request._id != id
        );
      teacherDocument.receivedRequestList = filteredReceivedRequestList;

      await Promise.all([
        studentDocument.save(),
        teacherDocument.save(),
        requestDocument.remove(),
      ]);

      return res.status(200).json({
        message: "Request Accepted!",
        studentData: studentDocument,
        teacherData: teacherDocument,
      });
    } catch (error) {
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
      const filteredReceivedRequestList =
        teacherDocument.receivedRequestList.filter(
          (request) => request._id != id
        );
      studentDocument.sentRequestList = filteredSentRequestList;
      teacherDocument.receivedRequestList = filteredReceivedRequestList;

      await Promise.all([
        studentDocument.save(),
        teacherDocument.save(),
        requestDocument.remove(),
      ]);

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
