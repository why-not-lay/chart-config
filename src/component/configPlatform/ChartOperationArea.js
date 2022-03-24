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
      charts: {},
    }

    this.viewScopeEle = null;
    this.thumbEle = null;
    this.thumbEleCtx = null;
    //this.curChartRef = null;
    this.curChartId = 0;
    this.thumbEleRectColor = "yellow";
    this.thumbEleSelectedRectColor = "green";
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
    const chartItems = Object.keys(this.state.charts).map((key) => {
      const chart = this.state.charts[key];
      return (
        <BaseChartContainer 
          key={key}
          config={chart}
          scale={this.state.scale}
          ref={(ref) => {
            this.state.charts[key].ref = ref;
          }}
          onSetCurChartRef={this.setCurChartRef.bind(this)}
          onSetChartContainerPos={this.setChartContainerPos.bind(this)}
          onSetChartContainerRect={this.setChartContainerRect.bind(this)}
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
    this.clearCurChartRef();
    e.stopPropagation();
  }
  containerClickHandler = (e) => {
    this.props.onSetConfigSider(false);
    this.clearCurChartRef();
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
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
    e.stopPropagation();
  }
  thumbSelectMouseUpHandler = (e) => {
    e.target.removeEventListener("mousemove", this.thumbSelectMouseMoveHandler);
    e.stopPropagation();
  }
  thumbSelectMouseDownHandler = (e) => {
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
  setChartContainerRect = (id, width, height) => {
    const chart = this.state.charts[id];
    chart.width = width;
    chart.height = height;
    this.redrawThumb();
  }
  setChartContainerPos = (id, x, y) => {
    const chart = this.state.charts[id];
    chart.x = x;
    chart.y = y;
    this.redrawThumb();
  }
  setChartToolValiable = (ref, valiable) => {
    if(ref){
      ref.setToolVisible(valiable);
      ref.setMoveable(valiable);
    }
  }
  setCurChartRef = (id) => {
    const curId = this.curChartId;
    if(curId){
      this.setChartToolValiable(this.state.charts[curId].ref, false);
    }
    this.curChartId = id;
    this.setChartToolValiable(this.state.charts[id].ref, true);
    this.redrawThumb();
  }
  setViewScopeEle = (ele) => {
    this.viewScopeEle = ele;
    this.resizeObserver.observe(this.viewScopeEle);
  }
  setThumbEle = (ele) => {
    this.thumbEle = ele;
    this.thumbEleCtx = ele.getContext("2d");
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
    const {id} = chart;
    this.setState({
      charts: {...this.state.charts, [id]: chart},
    },
    () => {
      this.redrawThumb();
    });
  }
  redrawThumb = () => {
    this.clearThumb();
    const a = this.scrollTimes / this.scrollLen;
    Object.keys(this.state.charts).forEach((key) => {
      const {x, y, width, height} = this.state.charts[key]; 
      const realX = Math.ceil(x * a);
      const realY = Math.ceil(y * a);
      const realWidth = Math.ceil(width * a);
      const realHeight = Math.ceil(height * a);
      this.drawThumbRect(realX, realY, realWidth, realHeight, this.thumbEleRectColor);
    });
    if(!this.curChartId){
      return;
    }
    const {x, y, width, height} = this.state.charts[this.curChartId]; 
    const realX = Math.ceil(x * a);
    const realY = Math.ceil(y * a);
    const realWidth = Math.ceil(width * a);
    const realHeight = Math.ceil(height * a);
    this.drawThumbRect(realX, realY, realWidth, realHeight, this.thumbEleSelectedRectColor);
    
  }
  removeThumbRect = () => {
    this.drawThumbRect(x, y, width, height, "white");
  }
  clearThumb = () => {
    this.drawThumbRect(0, 0, this.state.thumbCanvasWidth, this.state.thumbCanvasHeight, "white");
  }
  drawThumbRect = (x, y, width, height, color) => {
    if(!this.thumbEleCtx){
      return;
    }
    this.thumbEleCtx.fillStyle = color;
    this.thumbEleCtx.fillRect(x, y, width, height);
  }
  clearCurChartRef = () => {
    const id = this.curChartId;
    if(!id){
      return;
    }
    this.setChartToolValiable(this.state.charts[id].ref, false);
    this.curChartId = 0;
    this.redrawThumb();
  }
} 
