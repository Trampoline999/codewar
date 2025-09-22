import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResult,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  //destruction everything from body.
  const {
    title,
    description,
    difficulty,
    examples,
    tags,
    constraints,
    codeSnippets,
    testcases,
    referenceSolutions,
  } = req.body;

  //agian extra checking for user role.

  if (req.user.role !== "ADMIN") {
    res.status(403).json({
      error: "You don't have permission to create problems",
    });
  }

  // Object.entries(referenceSolutions) gives key,value pair in array format.
  // then we extracting language and solutionCode through destructing from array.

  try {
    for (let [language, solutionCode] of Object.entries(referenceSolutions)) {
      let languageId = getJudge0LanguageId(language);

      if (!languageId) {
        res.status(400).json({
          error: `language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => {
        return {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        };
      });

      // console.log(submissions);

      const submissionsResults = await submitBatch(submissions);
      //  console.log("submission res: ", submissionsResults);
      const tokens = submissionsResults.map((res) => res.token);
      const results = await pollBatchResult(tokens);

      // console.log(results);

      for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // console.log("Results.......", result);

        if (result.status.id !== 3) {
          res.status(400).json({
            message: `testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
      //new problem is created
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          examples,
          tags,
          constraints,
          codeSnippets,
          testcases,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(200).json({
        message: "problem created successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error while creating problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        message: "no problems found",
      });
    }

    return res.status(201).json({
      message: "all problems found successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "failed to fetch problem api",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(400).json({
        message: "problem not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "problem found successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "error while fetching the problem",
    });
  }
};

export const updateProblems = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      examples,
      tags,
      constraints,
      codeSnippets,
      testcases,
      referenceSolutions,
    } = req.body;

    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(400).json({
        message: "problem not found",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "you dont have permission to update problems",
      });
    }

    for (let [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        res.status(400).json({
          error: `language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => {
        return {
          language_id: languageId,
          source_code: solutionCode,
          stdin: input,
          expected_output: output,
        };
      });
      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResult(tokens);

      // console.log("submissions : ", results);

      for (let i = 0; i < results.length; i++) {
        let result = results[i];

        if (result.status.id !== 3)
          res.status(400).json({
            message: `testcase ${i + 1} failed for language ${language}`,
          });
      }

      const problemSaved = await db.problem.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          difficulty,
          examples,
          tags,
          constraints,
          codeSnippets,
          testcases,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      if (!problemSaved) {
        return res.status(404).json({
          error: "error saving problem to database",
        });
      }
      return res.status(200).json({
        success: true,
        message: "problem updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error while updating the problem",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({
        error: "problem not found",k
      });
    }
    await db.problem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "problem deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error while deleting the problem",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const problems = await db.problem.findMany({
      where: {
        solvedProblems: {
          some: {
            userId: userId,
          },
        },
        include: {
          solvedProblems: {
            userId: userId,
          },
        },
      },
    });

    if (problems) {
      res.status(200).json({
        success: true,
        message: "error fetch problem Solved by user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error fetch problem Solved by user",
    });
  }
};
