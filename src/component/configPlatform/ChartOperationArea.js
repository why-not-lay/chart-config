import React from "react";
import { Slider, InputNumber, Row, Col } from "antd";
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
    this.scrollLen = 24;
    this.scrollTimes = 5;
    this.resizeObserver = new ResizeObserver((entries) => {
      for(const entry of entries){
        this.viewScopeResizeHandler();
      }
    });

  }
  viewScopeResizeHandler = () => {
    this.initEditSider(this.state.scale);
  }
  thumbSelectMoveX = (movement) => {
    if(
      this.state.thumbSelectWidth + movement + this.state.thumbSelectShiftX<= this.state.thumbCanvasWidth
      && this.state.thumbSelectShiftX + movement >= 0
      ){
      const len = this.state.width / this.scrollLen * this.scrollTimes;
      const offsetX = this.state.thumbSelectShiftX + movement;
      this.viewScopeEle.scrollBy({
        top: 0,
        left: movement * Number.parseInt(len, 10),
        behavior: "smooth",
      })
      this.setState({
        thumbSelectShiftX: offsetX,
      });
    }
  }
  thumbSelectMoveY = (movement) => {
    if(
      this.state.thumbSelectHeight + movement + this.state.thumbSelectShiftY<= this.state.thumbCanvasHeight
      && this.state.thumbSelectShiftY + movement >= 0
      ){
      const len = this.state.height / this.scrollLen * this.scrollTimes;
      const offsetY = this.state.thumbSelectShiftY + movement;
      this.viewScopeEle.scrollBy({
        top: movement * Number.parseInt(len, 10),
        left: 0,
        behavior: "smooth",
      })
      this.setState({
        thumbSelectShiftY: offsetY,
      });
    }
  }
  canvasClickHandler = (e) => {
    this.props.onSetConfigSider(true);
    e.stopPropagation();
  }
  containerClickHandler = (e) => {
    this.props.onSetConfigSider(false);
    e.stopPropagation();
  }
  thumbSelectMouseMoveHandler = (e) => {
    const {movementX, movementY} = e;
    this.thumbSelectMoveY(movementY);
    this.thumbSelectMoveX(movementX);
  }
  thumbSelectMouseLeaveHandler = (e) => {
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
  }
  thumbSelectMouseUpHandler = (e) => {
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
  }
  thumbSelectMouseDownHandler = (e) => {
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
    this.resizeObserver.observe(this.viewScopeEle);
  }
  setThumbEle = (ele) => {
    this.thumbEle = ele;
  }
  initEditSider = (scale) => {
    const viewScopeWidth = this.viewScopeEle.clientWidth;
    const viewScopeHeight = this.viewScopeEle.clientHeight;
    const {width, height} = this.state;
    const thumbCanvasWidth = Math.ceil(width / this.scrollLen * this.scrollTimes);
    const thumbCanvasHeight = Math.ceil(height / this.scrollLen * this.scrollTimes);
    const realWidth = scale * width;
    const realHeight = scale * height;
    const tHeight = viewScopeHeight / realHeight > 1 ? 1 : viewScopeHeight / realHeight;
    const tWidth = viewScopeWidth / realWidth > 1 ? 1 : viewScopeWidth / realWidth;
    const thumbSelectHeight = Math.ceil(thumbCanvasHeight * tHeight);
    const thumbSelectWidth = Math.ceil(thumbCanvasWidth * tWidth);
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
            overflow: "hidden",
            padding: "10px",
          }}
          ref={this.setViewScopeEle}
          onClick={this.containerClickHandler}
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
            onClick={this.canvasClickHandler}
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
              transform: `translate(${this.state.thumbSelectShiftX}px, ${this.state.thumbSelectShiftY}px)`,
              //left: `${this.state.thumbSelectShiftX}px`,
              //top: `${this.state.thumbSelectShiftY}px`,
            }}
            onMouseDown={this.thumbSelectMouseDownHandler}
            onMouseUp={this.thumbSelectMouseUpHandler}
            onMouseLeave={this.thumbSelectMouseLeaveHandler}
            >
          </span>
          <Row>
            <Col
              flex={19}
              >
              <Slider
                min={0.1}
                max={1}
                step={0.01}
                onChange={this.sliderChangeHandler}
                value={typeof this.state.scale === "number" ? this.state.scale : 0}
                />
            </Col>
            <Col>
              <InputNumber
                min={0.1}
                max={1}
                step={0.01}
                value={typeof this.state.scale === "number" ? this.state.scale : 0}
                onChange={this.sliderChangeHandler}
                />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
} 
