import ReactDOM from "react-dom";
import React from "react";
import BasePlatform from "./component/configPlatform/BasePlatform";
import "antd/dist/antd.css";
import "./style/chartConfigPlatformContainer.css"

ReactDOM.render(
  (<div className="chart-config-platform-container">
    <BasePlatform></BasePlatform>
  </div>),
  document.getElementById("app")
);
