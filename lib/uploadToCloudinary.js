import FormData from "form-data";
import fs from "fs";
import axios from "axios";

export const uploadToCloudinary = async (files, quality = "60") => {
  if (!files) return null;

  const publicIds = [];

  for (const file of files) {
    const formData = new FormData();
    const fileStream = fs.createReadStream(file.filepath);
    formData.append("file", fileStream);
    formData.append("upload_preset", process.env.CLOUD_UPLOAD_PRESET);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    publicIds.push(data.public_id);
  }

  return publicIds;
};
