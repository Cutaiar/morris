import React from "react";
import { palette } from "../../theme";

export interface BoardProps {
  /** pixel size of the board */
  size?: number;
  /** Number of rings the board should have (2 to 6) */
  ringCount?: number;
}

const sizeDefault = 400;
export const ringCountDefault = 3;

export const maxRings = 6;
export const minRings = 2; // TODO -- we can support 3 men morris (1 ring) by adding a center point

/** Throws if ringCount is not in the supported range */
const validateRingCount = (ringCount: number) => {
  if (ringCount > maxRings || ringCount < minRings) {
    throw new Error(
      `ringCount of ${ringCount} was outside the supported range (${minRings} - ${maxRings})`
    );
  }
};

/**
 * Represents the morris board to be played on.
 *
 * Note: component should be used inside ErrorBoundary as it throws when props are not valid.
 */
export const Board: React.FC<BoardProps> = (props) => {
  // Provide sensible defaults if props aren't provided
  const size = props.size ?? sizeDefault;
  const ringCount = props.ringCount ?? ringCountDefault;

  // Throw if ringCount is outside supported range (component should be used inside ErrorBoundary)
  validateRingCount(ringCount);

  // We use this in the ring size calculation to pad the outer ring from the edge of the svg
  const paddedSize = size * 0.9;

  // Build ring sizes based on ringCount
  const rings = new Array(ringCount)
    .fill(undefined)
    .map((_, i) => paddedSize * (i + 1) * (1 / ringCount));

  const pointRadius = size * 0.025;

  // Render these three rings and the two sets of connections between them
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring, i) => {
        const nextRing = rings[i + 1];
        // Short circuit if there is no outer ring to draw a connection to.
        if (!nextRing) return undefined;

        // Otherwise draw connections from the current ring to the next one out
        return (
          <Connections
            innerSize={ring}
            outerSize={nextRing}
            vbsize={size}
            stroke={palette.neutral}
          />
        );
      })}
      {rings.map((ring) => (
        <Ring
          size={ring}
          vbsize={size}
          stroke={palette.neutral}
          pointFill={palette.primary}
          pointRadius={pointRadius}
        />
      ))}
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
