import { promises as fs } from "fs";
import path from "path";
import extract from "extract-zip";
import IExtractor from "./IExtractor";

/**
 * Class implements IExtractor. 
 * Extracts zip files to a given directory path.
 */
class ExtractZipFiles implements IExtractor {

  // Clear directory if it exists
  private async clearDirectory(directoryPath: string): Promise<void> {
    try {
      const files = await fs.readdir(directoryPath);
      for (const file of files) {
        const fullPath = path.join(directoryPath, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }
      }
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error(`Error while clearing directory: ${(error as Error).message}`);
      }
    }
  }

  // Create directory (or clear if already exists)
  private async createDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.mkdir(directoryPath, { recursive: true });
      await this.clearDirectory(directoryPath);
    } catch (error: unknown) {
      throw new Error(`Error while creating directory: ${(error as Error).message}`);
    }
  }

  // Extract the zip file
  async extract(compressedFilePath: string, submissionPath: string): Promise<void> {
    try {
      const resolvedPath = path.resolve(submissionPath);
      await this.createDirectory(resolvedPath);
      await extract(compressedFilePath, { dir: resolvedPath });
    } catch (error: unknown) {
      throw new Error(`Extraction failed: ${(error as Error).message}`);
    }
  }
}

export default ExtractZipFiles;
