import formidable, { File, Fields, Files } from "formidable";
import path from "path";
import { Request, Response } from "express";
import JSDetectorFactory from "../DetectorFactory/JSDetectorFactory";
import PlagiarismRunner from "../PlagiarismRunner/PlagiarismRunner";
import ExtractZipFiles from "../Extractor/ExtractZipFiles";
import { PlagResult } from "../Types/PlagResultType";

// Fixed submission directories
const submission1Directory = "/Submissions/Submission1";
const submission2Directory = "/Submissions/Submission2";

const submission1Path = path.join(__dirname, "../", submission1Directory);
const submission2Path = path.join(__dirname, "../", submission2Directory);

// Max file size
const MAX_FILE_SIZE = 15 * 1024 * 1024;

async function serveRequest(req: Request, res: Response): Promise<void> {
  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
    });

    // Parse formidable files
    const [fields, files] = await new Promise<[Fields, Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    // Extract first file from the arrays (Files<string> → File)
    const compressedSub1 = (files.submission1 as File[])[0];
    const compressedSub2 = (files.submission2 as File[])[0];

    // Only accept zip files
    if (
      path.extname(compressedSub1.originalFilename || "") !== ".zip" ||
      path.extname(compressedSub2.originalFilename || "") !== ".zip"
    ) {
      res.status(400).send([{ message: "Only zip folders are accepted" }]);
      return;
    }

    try {
      const extractor = new ExtractZipFiles();
      await extractor.extract(compressedSub1.filepath, submission1Path);
      await extractor.extract(compressedSub2.filepath, submission2Path);
    } catch (err) {
      res.status(400).send([{ message: "Error in extracting files" }]);
      return;
    }

    try {
      const plagiarismRunner = new PlagiarismRunner(submission1Path, submission2Path);
      const detectorFactory = new JSDetectorFactory();

      // Run plagiarism (JSDetectorFactory now returns synchronous file paths)
      const results: PlagResult[] = [plagiarismRunner.runPlagiarism(detectorFactory)];

      res.status(200).send(results);
    } catch (err: any) {
      if (err.message === "empty directory") {
        res.status(400).send([{
          message: ".zip files either contain empty directories or no .js files"
        }]);
      } else {
        res.status(400).send([{ message: "Something went wrong!" }]);
      }
    }

  } catch (err) {
    res.status(400).send([{ message: "Max file size exceeded or invalid request" }]);
  }
}

export default serveRequest;
