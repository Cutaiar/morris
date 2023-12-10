import React from "react";
import styled from "styled-components";

/**
 * A simple toggle component
 *
 * Checkbox styles inspired by https://codepen.io/alvarotrigo/pen/wvyvjva
 */
export const Toggle = (props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <Root>
      <ToggleLabel>
        <input
          id={props.label}
          type={"checkbox"}
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
        />
        <Slider>
          <Knob />
        </Slider>
      </ToggleLabel>
      <TextLabel htmlFor={props.label}>{props.label}</TextLabel>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  align-items: center;
`;

const Slider = styled.div`
  background-color: ${({ theme }) => theme.palette.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral};
  border-style: solid;
  position: absolute;
  border-radius: 100px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
`;

const Knob = styled.div`
  position: absolute;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;

  width: calc(16px - 6px);
  height: calc(16px - 6px);
  border-radius: 50%;
  left: 2px;
  top: 2px;
  background-color: ${({ theme }) => theme.palette.neutral};
`;

const TextLabel = styled.label`
  font-size: ${(p) => p.theme.fontSizes.medium};
`;

const ToggleLabel = styled.label`
  display: block;
  width: 32px;
  height: 16px;
  cursor: pointer;
  position: relative;
  margin-right: 8px;

  & input[type="checkbox"] {
    display: none;
  }

  & input[type="checkbox"]:checked + ${Slider} {
    background-color: ${({ theme }) => theme.palette.neutral};

    & ${Knob} {
      left: calc(100% - 10px - 2px);
      background-color: ${({ theme }) => theme.palette.surface};
    }
  }
`;
