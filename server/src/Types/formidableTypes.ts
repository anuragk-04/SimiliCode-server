// Type for Formidable Files
export type FormidableFiles = {
  submission1: FormidableSubmission;
  submission2: FormidableSubmission;
};

// Type for each zip file of Formidable
export type FormidableSubmission = {
  size: number;
  path: string;
  name: string;
  type: string;
  lastModifiedDate?: Date;
  hash?: string;

  toJSON(): Record<string, any>; // safer than Object
};

// Type for Formidable Fields
export type FormidableFields = Record<string, string>;
