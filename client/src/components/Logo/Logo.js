import React from "react";
import "./Logo.css";

const Logo = props => {
  return (
    <a className="navbar-brand" href="/">
      <svg
        className="logo"
        shapeRendering="geometricPrecision"
        style={{
          backgroundImage: `url(${props.backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          margin: `${props.margin}`
        }}
      ></svg>
    </a>
  );
};

export default Logo;
