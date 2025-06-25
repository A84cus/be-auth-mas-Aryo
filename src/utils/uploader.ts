import { NextFunction, Request, Response } from "express";
import multer, { Field } from "multer";
import { join } from "path";
import fs from "fs";

type Callback = (error: Error | null, destination: string) => void;

type IMultipleFileDiffField = Record<string, Express.Multer.File[]>; // -> {photoProfile: [], npwp: [], ktp: []}

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

export const multipleFileSameField = (
  filePrefix: string,
  folderName?: string,
  maxCount?: number
) => {
  return [
    uploader(filePrefix, folderName).array("files", maxCount),

    (req: Request, _res: Response, next: NextFunction) => {
      const { files } = req;

      if (files?.length && Array.isArray(files)) {
        const formattedFiles = files.map((file: Express.Multer.File) => {
          return { ...file, path: folderName + "/" + (file?.filename + "") };
        });

        req.files = formattedFiles;
      }

      next();
    },
  ];
};

export const multipleFileDiffField = (options: {
  fields: Field[];
  filePrefix: string;
  folderName?: string;
}) => {
  const { fields, filePrefix, folderName } = options;

  return [
    uploader(filePrefix, folderName).fields(fields),
    (req: Request, _res: Response, next: NextFunction) => {
      const files = req.files as unknown as IMultipleFileDiffField; // -> {npwp: [{}, {}, {}]}

      const newFiles: IMultipleFileDiffField = {};

      if (files) {
        Object.entries(files).forEach(([key, values]) => {
          const formattedValues = values.map((value) => {
            return {
              ...value,
              path: folderName + "/" + (value?.filename + ""),
            };
          });

          if (!newFiles[key]) {
            newFiles[key] = formattedValues;
          }
        });

        req.files = newFiles;
      }

      next();
    },
  ];

  // const result = {
  //   avatar: [
  //     {
  //       path: "/asdasd/asdasd.png",
  //     },
  //   ],
  //   background: [
  //     {
  //       path: "asdasd/zxczxcz.png",
  //     },
  //     {
  //       path: "asdasd/zxczxcz.png",
  //     },
  //   ],
  // };

  // const resultSameField = [
  //   {
  //     path: "/asdasd/asdasd.png",
  //   },
  //   {
  //     path: "/asdasd/asdasd.png",
  //   },
  //   {
  //     path: "/asdasd/asdasd.png",
  //   },
  //   {
  //     path: "/asdasd/asdasd.png",
  //   },
  //   {
  //     path: "/asdasd/asdasd.png",
  //   },
  // ];

  // await prisma.avatars.create({
  //   data: {
  //     urlImage: result.avatar[0].path,
  //   },
  // });

  // await prisma.background.create({
  //   data: {
  //     urlImage: result.background[0].path,
  //   },
  // });
};

export const memoryUploader = () => {
  const storage = multer.memoryStorage();

  return multer({ storage });
};
