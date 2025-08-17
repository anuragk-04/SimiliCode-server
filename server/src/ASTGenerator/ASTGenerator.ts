import IASTGenerator from "./IASTGenerator";
import * as babel from "@babel/core";
import { SubmissionCode, SubmissionMap } from "../Types/PlagResultType";
import fs from "fs";

/**
 * Class implements IASTGenerator.
 * Generates AST nodes from JavaScript files in given paths.
 */
class ASTGenerator implements IASTGenerator {
  private fileMap: SubmissionMap = {};
  private mapFileToContent: SubmissionCode = {};
  private filePaths: string[];

  constructor(filePaths: string[]) {
    this.filePaths = filePaths;
  }

  // Method to generate all root nodes.
  generateASTs(): babel.Node[] {
    const nodes: babel.Node[] = [];

    this.filePaths.forEach((filePath, index) => {
      // Clean up path to store relative path for mapping
      const newPath = filePath.split(/Submission\d{1}[\\/]{1,2}/)[1] || filePath;
      this.fileMap[index] = newPath;

      const ast = babel.transformFileSync(filePath, { ast: true, code: false })?.ast;
      if (ast) nodes.push(ast);

      const content = fs.readFileSync(filePath, "utf-8");
      this.mapFileToContent[newPath] = content;
    });

    return nodes;
  }

  // Method to get the map of file to its content.
  getFileContents(): SubmissionCode {
    return this.mapFileToContent;
  }

  // Method to get map of index to the file path.
  getFileMaps(): SubmissionMap {
    return this.fileMap;
  }
}

export default ASTGenerator;
