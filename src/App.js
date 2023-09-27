import "./App.css";
import React, { useState } from "react";
import MultiUploader from "./components/MultiUploader";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import DragAndDropUploader from "./components/Darg&Drop";

function App() {
  const [isCanceled, setIsCanceled] = useState(false);
  return (
    <Provider store={store}>
      <div className="App">
        <MultiUploader />
        {/* <DragAndDropUploader /> */}
      </div>
    </Provider>
  );
}

export default App;
