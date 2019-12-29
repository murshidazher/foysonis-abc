import React from "react";
import "./CheckBox.css";

const CheckBox = props => {
  return (
    <div className="checkbox">
      <input type="checkbox" className="checkbox__box" id={props.id} />
      <label htmlFor={props.id} className="checkbox__label">
        {props.title}
      </label>
    </div>
  );
};

export default CheckBox;
