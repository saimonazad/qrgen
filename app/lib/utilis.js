// import fs from "fs";
const code_generate = (chars) => {
  const data = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array.from({ length: chars }, () =>
    data.charAt(Math.floor(Math.random() * data.length))
  ).join("");
};


export function fileToArrayBuffer(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    callback(null, reader.result);
  };
  reader.onerror = (error) => {
    callback(error);
  };
  reader.readAsArrayBuffer(file);
}

export function getFileExtension(fileName) {
  // Split the fileName by dot and take the last part
  const parts = fileName.split('.');
  // The extension will be the last element in the array, which we return
  return parts[parts.length - 1];
}