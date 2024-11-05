import Image from "next/image";
import { Edit, Trash2, Download, Copy, Image as ImageIcon } from "lucide-react";

export function Table({ data, onDelete, onEdit }) {
  const handleCopy = async (shortCode, fileName) => {
    const url = `/uploads/${shortCode}/${fileName}`;
    try {
      await navigator.clipboard.writeText(
        `${window.location.protocol}//${window.location.host}${url}`
      );
      alert("Copy copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const handleDownload = async (shortCode, fileName) => {
    const url = `/uploads/${shortCode}/${fileName}`;
    const finalURL = `${window.location.protocol}//${window.location.host}${url}`;
    const a = document.createElement("a");
    // Set the href and download attributes for the anchor element
    a.href = url;
    a.download = fileName || "default-filename"; // Provide a default filename if none is specified
    document.body.appendChild(a); // Append the anchor to the body
    a.click(); // Simulate a click on the anchor
    document.body.removeChild(a);
  };

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full bg-white dark:bg-gray-900">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <th className="px-4 py-3">QR Image</th>
            <th className="px-4 py-3">Video</th>
            <th className="px-4 py-3">Marker</th>
            <th className="px-4 py-3">Total Views</th>
            <th className="px-4 py-3">Android</th>
            <th className="px-4 py-3">iOS</th>
            <th className="px-4 py-3">Others</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-black dark:text-white">
          {data.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Image
                    src={`/uploads/${item.id}/${item.qrImage}`}
                    alt="QR Code"
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <Download
                    className="w-5 h-5 cursor-pointer text-blue-500"
                    onClick={() => {
                      handleDownload(item.id, item.qrImage);
                    }}
                  />
                  <Copy
                    className="w-5 h-5 cursor-pointer text-green-500"
                    onClick={() => handleCopy(item.id, item.qrImage)}
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 flex items-center ">
                    <video
                      src={`/uploads/${item.id}/${item.video}`}
                      controls={true}
                    />
                  </div>

                  {/* <ImageIcon  /> */}
                  <Download
                    className="w-5 h-5 cursor-pointer text-blue-500"
                    onClick={() => {
                      handleDownload(item.id, item.video);
                    }}
                  />
                  <Copy
                    className="w-5 h-5 cursor-pointer text-green-500"
                    onClick={() => handleCopy(item.id, item.video)}
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                  {item.marker ? (
                    <>
                      <Download
                        className="w-5 h-5 cursor-pointer text-blue-500"
                        onClick={() => {
                          handleDownload(item.id, item.marker);
                        }}
                      />
                      <Copy
                        className="w-5 h-5 cursor-pointer text-green-500"
                        onClick={() => handleCopy(item.id, item.marker)}
                      />
                    </>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 text-center">{item.totalViews}</td>
              <td className="px-4 py-3 text-center">{item.android}</td>
              <td className="px-4 py-3 text-center">{item.ios}</td>
              <td className="px-4 py-3 text-center">{item.others}</td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Edit
                    className="w-5 h-5 cursor-pointer text-yellow-500"
                    onClick={() => onEdit(item.id)}
                  />
                  <Trash2
                    className="w-5 h-5 cursor-pointer text-red-500"
                    onClick={() => onDelete(item)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
