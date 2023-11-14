import React from "react"
import "./toggle.css"

/**
 * A simple toggle component
 */
export const Toggle = (props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }} className="toggle-root">
      <label className="toggler-wrapper style-1">
        <input
          id={props.label}
          type={"checkbox"}
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)} />
        <div className="toggler-slider">
          <div className="toggler-knob"></div>
        </div>
      </label>
      <label style={{ fontSize: "medium" }} htmlFor={props.label}>
        {props.label}
      </label>
    </div>
  );
};
