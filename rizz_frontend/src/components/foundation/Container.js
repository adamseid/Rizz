import React from "react";
import "../../App";
import Navbar from "./Navbar";

// Since the container and the navbar shows up on every page,
// we will have them as components which we can just render on each page

function Container(props) {
  return (
    <div className="container">
      <Navbar />
      {props.children}
    </div>
  );
}

export default Container;
