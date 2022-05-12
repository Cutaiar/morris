import React from "react";
import { palette } from "../../theme";

export interface BoardProps {
  /** pixel size of the board */
  size?: number;
}

/**
 * Represents the morris board to be played on.
 *
 * Currently 3 rings for 9 men morris
 * Currently just messing around with declarative graphics
 */
export const Board: React.FC<BoardProps> = (props) => {
  const size = props.size ?? 400;

  // Define 3 rings for 9 men morris
  const r0 = size * 0.3;
  const r1 = size * 0.6;
  const r2 = size * 0.9;

  const pointRadius = size * 0.025;

  // Render these three rings and the two sets of connections between them
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Connections
        innerSize={r0}
        outerSize={r1}
        vbsize={size}
        stroke={palette.neutral}
      />
      <Connections
        innerSize={r1}
        outerSize={r2}
        vbsize={size}
        stroke={palette.neutral}
      />
      <Ring
        size={r0}
        vbsize={size}
        stroke={palette.neutral}
        pointFill={palette.primary}
        pointRadius={pointRadius}
      />
      <Ring
        size={r1}
        vbsize={size}
        stroke={palette.neutral}
        pointFill={palette.primary}
        pointRadius={pointRadius}
      />
      <Ring
        size={r2}
        vbsize={size}
        stroke={palette.neutral}
        pointFill={palette.primary}
        pointRadius={pointRadius}
      />
    </svg>
  );
};
type ConnectionsProps = {
  outerSize: number;
  innerSize: number;
  vbsize: number;
  stroke: string;
};

/**
 * Represents the 4 connecting lines between two rings (innerSize & outerSize)
 *
 */
const Connections = (props: ConnectionsProps) => {
  const { outerSize, innerSize, vbsize, stroke } = props;

  return (
    <g>
      <line
        stroke={stroke}
        x1={vbsize / 2}
        y1={(vbsize - outerSize) / 2}
        x2={vbsize / 2}
        y2={(vbsize - innerSize) / 2}
      />
      <line
        stroke={stroke}
        x1={outerSize + (vbsize - outerSize) / 2}
        y1={vbsize / 2}
        x2={innerSize + (vbsize - innerSize) / 2}
        y2={vbsize / 2}
      />
      <line
        stroke={stroke}
        x1={vbsize / 2}
        y1={outerSize + (vbsize - outerSize) / 2}
        x2={vbsize / 2}
        y2={innerSize + (vbsize - innerSize) / 2}
      />
      <line
        stroke={stroke}
        x1={(vbsize - outerSize) / 2}
        y1={vbsize / 2}
        x2={(vbsize - innerSize) / 2}
        y2={vbsize / 2}
      />
    </g>
  );
};

type RingProps = {
  size: number;
  vbsize: number;
  stroke: string;
  pointFill: string;
  pointRadius: number;
};

/**
 * Represents a single ring on the board. A square with 8 points
 */
const Ring = (props: RingProps) => {
  const { size, vbsize, stroke, pointFill, pointRadius } = props;
  const offset = vbsize - size;
  const origin = offset / 2;

  return (
    <g>
      <rect
        x={origin}
        y={origin}
        width={size}
        height={size}
        rx="5"
        fillOpacity={0}
        stroke={stroke}
      />
      <circle cx={origin} cy={offset / 2} r={pointRadius} fill={pointFill} />
      <circle
        cx={origin + size / 2}
        cy={offset / 2}
        r={pointRadius}
        fill={pointFill}
      />

      <circle
        cx={size + offset / 2}
        cy={offset / 2}
        r={pointRadius}
        fill={pointFill}
      />
      <circle
        cx={size + offset / 2}
        cy={origin + size / 2}
        r={pointRadius}
        fill={pointFill}
      />

      <circle
        cx={size + offset / 2}
        cy={size + origin}
        r={pointRadius}
        fill={pointFill}
      />
      <circle
        cx={origin + size / 2}
        cy={size + origin}
        r={pointRadius}
        fill={pointFill}
      />

      <circle
        cx={offset / 2}
        cy={size + origin}
        r={pointRadius}
        fill={pointFill}
      />
      <circle
        cx={offset / 2}
        cy={size / 2 + origin}
        r={pointRadius}
        fill={pointFill}
      />
    </g>
  );
};
