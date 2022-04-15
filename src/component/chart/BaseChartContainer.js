import React from "react";
import * as echarts from "echarts";
import BaseChartToolComponent from "./BaseChartToolComponent";
export default class BaseChartContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolVisible: false,
    };
    this.moveable = false;
    this.containerEle = null;
    this.chartEle = null;
    this.chartInstance = null;
    this.resizeObserver = new ResizeObserver((entries) => {
      for(const entry of entries){
        this.containerResizeHandler();
      }
    });
  }
  componentDidMount(){
    this.chartInstance = echarts.init(this.chartEle);
    this.resizeObserver.observe(this.chartEle);
    this.chartInstance.setOption(this.props.option);
  }
  componentWillUnmount(){
    this.chartInstance.dispose();
    this.chartInstance = null;
  }
  shouldComponentUpdate(nextProps, nextState){
    if(!nextProps.rect){
      return true;
    }
    const {x, y, width, height} = nextProps.rect;
    const {x:pX, y:pY, width:pW, height:pH} = this.props.rect;
    return !(nextProps.option === this.props.option) 
            || !(nextState.toolVisible === this.state.toolVisible)
            || !(x === pX && y === pY && width === pW && height === pH);
    
  }
  render(){
    return (
      <div
        className="base-chart-container"
        style={{
          position: "absolute",
          width: `${this.props.rect.width}px`,
          height: `${this.props.rect.height}px`,
          transform: `translate(${this.props.rect.x}px, ${this.props.rect.y}px)`,
          zIndex: `${this.state.toolVisible ? 1 : 0}`,
        }}
        onClick={this.clickHandler}
        ref={this.setContainerEle}
        >
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
          }}
          ref={this.setChartEle}
          />
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
  containerResizeHandler = () => {
    if(this.chartInstance) {
      this.chartInstance.resize();
    }
  }
  clickHandler = (e) => {
    this.props.onSetCurChartRef(this.props.id);
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
    });
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
  setChartEle = (ele) => {
    this.chartEle = ele;
  }

  /*
   * common
   * */
  updateChart = () => {
    this.chartInstance.setOption(this.props.option);
  }
  containerMoveH = (movementH, scale) => {
    //const {x, y, width, height} = this.props.rect;
    const newRect = {...this.props.rect};
    //const newHeight = height + movementH / scale;
    newRect.height += movementH / scale;
    this.props.onSetChartRect(this.props.id, newRect);
  }
  containerMoveW = (movementW, scale) => {
    const newRect = {...this.props.rect};
    //const {x, y, width, height} = this.props.rect;
    //const newWidth = width + movementW / scale;
    newRect.width += movementW / scale;
    this.props.onSetChartRect(this.props.id, newRect);
  }
  containerMoveX = (movementX, scale) => {
    const newRect = {...this.props.rect};
    //const {x, y, width, height} = this.props.rect;
    //const newX = x + movementX / scale;
    newRect.x += movementX / scale;
    this.props.onSetChartRect(this.props.id, newRect);
  }
  containerMoveY = (movementY, scale) => {
    const newRect = {...this.props.rect};
    //const {x, y, width, height} = this.props.rect;
    //const newY = y + movementY / scale;
    newRect.y += movementY / scale;
    this.props.onSetChartRect(this.props.id, newRect);
  }
}
