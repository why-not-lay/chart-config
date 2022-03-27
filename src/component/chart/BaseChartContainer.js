import React from "react";
import BaseChartToolComponent from "./BaseChartToolComponent";
export default class BaseChartContainer extends React.Component {
  constructor(props){
    super(props);
    const {id, x, y, width, height} = this.props.config;
    this.state = {
      config: this.props.config,
      //id: id,
      //width: width,
      //height: height,
      //x: x,
      //y: y,
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
          width: `${this.state.config.width}px`,
          height: `${this.state.config.height}px`,
          transform: `translate(${this.state.config.x}px, ${this.state.config.y}px)`,
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
    this.props.onSetCurChartRef(this.state.config.id);
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
    const {config} = this.state;
    const height = config.height + movementH / scale;
    this.setState({
      //height: height,
      config: {...config, height: height},
    },
    () => {
      this.props.onSetChartContainerRect(config.id, config.width, config.height);
    });
  }
  containerMoveW = (movementW, scale) => {
    const {config} = this.state;
    const width = config.width + movementW / scale;
    this.setState({
      //width: width,
      config: {...config, width: width},
    },
    () => {
      this.props.onSetChartContainerRect(config.id, config.width, config.height);
    });
  }
  containerMoveX = (movementX, scale) => {
    const {config} = this.state;
    const offsetX = config.x + movementX / scale;
    this.setState({
      //x: offsetX,
      config: {...config, x: offsetX},
    }, 
    () => {
      this.props.onSetChartContainerPos(config.id, config.x, config.y);
    });

  }
  containerMoveY = (movementY, scale) => {
    const {config} = this.state;
    const offsetY = config.y + movementY / scale;
    this.setState({
      //y: offsetY,
      config: {...config, y: offsetY},
    },
    () => {
      this.props.onSetChartContainerPos(config.id, config.x, config.y);
    });
  }
}
