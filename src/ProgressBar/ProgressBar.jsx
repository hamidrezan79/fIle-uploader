import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./progressBar.css";
// import 'react-progress-bar-plus/lib/progress-bar.css';

const FileUploadProgressBar = ({ progress }) => {
  return (
    <div>
      <ProgressBar percent={progress} autoIncrement intervalTime={100} />
    </div>
  );
};

export default FileUploadProgressBar;
