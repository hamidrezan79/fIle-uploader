import React, { useState, useEffect } from "react";
import axios from "axios";

const DragAndDropUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [images, setImages] = useState([]);
  const submitHandler = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select one or more files.");
      return;
    }

    const chunkSize = 1024 * 1024;

    try {
      const uploadRequests = selectedFiles.map(async (file) => {
        const totalChunks = Math.ceil(file.size / chunkSize);
        let totalProgress = 0;
        let combinedData = new Uint8Array();

        for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
          const start = chunkNumber * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          const formData = new FormData();
          formData.append("testImage", chunk);
          formData.append("imageName", file.name);
          formData.append("chunkSize", chunkSize);
          formData.append("totalChunks", totalChunks);
          formData.append("chunkNumber", chunkNumber);
          console.log("formData", formData);
          const response = await axios.post(
            "http://localhost:8020/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/formData",
              },
              onUploadProgress: (progressEvent) => {
                const chunkProgress =
                  (progressEvent.loaded / progressEvent.total) * 100;
                totalProgress += chunkProgress;
                const overallProgress = (totalProgress / totalChunks).toFixed(
                  2
                );
                setUploadProgress((prevProgress) => ({
                  ...prevProgress,
                  [file.name]: overallProgress,
                }));
              },
            }
          );
          // console.log(response.data);
          const responseData = new Uint8Array(response.data.chunkData);
          combinedData = new Uint8Array([...combinedData, ...responseData]);

          if (chunkNumber === totalChunks - 1) {
            console.log("File uploaded successfully");
            fetchImages();
            setUploadProgress(0);
            setSelectedFiles([]);
          }
        }
      });

      await axios.all(uploadRequests);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setSelectedFiles(droppedFiles);
    alert("file Added");
    setUploadProgress({});
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8020/upload");
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <section>
      <div
        className="Dragfield"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h3>Drag Here</h3>
      </div>
      <button onClick={submitHandler}>Upload</button>
      <div className="ListOfImage">
        <h1>Images List</h1>
        <div className="progressDiv">
          {Object.keys(uploadProgress).map((fileName) => (
            <div key={fileName}>
              {uploadProgress[fileName] < 100 ? (
                <div>
                  <p>
                    {fileName} Upload Progress: {uploadProgress[fileName]}%
                  </p>
                  <progress
                    className="progressBar"
                    value={uploadProgress[fileName]}
                    max="100"
                  />
                </div>
              ) : (
                <p></p>
              )}
            </div>
          ))}
        </div>
        <div className="">
          {images.map((image) => (
            <div key={image._id} className="imageBox">
              <img
                className="image"
                src={`http://localhost:8020/${image.Path}`}
                alt=""
              />
              <p>Name: {image.Name}</p>
              <p>Size: {image.Size} bytes</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DragAndDropUploader;
