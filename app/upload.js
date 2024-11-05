"use server";
import fs from "fs";
import path from "path";
export const uploadFiles = async (file, short_code) => {
  const dirPath = path.join(process.cwd(), "public/uploads", short_code);
  await fs.promises.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, file.name);

  try {
    // Check if the file already exists
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch (error) {
    // If the file does not exist, no action is needed, just log the message
    console.log("File does not exist, will be created:", filePath);
  }
  // const extension = path.extname(file.name); // Use originalname if it comes from multer
  const buffer = Buffer.from(file.buffer);
  await fs.promises.writeFile(filePath, buffer); // Use buffer here
  return file.name;
};

export async function deleteLocalFile(fileName, short_code) {
  const dirPath = path.join(process.cwd(), "public/uploads", short_code);

  const filePath = path.join(dirPath, fileName);

  fs.unlink(path.resolve(filePath), (err) => {
    if (err) {
      console.error("Failed to delete the file:", err);
      return;
    }

  });
  const files = await fs.promises.readdir(dirPath);
  if (files.length === 0) {
    await fs.promises.rmdir(dirPath);
    console.log("Directory successfully deleted");
  } else {
    console.log("Directory is not empty.");
  }
}
