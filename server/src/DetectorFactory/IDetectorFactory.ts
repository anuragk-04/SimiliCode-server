import IASTGenerator from "../ASTGenerator/IASTGenerator";
import IFilePathGetter from "../FilePathGetter/IFilePathGetter";
import IPlagDetector from "../PlagDetector/IPlagDetector";
import { Node } from "@babel/types";  // safer than babel.Node
import { SubmissionMap } from "../Types/PlagResultType";

/**
 * Interface for plagiarism detector factory.
 * Provides an interface for creating families of related or dependent objects (JS, Python, etc).
 */
interface IDetectorFactory {
    makeFilePathGetter(): IFilePathGetter;
    makeASTGenerator(filePaths: string[]): IASTGenerator;
    makePlagDetector(
        submission1: Node[],
        submission2: Node[],
        file1NameMap: SubmissionMap,
        file2NameMap: SubmissionMap
    ): IPlagDetector;
}

export default IDetectorFactory;
