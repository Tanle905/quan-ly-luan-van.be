import { Request, Response } from "express";
import { cloneDeep } from "lodash";
import { ObjectId } from "mongodb";
import { SortOrder } from "mongoose";
import { StudentModel } from "../model/student.model";
import { TeacherModel } from "../model/teacher.model";
import { TopicModel } from "../model/topic.model";

export const studentController = {
  getStudent: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;
    const { userId } = res.locals;

    try {
      const studentDocuments = await StudentModel.find({
        teacher: new ObjectId(userId),
        ...(search
          ? {
              $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { MSSV: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      })
        .select("-password")
        .sort(
          sortBy
            ? {
                [sortBy as string]: parseInt(
                  isAscSorting as string
                ) as SortOrder,
              }
            : { MSSV: 1 }
        )
        .limit(10);
      const mappedStudentDocument = await Promise.all(
        studentDocuments.map(async (doc) => {
          const topic = await TopicModel.findById(doc.topic);
          return { ...doc.toObject(), topic };
        })
      );

      return res.status(200).json({
        data: mappedStudentDocument,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  getStudentByMSSV: async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const { MSSV } = req.params;

    try {
      const studentDocument = await StudentModel.findOne({
        teacher: new ObjectId(userId),
        MSSV,
      }).select("-password");
      const topic = await TopicModel.findById(studentDocument.topic);

      return res.status(200).json({
        data: { ...studentDocument.toObject(), topic },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  deleteStudentByMSSV: async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const { MSSV } = req.params;

    try {
      const teachertDocument = await TeacherModel.findOne({
        _id: new ObjectId(userId),
      }).select("-password");
      const studentDocument = await StudentModel.findOne({
        teacher: new ObjectId(userId),
        MSSV,
      }).select("-password");
      const filteredStudentList = teachertDocument.studentList.filter(
        (student) => student.toString() !== studentDocument._id.toString()
      );

      teachertDocument.studentList = filteredStudentList;
      studentDocument.teacher = null;
      studentDocument.topic = null;

      await Promise.all([
        teachertDocument.save(),
        studentDocument.save(),
        TopicModel.findOneAndDelete({ _id: studentDocument.topic }),
      ]);

      return res.status(200).json({
        message: "Remove student from list completed.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  exportStudent: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      const studentDocuments = await StudentModel.find({
        teacher: new ObjectId(userId),
      }).select(
        "-_id -password -username -imageUrl -roles -sentRequestList -createdAt -updatedAt -__v -teacher -notification -notificationCount"
      );

      return res.status(200).json({
        data: studentDocuments.map((doc) => {
          const clonedDoc = cloneDeep(doc.toObject()) as any;
          clonedDoc.topicName = clonedDoc.sentTopic?.topicName;
          delete clonedDoc.__t;
          delete clonedDoc.sentTopic;

          return {
            ...clonedDoc,
            ["Cho phép báo cáo"]: "",
            ["Nhận diểm I"]: "",
          };
        }),
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
