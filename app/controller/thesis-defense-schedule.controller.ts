import { Request, Response } from "express";

export const thesisDefenseScheduleController = {
  studentList: {
    import: async (req: Request, res: Response) => {
      const { data } = req.body;

      console.log(data);
      return res.status(200).json({message: ""});
    },
  },
};
