import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { join } from "path";
import fs from "fs";

type Callback = (error: Error | null, destination: string) => void;

const defaultDir = join(__dirname, "../../public");

const uploader = (filePrefix: string, folderName?: string) => {
  const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: Callback) => {
      const destination = folderName
        ? join(defaultDir, folderName)
        : defaultDir;

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
      }

      cb(null, destination);
    },

    filename: (_req: Request, file: Express.Multer.File, cb: Callback) => {
      // test.png -> PP980982348432.png
      // aryo.png -> PP980982342346.png
      // pwd.png -> PP980982348d45.png
      // jcwd.png -> PP980982348445.png

      const originalNameParts = file.originalname.split("."); // ["test", "png"]

      const fileExtension = originalNameParts[originalNameParts.length - 1];

      const newFileName = filePrefix + Date.now() + "." + fileExtension;

      cb(null, newFileName);
    },
  });

  return multer({ storage: storage });
};

export const singleFile = (filePrefix: string, folderName?: string) => {
  return [
    uploader(filePrefix, folderName).single("file"),
    (req: Request, _res: Response, next: NextFunction) => {
      const { file } = req;

      if (file) {
        file.path = folderName + "/" + (file?.filename + "");
      }

      next();
    },
  ];
};
