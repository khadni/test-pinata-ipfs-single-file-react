import React, { useState } from "react";
import axios from "axios";
import FormData from "form-data";
import "./UploadPDF.css";

const UploadPDF = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const JWT = "Bearer " + process.env.REACT_APP_PINATA_JWT;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const pinFileToIPFS = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setUploading(true);

    const formData = new FormData();

    formData.append("file", selectedFile);

    const metadata = JSON.stringify({
      name: selectedFile.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      console.log(res.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.log(error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a PDF file</h2>
      <input
        type="file"
        accept="application/pdf"
        id="pdf-file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="pdf-file" className="upload-button">
        {selectedFile ? selectedFile.name : "Choose a PDF file"}
      </label>
      <button onClick={pinFileToIPFS} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
};

export default UploadPDF;
