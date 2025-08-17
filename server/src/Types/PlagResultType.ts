// Type for similarity lines object
export type SimilarityLines = {
  file: string;
  lines: number[];
};

// Type for similarity submissions object
export type SimilaritySubmissions = {
  submission1: SimilarityLines;
  submission2: SimilarityLines;
};

// Type for plagiarism result object
export type PlagResult = {
  submission1: SubmissionCode;
  submission2: SubmissionCode;
  score: number;
  similarities: Record<number, SimilaritySubmissions>; // clearer separation
};

// Type for submission content object
export type SubmissionCode = Record<string, string>;

// Type for submission file map object
export type SubmissionMap = Record<number, string>;
