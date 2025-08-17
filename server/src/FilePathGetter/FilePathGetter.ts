import IFilePathGetter from "./IFilePathGetter";
import fs from "fs";
import path from "path";

/**
 * Class implements IFilePathGetter interface. 
 * Takes a directory and fetches all .js files in nested directories.
 */
class FilePathGetter implements IFilePathGetter {

    // Method to get all file paths in directory and subdirectories (synchronous)
    getFilePaths(directoryPath: string): string[] {
        const arrayOfFiles: string[] = [];
        return this.getDeepFilePaths(directoryPath, arrayOfFiles);
    }

    // Helper method to recursively fetch .js files
    private getDeepFilePaths(directoryPath: string, arrayOfFiles: string[]): string[] {
        const files = fs.readdirSync(directoryPath, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(directoryPath, file.name);

            if (file.isDirectory()) {
                this.getDeepFilePaths(fullPath, arrayOfFiles);
            } else if (file.isFile() && file.name.endsWith(".js")) {
                arrayOfFiles.push(fullPath);
            }
        }

        return arrayOfFiles;
    }
}

export default FilePathGetter;
