import React from "react";

export default class BaseChartToolComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  }
  render(){
    return (
      <div
        className="base-chart-tool-component"
        style={{
          position: "absolute",
          display: `${this.props.visible ? "block" : "none"}`,
          width: "100%",
          height: "100%",
          border: "1px solid #000",
        }}
        >
        <div
          className="base-chart-tool-component-left-top"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            left: "-5px",
            top: "-5px",
            background: "#000",
            cursor: "nw-resize",
          }}
          />
        <div
          className="base-chart-tool-component-right-top"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            right: "-5px",
            top: "-5px",
            background: "#000",
            cursor: "ne-resize",
          }}
          />
        <div
          className="base-chart-tool-component-right-bottom"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            right: "-5px",
            bottom: "-5px",
            background: "#000",
            cursor: "se-resize",
          }}
          />
        <div
          className="base-chart-tool-component-left-bottom"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            left: "-5px",
            bottom: "-5px",
            background: "#000",
            cursor: "sw-resize",
          }}
          />
        <div
          className="base-chart-tool-component-top"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            top: "-5px",
            left: "50%",
            transform: "translateX(-5px)",
            background: "#000",
            cursor: "n-resize",
          }}
          />
        <div
          className="base-chart-tool-component-right"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            right: "-5px",
            top: "50%",
            transform: "translateY(-5px)",
            background: "#000",
            cursor: "e-resize",
          }}
          />
        <div
          className="base-chart-tool-component-bottom"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            bottom: "-5px",
            left: "50%",
            transform: "translateX(-5px)",
            background: "#000",
            cursor: "s-resize",
          }}
          />
        <div
          className="base-chart-tool-component-left"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            left: "-5px",
            top: "50%",
            transform: "translateY(-5px)",
            background: "#000",
            cursor: "w-resize",
          }}
          />
      </div>
    );
  }
}
