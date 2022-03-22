import React from "react";
import { Slider, InputNumber, Row, Col } from "antd";
import BaseChartContainer from "../chart/BaseChartContainer";
import "../../style/chartOperationArea.css";
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

      charts: [],
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
  componentDidMount(){
    if(this.viewScopeEle && this.thumbEle){
      this.initEditSider(this.state.scale);
    }
  }
  render(){
    const chartItems = this.state.charts.map((chart) => {
      return (
        <BaseChartContainer 
          key={chart.id}
          config={chart}
          />
      );
    });
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
              background: "#fff",
              position: "absolute",
              width: `${this.state.width}px`,
              height: `${this.state.height}px`,
              transform: `scale(${this.state.scale}`,
              transformOrigin: "0 0",
            }}
            onClick={this.canvasClickHandler}
            >
            {chartItems}
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
            onMouseOut={this.thumbSelectMouseLeaveHandler}
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
  /*
   * event handler
   * */
  viewScopeResizeHandler = () => {
    this.initEditSider(this.state.scale);
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
    if(movementX){
      this.thumbSelectMoveX(movementX);
    }
    if(movementY){
      this.thumbSelectMoveY(movementY);
    }
  }
  thumbSelectMouseLeaveHandler = (e) => {
    console.log("out")
    //e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
    e.stopPropagation();
  }
  thumbSelectMouseUpHandler = (e) => {
    console.log("up")
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
    e.stopPropagation();
  }
  thumbSelectMouseDownHandler = (e) => {
    console.log("down")
    e.target.addEventListener("mousemove", this.thumbSelectMouseMoveHandler);
    e.stopPropagation();
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
  /*
   * setter
   * */
  setViewScopeEle = (ele) => {
    this.viewScopeEle = ele;
    this.resizeObserver.observe(this.viewScopeEle);
  }
  setThumbEle = (ele) => {
    this.thumbEle = ele;
  }
  /*
   * init
   * */
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

    const thumbSelectShiftX = Math.ceil((thumbCanvasWidth - thumbSelectWidth) / 2);
    const thumbSelectShiftY = Math.ceil((thumbCanvasHeight - thumbSelectHeight) / 2);
    this.setState({
      thumbCanvasWidth: thumbCanvasWidth,
      thumbCanvasHeight: thumbCanvasHeight,
      thumbSelectWidth: thumbSelectWidth,
      thumbSelectHeight: thumbSelectHeight,
      thumbSelectShiftX: 0,
      thumbSelectShiftY: 0,
    });
    this.viewScopeEle.scrollTo(0,0);
  }
  /*
   * common
   * */
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
  addChart = (chart) => {
    this.setState({
      charts: this.state.charts.concat(chart),
    });
  }
} 
