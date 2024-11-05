import {
  doc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ShortUniqueId from "short-unique-id";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { firestore } from "../lib/firebase";
import { fileToArrayBuffer, getFileExtension } from "../lib/utilis";
import { uploadFiles } from "../upload";

export function Modal({ onClose, onSuccess, edititable, setEditable }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { ...edititable } });
  const { randomUUID } = new ShortUniqueId({ length: 7 });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    const marker =
      data.marker[0] instanceof File
        ? `marker.${getFileExtension(data.marker[0]["name"])}`
        : "";
    const qrImage =
      data.qrImage[0] instanceof File
        ? `qr-image.${getFileExtension(data.qrImage[0]["name"])}`
        : edititable?.qrImage;
    const video =
      data.video[0] instanceof File
        ? `video.${getFileExtension(data.video[0]["name"])}`
        : edititable?.video;
    let result;

    if (edititable) {
      const newData = {
        qrImage,
        video,
        marker,
      };
      const ref = doc(firestore, "QR_Generator", edititable?.id);

      // Update existing document
      await updateDoc(ref, {
        ...newData,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          result = { ...edititable, ...newData };
          setEditable(null);
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      const newDoc = {
        qrImage,
        video,
        totalViews: 0,
        android: 0,
        ios: 0,
        others: 0,
        marker,
      };
      const shortId = randomUUID();
      const docRef = doc(firestore, "QR_Generator", shortId);
      // Add new document
      await setDoc(docRef, newDoc)
        .then((res) => {
          result = { ...newDoc, id: shortId };
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }

    if (result.id !== undefined) {
      let files = [];
      // let oldFiles = [];
      if (data.qrImage && data.qrImage[0] instanceof File) {
        files.push({ name: qrImage, file: data.qrImage[0] });
        // oldFiles.push(edititable?.qrImage);
      }

      if (data.video[0] instanceof File) {
        files.push({ name: video, file: data.video[0] });
        // oldFiles.push(edititable?.video);
      }

      if (data.marker[0] instanceof File) {
        // Assuming the correct property name is qrMarker
        files.push({ name: marker, file: data.marker[0] });
        // oldFiles.push(edititable?.marker);
      }

      files.length > 0 &&
        files.map((item, i) => {
          fileToArrayBuffer(item.file, (error, arrayBuffer) => {
            if (error) {
              console.error("Error reading file:", error);
            } else {
              uploadFiles({ name: item.name, buffer: arrayBuffer }, result.id);
            }
          });
        });
      onSuccess();
      onClose();
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle sx={{ color: "white!important" }}>
            {edititable ? "Update Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 text-white">QR Image</label>
            {edititable && (
              <p className="text-blue-600">Uploaded: {edititable?.qrImage}</p>
            )}
            <input
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              className="w-full border p-2 rounded text-white"
              {...register("qrImage", {
                required:
                  !edititable || !edititable.qrImage
                    ? "A QR Image file is required"
                    : false,
                validate: {
                  sizeLimit: (files) => {
                    // First check if files are undefined or have no length (no file selected)
                    if (!files || !files.length) {
                      return true; // No files to validate, pass the validation
                    }
                    // If there is a file and it exceeds the size limit, return an error message
                    if (files[0]?.size > 2097152) {
                      return "File size should not exceed 2MB.";
                    }
                    // If none of the above conditions fail, the file size is within the limit
                    return true;
                  },
                },
              })}
              name="qrImage"
            />
            {errors["qrImage"] && (
              <p className="text-red-500">
                {errors["qrImage"]["message"] || "This field is required."}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-white">Video</label>
            {edititable?.video && (
              <p className="text-blue-600">Uploaded: {edititable?.video}</p>
            )}
            <input
              type="file"
              accept="video/*"
              className="w-full border p-2 rounded text-white"
              {...register("video", {
                required:
                  !edititable || !edititable.video
                    ? "A video file is required"
                    : false,
                validate: {
                  sizeLimit: (files) => {
                    // First check if files are undefined or have no length (no file selected)
                    if (!files || !files.length) {
                      return true; // No files to validate, pass the validation
                    }
                    // If there is a file and it exceeds the size limit, return an error message
                    if (files[0]?.size > 10971520) {
                      return "File size should not exceed 10MB.";
                    }
                    // If none of the above conditions fail, the file size is within the limit
                    return true;
                  },
                },
              })}
              name="video"
            />
            {errors["video"] && (
              <p className="text-red-500">
                {errors["video"]["message"] || "This field is required."}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-white">Marker</label>
            {edititable?.marker && (
              <p className="text-blue-600">Uploaded: {edititable?.marker}</p>
            )}
            <input
              type="file"
              accept="patt/*"
              className="w-full border p-2 rounded text-white"
              {...register("marker", { required: false })}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Loading" : "Submit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
