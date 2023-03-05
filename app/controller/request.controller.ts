import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import mongoose, { SortOrder } from "mongoose";
import { RequestModel } from "../model/request.model";
import { StudentModel } from "../model/student.model";
import { TeacherModel } from "../model/teacher.model";
import { TopicModel } from "../model/topic.model";

export const requestController = {
  getRequest: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;
    const { userId } = res.locals;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    try {
      const requestDocuments = await RequestModel.find({
        $or: [
          { "student._id": new ObjectId(userId) },
          { "teacher._id": new ObjectId(userId) },
        ],
        ...(search
          ? {
              $or: [
                { "student.MSSV": { $regex: search, $options: "i" } },
                { "student.firstName": { $regex: search, $options: "i" } },
                { "student.lastName": { $regex: search, $options: "i" } },
                { "student.email": { $regex: search, $options: "i" } },
                { "teacher.MSCB": { $regex: search, $options: "i" } },
                { "teacher.firstName": { $regex: search, $options: "i" } },
                { "teacher.lastName": { $regex: search, $options: "i" } },
                { "teacher.email": { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      }).sort(
        sortBy && [
          [
            `student.${sortBy as string}`,
            parseInt(isAscSorting as string) as SortOrder,
          ],
          [
            `teacher.${sortBy as string}`,
            parseInt(isAscSorting as string) as SortOrder,
          ],
        ]
      );
      const mappedRequestDocuments = await Promise.all(
        requestDocuments.map(async (doc) => {
          const topic = await TopicModel.findById(doc.topic);

          return { ...doc.toObject(), topic };
        })
      );

      return res.status(200).json({ data: mappedRequestDocuments });
    } catch (error: any) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  getRequestyId: async (req: Request, res: Response) => {
    const { requestId } = req.params;

    if (!requestId || requestId === "undefined")
      return res.status(400).json({ message: "Request id is required" });

    try {
      const requestDocument = await RequestModel.findById(
        new ObjectId(requestId)
      );
      const topic = await TopicModel.findById(requestDocument.topic);

      return res.status(200).json({ data: { ...requestDocument.toObject(), topic } });
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
      }).select("-username -password");
      const teacherDocument = await TeacherModel.findOne({
        MSCB,
      }).select("-username -password");
      const newRequest = new RequestModel({
        student: studentDocument,
        teacher: teacherDocument,
      });
      const newTopic = new TopicModel({
        MSCB,
        MSSV,
        studentName: `${studentDocument.lastName} ${studentDocument.firstName}`,
        topicDescription: "",
        topicName: "",
      });
      newRequest.topic = new mongoose.Types.ObjectId(newTopic._id);
      studentDocument.sentRequestsList.push(teacherDocument._id);

      await Promise.all([
        studentDocument.save(),
        newRequest.save(),
        newTopic.save(),
      ]);

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
        MSSV: requestDocument.student.MSSV,
      }).select("-username -password");
      const teacherDocument = await TeacherModel.findOne({
        MSCB: requestDocument.teacher.MSCB,
      }).select("-username -password");

      studentDocument.teacher = new mongoose.Types.ObjectId(
        teacherDocument._id
      );
      studentDocument.sentRequestsList = [];
      teacherDocument.studentList.unshift(
        new mongoose.Types.ObjectId(studentDocument._id)
      );
      studentDocument.topic = requestDocument.topic;

      await Promise.all([
        studentDocument.save(),
        teacherDocument.save(),
        RequestModel.deleteMany({
          "student._id": new ObjectId(studentDocument._id),
        }),
        TopicModel.deleteMany({
          MSSV: studentDocument.MSSV,
          _id: { $ne: requestDocument.topic },
        }),
      ]);

      return res.status(200).json({
        message: "Request Accepted!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  rejectRequest: async (req: Request, res: Response) => {
    const { id, MSSV } = req.body;

    if (!id)
      return res.status(400).json({ message: "Request id is required !!!" });

    try {
      const studentDocument = await StudentModel.findOne({
        MSSV,
      }).select("-username -password");
      const requestDocument = await RequestModel.findById(id);

      studentDocument.sentRequestsList =
        studentDocument.sentRequestsList.filter(
          (teacherId) => teacherId !== requestDocument.teacher._id.toString()
        );

      await Promise.all([
        studentDocument.save(),
        TopicModel.deleteOne({ _id: requestDocument.topic }),
        requestDocument.remove(),
      ]);

      return res.status(200).json({
        message: "Request Deleted!",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
