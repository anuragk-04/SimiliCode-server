import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import IExtractor from './IExtractor';

/**
 * Class implements IExtractor. 
 * Extracts zip files to a given directory path.
 */
class ExtractZipFiles implements IExtractor {

  // Clear directory if it exists.
  private async clearDirectory(directoryPath: string): Promise<void> {
    try {
      if (!fs.existsSync(directoryPath)) return;

      const files = fs.readdirSync(directoryPath);
      for (const file of files) {
        const fullPath = path.join(directoryPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
      }
    } catch (error: any) {
      throw new Error(`Error while clearing directory: ${error.message}`);
    }
  }

  // Create directory (or clear if already exists)
  private async createDirectory(directoryPath: string): Promise<void> {
    try {
      if (fs.existsSync(directoryPath)) {
        await this.clearDirectory(directoryPath);
      } else {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
    } catch (error: any) {
      throw new Error(`Error while creating directory: ${error.message}`);
    }
  }

  // Extract the zip file
  async extract(compressedFilePath: string, submissionPath: string): Promise<void> {
    try {
      await this.createDirectory(submissionPath);
      await extract(compressedFilePath, { dir: submissionPath });
    } catch (error: any) {
      throw new Error(`Extraction failed: ${error.message}`);
    }
  }
}

export default ExtractZipFiles;
