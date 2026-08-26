import { AccuracySummary, SpatialAnswer } from "@/types/study";

function summarize(answers: SpatialAnswer[]): AccuracySummary {
  const eligibleAnswers = answers.filter(
    (answer) => answer.correctAnswer !== null && !answer.isUncertain
  );
  const correct = eligibleAnswers.filter((answer) => answer.isCorrect === true).length;
  const eligible = eligibleAnswers.length;

  return {
    correct,
    eligible,
    proportion: eligible > 0 ? correct / eligible : null
  };
}

export function calculateSpatialAccuracy(answers: SpatialAnswer[]) {
  return {
    overall: summarize(answers),
    intrinsic: summarize(
      answers.filter((answer) => answer.frameOfReference === "intrinsic")
    ),
    absolute: summarize(
      answers.filter((answer) => answer.frameOfReference === "absolute")
    )
  };
}
