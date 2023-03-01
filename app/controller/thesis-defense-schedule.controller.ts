import { Request, Response } from "express";

export const thesisDefenseScheduleController = {
  studentList: {
    import: async (req: Request, res: Response) => {
      console.log(req.body);
    },
  },
};
