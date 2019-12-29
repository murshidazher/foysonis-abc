import React from "react";
import "./Button.css";

const Button = props => {
  return (
    <button className="btn" onClick={props.onClick(props.route)}>
      <span className="btn__content">{props.title}</span>
    </button>
  );
};

export default Button;
