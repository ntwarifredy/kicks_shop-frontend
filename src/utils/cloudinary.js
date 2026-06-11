import axios from 'axios';
import API from '../api/axios';

const UPLOAD_URL = 'https://api.cloudinary.com/v1_1/djl01bpkg/image/upload';

export const uploadToCloudinary = async (file) => {
  try {
    const { data: res } = await API.get('/upload/signature');
    const { signature, timestamp, apiKey, folder } = res.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const { data } = await axios.post(UPLOAD_URL, formData);
    return data.secure_url;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Upload failed';
    const err = new Error(msg);
    err.cause = error;
    throw err;
  }
};

export const uploadMultipleToCloudinary = async (files, onProgress) => {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadToCloudinary(files[i]);
    urls.push(url);
    if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 100));
  }
  return urls;
};
