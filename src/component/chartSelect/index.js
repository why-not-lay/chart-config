import ReactDOM from "react-dom";
import React from "react";
import ChartSelect from "./ChartSelect"
import "antd/dist/antd.css";

ReactDOM.render(
  (<div className="chart-select-container">
    <ChartSelect></ChartSelect>
  </div>),
  document.getElementById("app")
);
