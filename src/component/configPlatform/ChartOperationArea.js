import React from "react";
import { Slider, InputNumber } from "antd";
import "../../style/chartOperationArea.css"
export default class ChartOperationArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      width: 1920,
      height: 1080,
      scale: 0.5,
      thumbCanvasWidth: 0,
      thumbCanvasHeight: 0,
      thumbSelectWidth: 0,
      thumbSelectHeight: 0,
      thumbSelectShiftX: 0,
      thumbSelectShiftY: 0,
    }
    this.viewScopeEle = null;
    this.thumbEle = null;

  }
  
  thumbSelectMouseMoveHandler = (e) => {
    console.log("move")
    const {movementX, movementY} = e;
    const {offsetLeft, offsetTop} = e.target;
    if(
      offsetLeft + this.state.thumbSelectWidth + movementX <= this.state.thumbCanvasWidth
      && offsetLeft + movementX >= 0
      ){
      console.log(e);
      const offsetX = this.state.thumbSelectShiftX + movementX;
      this.setState({
        thumbSelectShiftX: offsetX,
      });
    }
    if(
      offsetTop + this.state.thumbSelectHeight + movementY <= this.state.thumbCanvasHeight
      && offsetTop + movementY >= 0
      ){
      console.log(e);
      const offsetY = this.state.thumbSelectShiftY + movementY;
      this.setState({
        thumbSelectShiftY: offsetY,
      });
    }
  }
  thumbSelectMouseLeaveHandler = (e) => {
    console.log("leave");
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
  }
  thumbSelectMouseUpHandler = (e) => {
    console.log("up");
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
  }
  thumbSelectMouseDownHandler = (e) => {
    console.log("down");
    e.target.addEventListener("mousemove", this.thumbSelectMouseMoveHandler);
  }
  
  sliderChangeHandler = (value) => {
    if(isNaN(value)){
      return;
    }
    this.setState({
      scale: value,
    });
    this.initEditSider(value);
  }
  setViewScopeEle = (ele) => {
    this.viewScopeEle = ele;
  }
  setThumbEle = (ele) => {
    this.thumbEle = ele;
  }
  initEditSider = (scale) => {
    const len = 24;
    const times = 5;
    const viewScopeWidth = this.viewScopeEle.clientWidth;
    const viewScopeHeight = this.viewScopeEle.clientHeight;
    const {width, height} = this.state;
    const thumbCanvasWidth = Math.ceil(width / len * times);
    const thumbCanvasHeight = Math.ceil(height / len * times);
    const realWidth = scale * width;
    const realHeight = scale * height;
    const tHeight = viewScopeHeight / realHeight > 1 ? 1 : viewScopeHeight / realHeight;
    const tWidth = viewScopeWidth / realWidth > 1 ? 1 : viewScopeWidth / realWidth;
    const thumbSelectHeight = Math.ceil(thumbCanvasHeight * tHeight);
    const thumbSelectWidth = Math.ceil(thumbCanvasWidth * tWidth);
    //console.log(viewScopeWidth, viewScopeHeight, realWidth, realHeight, thumbSelectWidth, thumbSelectHeight);
    this.setState({
      thumbCanvasWidth: thumbCanvasWidth,
      thumbCanvasHeight: thumbCanvasHeight,
      thumbSelectWidth: thumbSelectWidth,
      thumbSelectHeight: thumbSelectHeight,
      thumbSelectShiftX: 0,
      thumbSelectShiftY: 0,
    });
  }

  componentDidMount(){
    if(this.viewScopeEle && this.thumbEle){
      this.initEditSider(this.state.scale);
    }
  }
  render(){
    return(
      <div
        className="chart-operation-area-outer-container"
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
        >
        <div 
          className="chart-operation-area-container"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "auto",
            padding: "10px",
          }}
          ref={this.setViewScopeEle}
          >
          <div 
            className="chart-operation-area-canvas"
            style={{
              background: "green",
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${this.state.width}px`,
              height: `${this.state.height}px`,
              transform: `translate(-50%, -50%) scale(${this.state.scale}`,
            }}
            >
          </div>
        </div>
        <div
          className="chart-operation-area-edit-container"
          style={{
            position: "absolute",
            left: "10px",
            bottom: "10px"
          }}
          >
          <canvas
            height={`${this.state.thumbCanvasHeight}px`}
            width={`${this.state.thumbCanvasWidth}px`}
            style={{
              
            }}
            ref={this.setThumbEle}
            >
          </canvas>

          <span
            className="select-span"
            style={{
              border: "1px solid #000",
              position: "absolute",
              top: "0",
              left: "0",
              cursor: "move",
              width: `${this.state.thumbSelectWidth}px`,
              height: `${this.state.thumbSelectHeight}px`,
              left: `${this.state.thumbSelectShiftX}px`,
              top: `${this.state.thumbSelectShiftY}px`,
            }}
            onMouseDown={this.thumbSelectMouseDownHandler}
            onMouseUp={this.thumbSelectMouseUpHandler}
            onMouseLeave={this.thumbSelectMouseLeaveHandler}
            >
          </span>
          <Slider
            min={0.1}
            max={1}
            step={0.01}
            onChange={this.sliderChangeHandler}
            value={typeof this.state.scale === "number" ? this.state.scale : 0}
            />
        </div>
      </div>
    );
  }
} 
