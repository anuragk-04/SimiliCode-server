import IASTGenerator from "../ASTGenerator/IASTGenerator";
import IDetectorFactory from "../DetectorFactory/IDetectorFactory";
import IFilePathGetter from "../FilePathGetter/IFilePathGetter";
import IPlagDetector from "../PlagDetector/IPlagDetector";
import * as babel from "@babel/core";
import { PlagResult, SubmissionCode, SubmissionMap } from "../Types/PlagResultType";

/**
 * Class implements runPlagiarism method (Client in Abstract Factory Design pattern)
 */
class PlagiarismRunner {
  private submission1Path: string;
  private submission2Path: string;

  constructor(submission1Path: string, submission2Path: string) {
    this.submission1Path = submission1Path;
    this.submission2Path = submission2Path;
  }

  /**
   * Run plagiarism detection using a given IDetectorFactory.
   * @param detectorFactory Factory implementing IDetectorFactory.
   * @returns PlagResult object containing plagiarism results.
   */
  runPlagiarism(detectorFactory: IDetectorFactory): PlagResult {
    const filePathGetter: IFilePathGetter = detectorFactory.makeFilePathGetter();

    const sub1FilePaths: string[] = filePathGetter.getFilePaths(this.submission1Path);
    const sub2FilePaths: string[] = filePathGetter.getFilePaths(this.submission2Path);

    if (!sub1FilePaths.length || !sub2FilePaths.length) {
      throw new Error("empty directory");
    }

    // Generate ASTs for both submissions
    const sub1ASTGen: IASTGenerator = detectorFactory.makeASTGenerator(sub1FilePaths);
    const sub2ASTGen: IASTGenerator = detectorFactory.makeASTGenerator(sub2FilePaths);

    const sub1Nodes: babel.Node[] = sub1ASTGen.generateASTs();
    const sub2Nodes: babel.Node[] = sub2ASTGen.generateASTs();

    // Get file contents and file maps
    const sub1MapFileToContent: SubmissionCode = sub1ASTGen.getFileContents();
    const sub1FileMaps: SubmissionMap = sub1ASTGen.getFileMaps();

    const sub2MapFileToContent: SubmissionCode = sub2ASTGen.getFileContents();
    const sub2FileMaps: SubmissionMap = sub2ASTGen.getFileMaps();

    // Run plagiarism detection
    const plagDetector: IPlagDetector = detectorFactory.makePlagDetector(
      sub1Nodes,
      sub2Nodes,
      sub1FileMaps,
      sub2FileMaps
    );

    const result: PlagResult = plagDetector.detect();

    // Append original file content
    result.submission1 = sub1MapFileToContent;
    result.submission2 = sub2MapFileToContent;

    return result;
  }
}

export default PlagiarismRunner;
