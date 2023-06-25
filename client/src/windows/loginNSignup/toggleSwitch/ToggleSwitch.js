import React from "react";
import "./ToggleSwitch.css";
  
const ToggleSwitch = ({ label , onclick}) => {
  return (
    <div className="container_12">
      <div className="toggle-switch_12">
        <input type="checkbox" className="checkbox_12"
               name={label} id={label} />
        <label className="label_12" htmlFor={label}>
          <span className="inner_12" onClick={onclick}/>
          <span className="switch_12" onClick={onclick} />
        </label>
      </div>
    </div>
  );
};
  
export default ToggleSwitch;