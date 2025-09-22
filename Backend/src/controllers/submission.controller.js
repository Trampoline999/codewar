import { db } from "../libs/db.js";

const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.userId;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      message: "find all the submission successfully",
      submissions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "error getting all submissions",
    });
  }
};

const getSubmissionProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user.id;

    const submissionsByProblem = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    res.status(200).json({
      message: "find all the submission by problem successfully",
      submissionsByProblem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "error getting submissions by problem",
    });
  }
};

const getSubmissionCount = async (req, res) => {
  try {
    
    const problemId = req.user.problemId;

    const submissionCount = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    res.status(200).json({
      message: "find all the submission successfully",
      submissionCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "error getting the submissions count",
    });
  }
};

export { getAllSubmission, getSubmissionProblem, getSubmissionCount };
