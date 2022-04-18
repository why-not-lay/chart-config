import React from "react";
import { Slider, InputNumber, Row, Col} from "antd";
import BaseChartContainer from "../chart/BaseChartContainer";
import BaseEleContainer from "../chart/BaseEleContainer";
import ChartConfigSider from "./ChartConfigSider";
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
      curInstanceId: 0,
      curRect: null,
      curType: "",
      curOption: null, // only for chart
      curConfig: null, // only for chart
      curStyle: null, // only for ele
      curInnerHtml: null, // only for ele
      charts: {},
      eles: {},
    }
    this.viewScopeEle = null;
    this.thumbEle = null;
    this.thumbEleCtx = null;
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
    return;
    (this.fetchInstancesData()).then((data) => {
      const {scale, width, height, eles, charts} = data;
      Object.keys(charts).forEach((key) => {
        const {autoFlash, dataUrl, interval} = charts[key].config;
        if(autoFlash && dataUrl){
          const intervalID = setInterval(() => {
            console.log("getter");
          }, interval * 1000);
          charts[key].config.intervalID = intervalID;
        }
      });
      this.setState({
        scale: scale,
        width: width,
        height: height,
        eles: eles,
        charts: charts,
      });
    });
  }
  render(){
    const chartItems = Object.keys(this.state.charts).map((key) => {
      const chart = this.state.charts[key];
      return (
        <BaseChartContainer 
          key={key}
          id={key}
          rect={chart.rect}
          option={chart.option}
          scale={this.state.scale}
          ref={(ref) => {
            if(key in this.state.charts) {
              this.state.charts[key].ref = ref;
            }
          }}
          onSetCurChartRef={this.setCurInstanceRef.bind(this)}
          onSetChartRect={this.setInstanceRect.bind(this)}
          />
      );
    });
    const eleItems = Object.keys(this.state.eles).map((key) => {
      const ele = this.state.eles[key];
      return (
        <BaseEleContainer 
          key={key}
          id={key}
          rect={ele.rect}
          innerHtml={ele.innerHtml}
          style={ele.style}
          scale={this.state.scale}
          ref={(ref) => {
            if(key in this.state.eles) {
              this.state.eles[key].ref = ref;
            }
          }}
          onSetCurEleRef={this.setCurInstanceRef.bind(this)}
          onSetEleRect={this.setInstanceRect.bind(this)}
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
            {eleItems}
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
        <ChartConfigSider 
          id={this.state.curInstanceId}
          type={this.state.curType}
          curRect={this.state.curRect}
          curOption={this.state.curOption}
          curConfig={this.state.curConfig}
          curStyle={this.state.curStyle}
          curInnerHtml={this.state.curInnerHtml}
          ref={this.setChartConfigSiderRef}
          onSetInstanceRect={this.setInstanceRect}
          onSetChartOption={this.setChartOption}
          onSetChartConfig={this.setChartConfig}
          onSetEleStyle={this.setEleStyle}
          onSetEleInnerHtml={this.setEleInnerHtml}
          onRemoveInstance={this.removeInstance.bind(this)}
          onSetIntervalGetter={this.setIntervalGetter}
          onClearCurChartRef={this.clearCurInstanceRef.bind(this)}
          />
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
    this.setConfigSider(false);
    //this.clearCurChartRef();
    this.clearCurInstanceRef();
    e.stopPropagation();
  }
  containerClickHandler = (e) => {
    this.setConfigSider(false);
    //this.clearCurChartRef();
    this.clearCurInstanceRef();
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
  setIntervalGetter = (id) => {
    if(!(id in this.state.charts)){
      return;
    }
    const config = this.state.charts[id].config
    this.closeIntervalGetter(id);
    if(!config.autoFlash || config.dataUrl === ""){
      return;
    }
    const intervalID = setInterval(() => {
      console.log("getter");
    }, config.interval * 1000);
    const newConfig = {...config};
    newConfig.intervalID = intervalID;
    this.setChartConfig(id, newConfig)
  }
  closeIntervalGetter = (id) => {
    if(!(id in this.state.charts)){
      return;
    }
    const config = this.state.charts[id].config
    if(config.intervalID !== -1){
      clearInterval(config.intervalID);
    }
    const newConfig = {...config};
    newConfig.intervalID = -1;
    this.setChartConfig(id, newConfig);
  }
  setConfigSider = (isOpen) => {
    if(this.chartConfigSiderRef){
      this.chartConfigSiderRef.setConfigSider(isOpen);
    }
  }
  setChartConfigSiderRef = (ref) => {
    this.chartConfigSiderRef = ref;
  }
  setEle = (id, data) => {
    let {newRect, newInnerHtml, newStyle} = data;
    if(!newRect && isNaN(newInnerHtml) && !newStyle){
      return;
    }
    const newEles = {...this.state.eles};
    if(newRect){
      newEles[id].rect = newRect;
    } else {
      newRect = newEles[id].rect;
    }
    if(!isNaN(newInnerHtml)){
      newEles[id].innerHtml = newInnerHtml;
    } else {
      newInnerHtml = newEles[id].innerHtml;
    }
    if(newStyle){
      newEles[id].style = newStyle;
    } else {
      newStyle = newEles[id].style;
    }
    this.setState({
      eles: newEles,
      curRect: newRect,
      curInnerHtml: newInnerHtml,
      curStyle: newStyle,
    },
    () => {
      this.redrawThumb();
    });
  }
  setChart = (id, data) => {
    let {newRect, newOption, newConfig} = data;
    if(!newRect && !newOption && !newConfig){
      return;
    }
    const newCharts = {...this.state.charts};
    if(newRect){
      newCharts[id].rect = newRect;
    } else {
      newRect = newCharts[id].rect;
    }
    if(newOption){
      newCharts[id].option = newOption;
    } else {
      newOption = newCharts[id].option;
    }
    if(newConfig){
      newCharts[id].config = newConfig;
    } else {
      newConfig = newCharts[id].config;
    }
    this.setState({
      charts: newCharts,
      curRect: newRect,
      curOption: newOption,
      curConfig: newConfig,
    },
    () => {
      this.redrawThumb();
      this.state.charts[id].ref.updateChart();
    });
  }
  setEleInnerHtml = (id, innerHtml) => {
    this.setEle(id, {
      newInnerHtml: innerHtml,
    });
  }
  setEleStyle = (id, style) => {
    this.setEle(id, {
      newStyle: style,
    });
  }
  setChartConfig = (id, config) => {
    this.setChart(id, {
      newConfig: config,
    });
  }
  setChartOption = (id, newOption) => {
    this.setChart(id, {
      newOption: newOption
    });
  }
  setInstanceRect = (id, rect) => {
    if(this.state.curType === "chart"){
      this.setChart(id, {newRect: rect});
    } else if (this.state.curType === "ele"){
      this.setEle(id, {newRect: rect});
    }
  }
  
  setChartToolValiable = (ref, valiable) => {
    if(ref){
      ref.setToolVisible(valiable);
      ref.setMoveable(valiable);
    }
  }
  setCurInstanceRef = (id) => {
    const curId = this.state.curInstanceId;
    const curInstances = this.state.curType === "chart" ? this.state.charts : this.state.eles;
    if(curId){
      this.setChartToolValiable(curInstances[curId].ref, false);
    }
    let type = "", 
        rect = null, 
        option = null, 
        config = null,
        style = null,
        innerHtml = null,
        selectInstances = null;
    if(id in this.state.charts){
      selectInstances = this.state.charts;
      type = "chart";
      rect = selectInstances[id].rect;
      option = selectInstances[id].option;
      config = selectInstances[id].config;
    } else if(id in this.state.eles){
      selectInstances = this.state.eles;
      type = "ele";
      rect = selectInstances[id].rect;
      style = selectInstances[id].style;
      innerHtml = selectInstances[id].innerHtml;
    } else{
      throw Error(`no such id: ${id}`)
    }
    this.setState({
      curInstanceId: id,
      curType: type,
      curRect: rect,
      curOption: option,
      curConfig: config,
      curStyle: style,
      curInnerHtml: innerHtml,
    }, 
    () => {
      this.setChartToolValiable(selectInstances[id].ref, true);
      this.setConfigSider(true);
      this.redrawThumb();
    });
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
    },
    () => {
      this.redrawThumb();
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
  addEle = (ele) => {
    const {id} = ele;
    this.setState({
      eles: {...this.state.eles, [id]: ele},
    },
    () => {
      this.redrawThumb();
    });
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
      const {x, y, width, height} = this.state.charts[key].rect; 
      const realX = Math.ceil(x * a);
      const realY = Math.ceil(y * a);
      const realWidth = Math.ceil(width * a);
      const realHeight = Math.ceil(height * a);
      this.drawThumbRect(realX, realY, realWidth, realHeight, this.thumbEleRectColor);
    });
    Object.keys(this.state.eles).forEach((key) => {
      const {x, y, width, height} = this.state.eles[key].rect; 
      const realX = Math.ceil(x * a);
      const realY = Math.ceil(y * a);
      const realWidth = Math.ceil(width * a);
      const realHeight = Math.ceil(height * a);
      this.drawThumbRect(realX, realY, realWidth, realHeight, this.thumbEleRectColor);
    });
    if(!this.state.curInstanceId){
      return;
    }
    const {x, y, width, height} = this.state.curRect;
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
  clearCurInstanceRef = () => {
    const id = this.state.curInstanceId;
    if(!id){
      return;
    }
    const instances = this.state.curType === "chart" ? this.state.charts : this.state.eles;
    this.setChartToolValiable(instances[id].ref, false);
    this.setState({
      curInstanceId: 0,
      curRect: null,
      curType: "",
      curOption: null,
      curConfig: null,
      curStyle: null,
      curInnerHtml: null,
    },
    () => {
      this.redrawThumb();
    });
  }
  removeInstance = (id) => {
    if(!(["chart", "ele"].includes(this.state.curType))){
      return;
    }
    const instances = this.state.curType === "chart" ? this.state.charts : this.state.eles;
    if(!(id in instances)){
      return;
    }
    this.setConfigSider(false);
    this.clearCurInstanceRef();
    const newInstances = {...instances};
    delete newInstances[id];
    if(this.state.curType === "chart"){
      this.setState({
        charts: newInstances,
      });
    } else if(this.state.curType === "ele"){
      this.setState({
        eles: newInstances,
      });
    }
  }
  getInstancesData = () => {
    const charts = {};
    const eles = {};
    Object.keys(this.state.charts).forEach((key) => {
      const {id, type, rect, option, config} = this.state.charts[key];
      const obj = {...option}
      obj.dataset.source = [];
      charts[key] = {
        id: id,
        type: type,
        rect: rect,
        option: obj,
        config: config,
      };
    });
    Object.keys(this.state.eles).forEach((key) => {
      const {id, type, rect, style, innerHtml} = this.state.eles[key];
      eles[key] = {
        id: id,
        type: type,
        rect: rect,
        style: style,
        innerHtml: innerHtml,
      };
    });
    return {
      eles: eles,
      charts: charts,
      width: 1920,
      height: 1080,
      scale: 0.5,
    };
  }
  saveInstances = async () => {
    await (new Promise((resolve) => {
      setTimeout((() => {
        const data = JSON.stringify(this.getInstancesData());
        console.log(data);
        resolve();
      }).bind(this), 1000);
    }));
  }
  fetchInstancesData = async () => {
    await (new Promise((resolve) => {
      setTimeout((() => {
        resolve();
      }).bind(this), 1000);
    }));
    const data = '{"eles":{},"charts":{"1650251650999":{"id":1650251650999,"type":"chart","rect":{"x":330,"y":18,"width":300,"height":300},"option":{"title":{"text":"折线图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"line","smooth":true}]},"config":{"dataUrl":"efef","autoFlash":true,"interval":10,"intervalID":-1}},"1650251723272":{"id":1650251723272,"type":"chart","rect":{"x":206,"y":412,"width":300,"height":300},"option":{"title":{"text":"柱状图"},"tooltip":{"trigger":"axis"},"xAxis":{},"yAxis":{"type":"value"},"dataset":{"source":[]},"series":[{"type":"bar"}]},"config":{"dataUrl":"","autoFlash":true,"interval":1,"intervalID":-1}},"1650251728473":{"id":1650251728473,"type":"chart","rect":{"x":16,"y":48,"width":300,"height":300},"option":{"title":{"text":"饼图"},"tooltip":{"trigger":"item"},"dataset":{"source":[]},"series":[{"type":"pie"}]},"config":{"dataUrl":"","autoFlash":false,"interval":1,"intervalID":-1}}},"width":1920,"height":1080,"scale":0.5}';
    return JSON.parse(data);
  }
} 
