import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api/v1/upload";

export const uploadFileToR2 = async (file, folder = "uploads") => {
  const { data } = await axios.post(`${API_BASE_URL}/get-upload-url`, {
    fileName: file.name,
    contentType: file.type,
    folder: folder
  });

  const { uploadUrl, publicUrl, fileKey } = data;

  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type }
  });

  return { publicUrl, fileKey };
};