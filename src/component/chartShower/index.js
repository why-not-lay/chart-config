import ReactDOM from "react-dom";
import React from "react";
import ChartShower from "./ChartShower";
import "antd/dist/antd.css";

ReactDOM.render(
  (<div className="chart-shower-container">
    <ChartShower></ChartShower>
  </div>),
  document.getElementById("app")
);
