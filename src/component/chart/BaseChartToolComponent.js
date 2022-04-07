import React from "react";

export default class BaseChartToolComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
    this.eles = {};
    this.cornerSize = 20;
  }
  render(){
    return (
      <div
        className="base-chart-tool-component"
        style={{
          position: "absolute",
          display: `${this.props.visible ? "block" : "none"}`,
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          border: "1px solid #000",
          zIndex: "1",
        }}
        >
        <div
          className="base-chart-tool-component-left-top"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            left: `-${this.cornerSize / 2 / this.props.scale}px`,
            top: `-${this.cornerSize / 2 / this.props.scale}px`,
            background: "#000",
            cursor: "nwse-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "lt")}}
          ref={(ele) => {this.setEle(ele, "lt")}}
          />
        <div
          className="base-chart-tool-component-right-top"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            right: `-${this.cornerSize / 2 / this.props.scale}px`,
            top: `-${this.cornerSize / 2 / this.props.scale}px`,
            background: "#000",
            cursor: "nesw-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "rt")}}
          ref={(ele) => {this.setEle(ele, "rt")}}
          />
        <div
          className="base-chart-tool-component-right-bottom"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            right: `-${this.cornerSize / 2 / this.props.scale}px`,
            bottom: `-${this.cornerSize / 2 / this.props.scale}px`,
            background: "#000",
            cursor: "nwse-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "rb")}}
          ref={(ele) => {this.setEle(ele, "rb")}}
          />
        <div
          className="base-chart-tool-component-left-bottom"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            left: `-${this.cornerSize / 2 / this.props.scale}px`,
            bottom: `-${this.cornerSize / 2 / this.props.scale}px`,
            background: "#000",
            cursor: "nesw-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "lb")}}
          ref={(ele) => {this.setEle(ele, "lb")}}
          />
        <div
          className="base-chart-tool-component-top"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            top: `-${this.cornerSize / 2 / this.props.scale}px`,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#000",
            cursor: "ns-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "t")}}
          ref={(ele) => {this.setEle(ele, "t")}}
          />
        <div
          className="base-chart-tool-component-right"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            right: `-${this.cornerSize / 2 / this.props.scale}px`,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#000",
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "r")}}
          ref={(ele) => {this.setEle(ele, "r")}}
          />
        <div
          className="base-chart-tool-component-bottom"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            bottom: `-${this.cornerSize / 2 / this.props.scale}px`,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#000",
            cursor: "ns-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "b")}}
          ref={(ele) => {this.setEle(ele, "b")}}
          />
        <div
          className="base-chart-tool-component-left"
          style={{
            position: "absolute",
            width: `${this.cornerSize / this.props.scale}px`,
            height: `${this.cornerSize / this.props.scale}px`,
            left: `-${this.cornerSize / 2 / this.props.scale}px`,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#000",
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => {this.mouseDownHandler(e, "l")}}
          ref={(ele) => {this.setEle(ele, "l")}}
          />
      </div>
    );
  }
  /*
   * setter
   * */
  setEle = (ele, direction) => {
    this.eles[direction] = ele;
  }
  /*
   * event handler
   * */
  mouseDownHandler = (e, direction) => {
    console.log(direction);
    this.props.onSetMoveable(false);
    e.stopPropagation();
    let {screenX: preX, screenY: preY} = e;
    const moveHandler = (me) => {
      const {screenX: curX, screenY: curY} = me;
      const offsetX = curX - preX;
      const offsetY = curY - preY;
      if(offsetX){
        this.moveX(offsetX, direction);
      }
      if(offsetY){
        this.moveY(offsetY, direction);
      }
      preX = curX;
      preY = curY;
    }
    const ele = this.eles[direction];
    ele.addEventListener("mousemove", moveHandler);
    ele.addEventListener("mouseup", (ue) => {
      ele.removeEventListener("mousemove", moveHandler);
    });
    ele.addEventListener("mouseout", (oe) => {
      ele.removeEventListener("mousemove", moveHandler);
    });
  }
  /*
   * common
   * */
  moveX = (movementX, direction) => {
    if(direction.search(/l|r/) === -1){
      return;
    }
    const f = direction.indexOf("l") === -1 ? 1 : -1;
    this.props.onSetContainerMoveW(f * movementX);
    if(f === -1){
      this.props.onSetContainerMoveX(-f * movementX);
    }
  }
  moveY = (movementY, direction) => {
    if(direction.search(/t|b/) === -1){
      return;
    }
    const f = direction.indexOf("t") === -1 ? 1 : -1;
    this.props.onSetContainerMoveH(f * movementY);
    if(f === -1){
      this.props.onSetContainerMoveY(-f * movementY);
    }
  }
}
