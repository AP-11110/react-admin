import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { configStore } from "@reduxjs/toolkit";
import globalReducer from "state";
import { Provider } from "react-redux";

const store = configStore({
  reducer: {
    global: globalReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
