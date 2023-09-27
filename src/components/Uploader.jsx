import React, { useState, useEffect } from "react";
import axios from "axios";

const Uploader = () => {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);

  const changeFileHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const submitHandler = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const chunkSize = 1024 * 1024;
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    let totalProgress = 0;
    let combinedData = new Uint8Array();

    try {
      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        const start = chunkNumber * chunkSize;
        const end = Math.min(start + chunkSize, selectedFile.size);
        const chunk = selectedFile.slice(start, end);

        const formData = new FormData();
        formData.append("testImage", chunk);
        formData.append("imageName", selectedFile.name);
        formData.append("chunkSize", chunkSize);
        formData.append("totalChunks", totalChunks);
        formData.append("chunkNumber", chunkNumber);

        const response = await axios.post(
          "http://localhost:8080/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/formData",
            },
            onUploadProgress: (progressEvent) => {
              const chunkProgress =
                (progressEvent.loaded / progressEvent.total) * 100;
              totalProgress += chunkProgress;
              const overallProgress = (totalProgress / totalChunks).toFixed(2);
              setUploadProgress(overallProgress);
            },
          }
        );
        console.log("response", response);
        const responseData = new Uint8Array(response.data.chunkData);
        combinedData = new Uint8Array([...combinedData, ...responseData]);

        if (chunkNumber === totalChunks - 1) {
          console.log("File uploaded successfully");
          fetchImages();
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/upload"); // Replace with your server address
      setImages(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  return (
    <section>
      <div className="uploadDiv">
        <div className="fileUpload">
          <input type="file" multiple onChange={changeFileHandler} />
          <button onClick={submitHandler}>Upload</button>
        </div>
        <div className="progressDiv">
          {uploadProgress < 100 && (
            <div>
              <p>Upload Progress: {uploadProgress}%</p>
              <progress
                className="progressBar"
                value={uploadProgress}
                max="100"
              />
            </div>
          )}
        </div>
      </div>
      <div className="ListOfImage">
        <h1>Images List</h1>
        <div>
          {images.map((image) => (
            <div key={image._id} className="imageLists">
              <img
                className="image"
                src={`http://localhost:8080/${image.Path}`}
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

export default Uploader;
