import React, { useEffect, useCallback } from "react";
import axios from "axios";
import extData from "../ext.json";

import useUploadReduxHook from "../Redux/Hooks/useUploadReduxHook";

function randomString(strLength, charSet) {
  var result = [];

  strLength = strLength || 32;
  charSet =
    charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while (strLength--) {
    // (note, fixed typo)
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }

  return result.join("");
}

let is_puase = false;

const Uploader = () => {
  const {
    set_selected_files,
    selected_files,
    set_is_canceled,
    is_canceled,
    set_is_paused,
    is_paused,
    set_is_uploading,
    is_uploading,
    set_upload_progress,
    upload_progress,
    set_files,
    files,
    get_is_canceled,
    set_uploading_file,
    uploading_file,
    set_queue_chunk,
    queue_Chunk,
  } = useUploadReduxHook();

  // useEffect(() => {
  //   is_puase = is_canceled;
  //   // console.log("111111111canceling", is_canceled);
  //   console.log("????????????uploading_file", uploading_file);
  // }, [uploading_file]);
  // useEffect(() => {
  //   console.log("selectedfiles1111111", selected_files);
  // }, [selected_files]);

  // const data = useSelector((state) => state.upload.selectedFiles);

  const ValidExt = () => {
    for (let i = 0; i < extData.length; i++) {
      let extentions = extData[i].extensions;
      return extentions;
    }
  };
  const changeFileHandler = (event) => {
    // set_selected_files(event.target.files);
    set_upload_progress({});
    const chunkSize = 1024 * 1024;
    const chunks = [];

    const _queque = [];

    for (const file of event.target.files) {
      const file_id = randomString();

      let fileSize = 0;
      fileSize = file.size;
      let fileName = file.name;
      const totalChunks = Math.ceil(fileSize / chunkSize);

      const fileChunks = [];
      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        const start = chunkNumber * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        // const id = fileName + chunkNumber;
        // fileChunks.push({ chunk, id: fileName + `(${chunkNumber + 1})` });

        _queque.push({
          file_id,
          file_name: fileName,
          file_size: fileSize,
          part: chunkNumber + 1,
          chunk,
        });
        fileChunks.push(chunk);
      }
      chunks.push({ fileChunks, fileSize, fileName });
    }
    set_selected_files(chunks);

    set_queue_chunk([...queue_Chunk, ..._queque]);
  };

  // useEffect(() => {
  //   console.log("queue_Chunk", uploading());
  // }, []);

  const pauseHandler = () => {
    set_is_paused(true);
    console.log("pause");
  };

  const resumeHandler = () => {
    set_is_paused(false);
  };

  const cancelHandler = () => {
    console.log("Cancel");
    set_is_canceled(true);
    set_is_uploading(false);
    set_is_paused(false);
    set_selected_files([]);
    set_upload_progress({});
    // cancelUpload();
  };
  const deleteHandler = async (Name) => {
    await axios.delete(`http://localhost:8020/delete/${Name}`);
    fetchFileList();
  };
  const uploading = useCallback(async () => {
    // if (queue_Chunk.length === 0) {
    //   alert("Please select one or more files.");
    //   return;
    // }
    set_is_uploading(true);
    try {
      // for (const file of queue_Chunk) {
      // set_uploading_file(file);

      const totalChunks = queue_Chunk.length;

      let totalProgress = 0;
      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        let combinedData = new Uint8Array();
        let totalChunks = 0;
        const fileName = queue_Chunk.file_name;
        const ext = fileName.split(".").pop();
        const validExtensions = extData
          .map((imageFormat) => imageFormat.extensions)
          .flat();
        if (validExtensions.includes(ext)) {
          console.log("File Format is Valid");
          const formData = new FormData();
          formData.append("testImage", queue_Chunk[chunkNumber].chunk);
          formData.append("imageName", queue_Chunk[chunkNumber].fileName);
          // formData.append("chunkSize", queue_Chunk.fileChunks.size);
          formData.append("totalChunks", totalChunks);
          formData.append("chunkNumber", queue_Chunk.part);
          formData.append("id", queue_Chunk.file_id);
          console.log("queue_Chunk[chunkNumber]", queue_Chunk[chunkNumber]);

          try {
            return await axios.post("http://localhost:8020/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const chunkProgress =
                  (progressEvent.loaded / progressEvent.total) * 100;
                totalProgress += chunkProgress;
                const overallProgress = (totalProgress / totalChunks).toFixed(
                  2
                );

                const _upload_progress = upload_progress;
                set_upload_progress({
                  ..._upload_progress,
                  [fileName]: overallProgress,
                });
              },
            });
            // const responseData = new Uint8Array(response.data.chunkData);
            // combinedData = new Uint8Array([...combinedData, ...responseData]);
            // console.log(responseData);
            // if (chunkNumber === totalChunks - 1) {
            //   console.log("Send File to Server");
            //   set_is_uploading(false);
            //   fetchFileList();
            //   // set_upload_progress(0);
            //   set_selected_files([]);
            //   set_is_canceled(false);
            // }
            // return response;
          } catch (error) {
            console.error("Error uploading chunk:", error);
            set_is_uploading(false);
          }
        } else {
          console.log("File Format is not Valid");
          set_is_uploading(false);
          return;
        }
      }
      // }
    } catch (error) {
      console.error("Error uploading files:", error);
      set_is_uploading(false);
    }
  }, []);

  const submitHandler = useCallback((e) => {
    uploading().then((res) => console.log(res));
  }, []);
  // if (selected_files.length === 0) {
  //   alert("Please select one or more files.");
  //   return;
  // }
  // set_is_uploading(true);
  // try {
  //   for (const file of selected_files) {
  //     let totalChunks = 0;
  //     totalChunks = file.fileChunks.length;
  //     const fileName = file.fileName;
  //     const ext = fileName.split(".").pop();
  //     const validExtensions = extData
  //       .map((imageFormat) => imageFormat.extensions)
  //       .flat();

  //     if (validExtensions.includes(ext)) {
  //       console.log("File Format is Valid");
  //       let totalProgress = 0;
  //       let combinedData = new Uint8Array();
  //       // set_uploading_file(file);
  //       for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
  //         const formData = new FormData();
  //         formData.append("testImage", file.fileChunks[chunkNumber]);
  //         formData.append("imageName", file.fileName);
  //         formData.append("chunkSize", file.fileChunks.size);
  //         formData.append("totalChunks", totalChunks);
  //         formData.append("chunkNumber", chunkNumber);
  //         formData.append("id", file.fileChunks[chunkNumber].id);
  //         try {
  //           const response = await axios.post(
  //             "http://localhost:8020/upload",
  //             formData,
  //             {
  //               headers: {
  //                 "Content-Type": "multipart/form-data",
  //               },
  //               onUploadProgress: (progressEvent) => {
  //                 const chunkProgress =
  //                   (progressEvent.loaded / progressEvent.total) * 100;
  //                 totalProgress += chunkProgress;
  //                 const overallProgress = (
  //                   totalProgress / totalChunks
  //                 ).toFixed(2);

  //                 const _upload_progress = upload_progress;
  //                 set_upload_progress({
  //                   ..._upload_progress,
  //                   [fileName]: overallProgress,
  //                 });
  //               },
  //             }
  //           );
  //           const responseData = new Uint8Array(response.data.chunkData);
  //           combinedData = new Uint8Array([...combinedData, ...responseData]);
  //           console.log(responseData);
  //           if (chunkNumber === totalChunks - 1) {
  //             console.log("Send File to Server");
  //             set_is_uploading(false);
  //             fetchFileList();
  //             // set_upload_progress(0);
  //             set_selected_files([]);
  //             set_is_canceled(false);
  //           }
  //         } catch (error) {
  //           console.error("Error uploading chunk:", error);
  //           set_is_uploading(false);
  //         }
  //       }
  //     } else {
  //       console.log("File Format is not Valid");
  //       set_is_uploading(false);
  //       return;
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error uploading files:", error);
  //   set_is_uploading(false);
  // }

  const cancelUpload = () => {
    console.log("request canceled by user.");
    set_is_canceled(true);
  };

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await axios.get("http://localhost:8020/upload");
      set_files(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <section>
      <div className="uploadDiv">
        <div className="fileUpload">
          <input
            type="file"
            multiple
            onChange={changeFileHandler}
            accept={ValidExt().extensions}
          />
          <button onClick={submitHandler}>Upload</button>
          {is_uploading && !is_paused && (
            <button onClick={pauseHandler}>Pause</button>
          )}
          {is_uploading && is_paused && (
            <button onClick={resumeHandler}>Resume</button>
          )}
          {is_uploading && <button onClick={cancelHandler}>Cancel</button>}
        </div>
      </div>
      <div className="ListOfImage">
        <h1>Images List</h1>
        <div className="progressDiv">
          {is_uploading &&
            Object.keys(upload_progress).map((fileName) => (
              <div key={fileName}>
                {upload_progress[fileName] < 100 ? (
                  <div>
                    <p>
                      {fileName} Upload Progress:
                      {upload_progress[fileName]}%
                    </p>
                    <progress
                      className="progressBar"
                      value={upload_progress[fileName]}
                      max="100"
                    />
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            ))}
        </div>
        <div>
          {files.map((image) => (
            <div key={image._id} className="imageBox">
              <img
                className="image"
                src={`http://localhost:8020/${image.Path}`}
                alt=""
              />
              <p>Name: {image.Name}</p>
              <p>Size: {image.Size} bytes</p>
              <button onClick={() => deleteHandler(image.Name)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Uploader;
