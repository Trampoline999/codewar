import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllSubmission,
  getSubmissionCount,
  getSubmissionProblem,
} from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission);
submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  getSubmissionProblem
);
submissionRoutes.get(
  "/get-all-submissions-count/:problemId",
  authMiddleware,
  getSubmissionCount
);

export default submissionRoutes;
