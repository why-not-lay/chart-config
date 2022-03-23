import React from "react";
import BaseChartToolComponent from "./BaseChartToolComponent";
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
      toolVisible: false,
    };
    this.moveable = false;
    this.containerEle = null;
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
        onClick={this.clickHandler}
        ref={this.setContainerEle}
        >
        <BaseChartToolComponent 
          visible={this.state.toolVisible}
          />
      </div>
    );
  }
  /*
   * event handler
   * */
  clickHandler = (e) => {
    this.props.onSetCurChartRef(this.state.id);
    e.stopPropagation();
  }
  mouseDownHandler = (e) => {
    let {screenX: preX, screenY: preY} = e;
    const moveHandler = (me) => {
      const {screenX: curX, screenY: curY} = me;
      const offsetX = curX - preX;
      const offsetY = curY - preY;
      if(offsetY){
        this.containerMoveY(offsetY, this.props.scale);
      }
      if(offsetX){
        this.containerMoveX(offsetX, this.props.scale);
      }
      preX = curX;
      preY = curY;

    }
    this.containerEle.addEventListener("mousemove", moveHandler);
    this.containerEle.addEventListener("mouseup", (ue) => {
      this.containerEle.removeEventListener("mousemove", moveHandler);
      ue.stopPropagation();
    });
    e.stopPropagation();
  }
  mouseUpHandler = (e) => {
    this.containerEle.removeEventListener("mousemove", this.mouseMoveHandler);
    e.stopPropagation();
  }
  mouseMoveHandler = (e) => {
    const {movementX, movementY} = e;
    if(movementX){
      this.containerMoveX(movementX, this.props.scale);
    }
    if(movementY){
      this.containerMoveY(movementY, this.props.scale);
    }
  }
  /*
   * setter
   * */
  setMoveable = (moveable) => {
    this.moveable = moveable;
    if(this.containerEle && moveable){
      this.containerEle.addEventListener("mousedown", this.mouseDownHandler);
    }
    if(this.containerEle && !moveable){
      this.containerEle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  }
  setToolVisible = (visible) => {
    this.setState({
      toolVisible: visible
    });
  }
  setContainerEle = (ele) => {
    this.containerEle = ele;
  }

  /*
   * common
   * */
  containerMoveX = (movementX, scale) => {
    console.log(scale);
    const offsetX = this.state.x + movementX / scale;
    console.log(`offsetX: ${offsetX}`);
    this.setState({
      x: offsetX,
    });
  }
  containerMoveY = (movementY, scale) => {
    const offsetY = this.state.y + movementY / scale;
    this.setState({
      y: offsetY,
    });
  }
}
