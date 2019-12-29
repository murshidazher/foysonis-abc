import React, { Component } from "react";
import "./Slider.css";

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  calcProgressBar = () => {
    return (this.props.width * this.state.value) / 100;
  };

  onRefresh = () => {
    this.setState({ value: 50 });
  }

  render() {
    return (
      <div className="slider" style={{ width: this.props.width + "px" }}>
        <div className="slider__comp">
          <div className="refresh__wrapper" onClick={this.onRefresh}>
            <svg className="refresh"></svg>
          </div>
        </div>
        <div className="a">{this.props.title}</div>

        <div className="b">
          <span className="b__text">{this.state.value}</span>
        </div>

        <div className="barCnt">
          <input
            className="colorized"
            type="range"
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            value={this.state.value}
            id="range2"
            onChange={this.handleChange}
          />
          <p
            className="preBar"
            style={{ width: this.calcProgressBar() + "px" }}
          ></p>
        </div>
      </div>
    );
  }
}

export default Slider;
