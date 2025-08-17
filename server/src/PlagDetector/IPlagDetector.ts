import { PlagResult } from "../Types/PlagResultType";

/**
 * Interface for plagiarism detector.
 * Provides detect method which detects plagiarism for two submissions.
 */
interface IPlagDetector {
  detect(): PlagResult; // Returns a plagiarism result synchronously
}

export default IPlagDetector;
