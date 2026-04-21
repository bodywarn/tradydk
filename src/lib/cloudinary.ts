export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'tradydk'
): Promise<string> => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', folder);
  formData.append('resource_type', 'auto');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload fejl');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (err: any) {
    console.error('Cloudinary upload fejl:', err);
    throw new Error('Kunne ikke uploade billede til Cloudinary');
  }
};
