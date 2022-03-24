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
          zIndex: `${this.state.toolVisible ? 1 : 0}`,
          background: "yellow",
        }}
        onClick={this.clickHandler}
        ref={this.setContainerEle}
        >
        <BaseChartToolComponent 
          visible={this.state.toolVisible}
          scale={this.props.scale}
          onSetMoveable={this.setMoveable}
          onSetContainerMoveY={this.onSetContainerMoveY}
          onSetContainerMoveX={this.onSetContainerMoveX}
          onSetContainerMoveH={this.onSetContainerMoveH}
          onSetContainerMoveW={this.onSetContainerMoveW}
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
      if(!this.moveable){
        return;
      }
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
      //ue.stopPropagation();
    });
    //e.stopPropagation();
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
  onSetContainerMoveY = (movementY) => {
    this.containerMoveY(movementY, this.props.scale);
  }
  onSetContainerMoveX = (movementX) => {
    this.containerMoveX(movementX, this.props.scale);
  }
  onSetContainerMoveH = (movementH) => {
    this.containerMoveH(movementH, this.props.scale);
  }
  onSetContainerMoveW = (movementW) => {
    this.containerMoveW(movementW, this.props.scale);
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
  containerMoveH = (movementH, scale) => {
    const height = this.state.height + movementH / scale;
    this.setState({
      height: height,
    },
    () => {
      this.props.onSetChartContainerRect(this.state.id, this.state.width, this.state.height);
    });
  }
  containerMoveW = (movementW, scale) => {
    const width = this.state.width + movementW / scale;
    this.setState({
      width: width,
    },
    () => {
      this.props.onSetChartContainerRect(this.state.id, this.state.width, this.state.height);
    });
  }
  containerMoveX = (movementX, scale) => {
    const offsetX = this.state.x + movementX / scale;
    this.setState({
      x: offsetX,
    }, 
    () => {
      this.props.onSetChartContainerPos(this.state.id, this.state.x, this.state.y);
    });

  }
  containerMoveY = (movementY, scale) => {
    const offsetY = this.state.y + movementY / scale;
    this.setState({
      y: offsetY,
    },
    () => {
      this.props.onSetChartContainerPos(this.state.id, this.state.x, this.state.y);
    });
  }
}
