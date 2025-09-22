import { db } from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResult,
  submitBatch,
} from "../libs/judge0.libs.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // validate testcases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "invalid or missing testcases",
      });
    }

    // 1. making submission ready to submit it to judgeO

    const submissions = stdin.map((input) => {
      return {
        source_code,
        language_id,
        stdin: input,
      };
    });

    //2. sending a submission batch
    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResult(tokens);

    // console.log("Results:-------------");
    //  console.log(results);

    //  <-------------    checking stdout with  expected Output -------------------->

    let allPassed = true;

    let detailedResult = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testcase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.descrpition,
        memory: result.memory ? `${result.memory}KB` : undefined,
        time: result.time ? `${result.time}s` : undefined,
      };
    });

    // console.log(detailedResult);

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
        stderr: detailedResult.some((res) => res.stderr)
          ? JSON.stringify(detailedResult.map((res) => res.stderr))
          : null,
        compileOutput: detailedResult.some((res) => res.compile_output)
          ? JSON.stringify(detailedResult.map((res) => res.compile_output))
          : null,
        time: detailedResult.some((res) => res.time)
          ? JSON.stringify(detailedResult.map((res) => res.time))
          : null,
        memory: detailedResult.some((res) => res.memory)
          ? JSON.stringify(detailedResult.map((res) => res.memory))
          : null,
        status: allPassed ? "Accepted" : "Wrong",
      },
    });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    const TestCasesResults = detailedResult.map((result) => {
      return {
        submissionId: submission.id,
        testcase: result.testcase,
        passed: result.passed,
        stdout: result.stdout,
        stdout: result.stderr,
        expected: result.expected,
        compileOutput: result.compileOutput,
        time: result.time,
        memory: result.memory,
      };
    });

    await db.testCasesResult.createMany({
      data: TestCasesResults,
    });

    const submissionTestcases = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "problem executed succesully",
      submission: submissionTestcases,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "error executing the code",
    });
  }
};
