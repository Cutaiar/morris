import * as React from "react";
import styled from "styled-components";

export type SliderProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "min" | "max" | "value" | "onChange"
> & {
  suffix?:
    | string
    | ((value: string | number | readonly string[] | undefined) => string);
  label?: string;
};

export const Slider: React.FC<SliderProps> = (props) => {
  const { value, suffix, label, ...rest } = props;

  // TODO: Instanceof is probably not a sufficient check
  const s =
    suffix instanceof Function ? suffix(value) : `${value} ${suffix ?? ""}`;

  return (
    <Root>
      {label && <label>{label}</label>}
      <SliderContainer>
        <SliderInput name={"slider"} value={value} {...rest} />
        <label>{s}</label>
      </SliderContainer>
    </Root>
  );
};

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 4px;
  gap: 4px;
`;

const Root = styled.div`
  display: block;
  font-size: ${(p) => p.theme.fontSizes.medium};
`;

const SliderInput = styled.input.attrs({ type: "range" })`
  --slider-diameter: 16px;
  -webkit-appearance: none;
  height: 1px;
  background: ${(p) => p.theme.palette.neutral};
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--slider-diameter);
    height: var(--slider-diameter);
    border-radius: 50%;
    background: ${(p) => p.theme.palette.neutral};
    cursor: pointer;

    -webkit-transition: 0.2s;
    transition: width 0.2s;
  }

  &::-moz-range-thumb {
    width: var(--slider-diameter);
    height: var(--slider-diameter);
    border-radius: 50%;
    background: ${(p) => p.theme.palette.neutral};
    cursor: pointer;
  }
`;
