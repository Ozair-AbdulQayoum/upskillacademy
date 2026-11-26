// =====================================
// IMAGEKIT UPLOAD HELPERS
// =====================================

// Upload image buffer to ImageKit
const uploadImageToImageKit = async (file, folder) => {
  if (!file?.buffer) {
    throw new Error("Image file is missing.");
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("ImageKit private key is not configured.");
  }

  const extension = path.extname(file.originalname).toLowerCase();
  const fileName = `${randomUUID()}${extension}`;

  const uploadedFile = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName),
    fileName,
    folder: `/upskillacademy/${folder}`,
    useUniqueFileName: true,
  });

  if (!uploadedFile.url || !uploadedFile.fileId) {
    throw new Error("ImageKit upload did not return a URL or file ID.");
  }

  return {
    url: uploadedFile.url,
    fileId: uploadedFile.fileId,
  };
};

// Delete image from ImageKit
const deleteImageFromImageKit = async (fileId) => {
  if (!fileId) return;

  try {
    await imagekit.files.delete(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error.message);
  }
};
