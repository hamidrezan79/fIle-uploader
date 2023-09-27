import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedFiles,
  setIsCanceled,
  setIsPaused,
  setIsUploading,
  setUploadProgress,
  setFiles,
  setUploadingFile,
  setQueueChunk,
} from "../Reducers/UploadSlice";

const useUploadReduxHook = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.upload || {});
  /////////////////////////////
  const set_selected_files = (files) => dispatch(setSelectedFiles(files));
  const get_selected_files = () => {
    return selector?.selectedFiles || [];
  };
  /////////////////////////////
  const set_uploading_file = (files) => dispatch(setSelectedFiles(files));
  const get_uploading_file = () => {
    return selector?.uploadingFile || [];
  };
  //////////////////////
  const set_is_canceled = (status) => dispatch(setIsCanceled(status));
  const get_is_canceled = () => {
    return selector?.isCanceled || false;
  };
  ////////////////////////////////

  const set_is_paused = (status) => dispatch(setIsPaused(status));
  const get_is_paused = () => {
    return selector?.isPaused || false;
  };
  ////////////////////////////
  const set_is_uploading = (status) => dispatch(setIsUploading(status));
  const get_is_uploading = () => {
    return selector?.isUploading || false;
  };
  //////////////////////////
  const set_upload_progress = (progress) =>
    dispatch(setUploadProgress(progress));
  const get_upload_progress = () => {
    return selector?.uploadProgress || {};
  };
  /////////////////////////
  const set_files = (files) => dispatch(setFiles(files));
  const get_files = () => {
    return selector?.files || [];
  };

  const set_queue_chunk = (files) => dispatch(setQueueChunk(files));
  const get_queue_chunk = () => {
    return selector?.queueChunk || [];
  };

  ////////////////////////////
  return {
    set_queue_chunk,
    queue_Chunk: get_queue_chunk(),
    set_selected_files,
    selected_files: get_selected_files(),
    set_is_canceled,
    is_canceled: get_is_canceled(),
    get_is_canceled,
    set_is_paused,
    is_paused: get_is_paused(),
    set_is_uploading,
    is_uploading: get_is_uploading(),
    set_upload_progress,
    upload_progress: get_upload_progress(),
    set_files,
    files: get_files(),
    set_uploading_file,
    uploading_file: get_uploading_file(),
  };
};

export default useUploadReduxHook;
