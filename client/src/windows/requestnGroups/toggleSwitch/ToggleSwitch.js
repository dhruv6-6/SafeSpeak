import React from "react";
import "./ToggleSwitch.css";
  
const ToggleSwitch = ({ label , onclick}) => {
  return (
    <div className="container">
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" 
               name={label} id={label} />
        <label className="label" htmlFor={label}>
          <span className="inner" onClick={onclick}/>
          <span className="switch" onClick={onclick} />
        </label>
      </div>
    </div>
  );
};
  
export default ToggleSwitch;