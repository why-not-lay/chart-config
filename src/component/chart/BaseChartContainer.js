import React from "react";

export default class BaseChartContainer extends React.Component {
  constructor(props){
    super(props);
    const {id, x, y, width, height} = this.props.config;
    this.state = {
      id: id,
      width: width,
      height: height,
      x: x,
      y: y,
    };
  }

  render(){
    return (
      <div
        className="base-chart-container"
        style={{
          position: "absolute",
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
          transform: `translate(${this.state.x}px, ${this.state.y}px)`,
          background: "yellow",
        }}
        >
        </div>
    );
  }
}
