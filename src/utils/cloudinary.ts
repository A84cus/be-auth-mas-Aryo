import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

cloudinary.config({
  api_key: "728419779359541",
  api_secret: "RfVuIZJXT3JCnHke8NNjD_108v0",
  cloud_name: "dfzgoee43",
});

export const cloudinaryUpload = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      (error, result: UploadApiResponse) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

const extractPublidIdFromUrl = (url: string) => {
  const urlParts = url.split("/");

  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];

  return publicId;
};

export const cloudinaryRemove = async (secure_url: string) => {
  try {
    const publicId = extractPublidIdFromUrl(secure_url);

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};
