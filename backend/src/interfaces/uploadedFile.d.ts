interface UploadedFile {
  name: string;
  mv(path: string, callback: (err: any) => void): void;
  mv(path: string): Promise<void>;
  encoding: string;
  mimetype: string;
  data: Array<BlobPart>;
  tempFilePath: string;
  truncated: boolean;
  size: number;
  md5: string;
}

export default UploadedFile