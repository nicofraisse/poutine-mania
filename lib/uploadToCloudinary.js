export const uploadToCloudinary = async (files) => {
  if (!files || files.length === 0) return null;

  if (typeof files?.[0] === "string") return "skip";
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }
  formData.append("upload_preset", process.env.CLOUD_UPLOAD_PRESET);
  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
    formData
  );
  return data.public_id;
};
