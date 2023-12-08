import React from "react";

// Style
import "./Slider.css";

export interface SliderProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    "min" | "max" | "value" | "onChange"
  > {
  ringCount: number;
}

export const Slider: React.FC<SliderProps> = (props) => {
  const { ringCount, ...rest } = props;
  const strings = {
    ringsPlural: "rings",
  };
  return (
    <div className="sliderContainer">
      <input type="range" className="slider" name={"slider"} {...rest} />
      <label htmlFor="ringCountInput">{`${ringCount} ${strings.ringsPlural}`}</label>
    </div>
  );
};

/* Usage:
<Slider
  min={minRings}
  max={maxRings}
  value={ringCount}
  onChange={(e) => setRingCount(Number(e.target.value))}
  ringCount={ringCount}
/>
*/