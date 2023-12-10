import * as React from "react";
import { DefaultTheme, useTheme } from "styled-components";

import {
  GameState,
  Occupancy,
  Point,
  PointID,
  isValidSelection,
  Action
} from "morris-core";

// Hooks
import { useDebug } from "hooks";

// Sound
import { useSound } from "use-sound";
import clickSound from "sound/octave-tap/tap-warm.mp3";
import hoverSound from "sound/octave-tap/tap-toothy.mp3";

/** Extend this interface to allow your component to support optional sound */
export interface HasSound {
  /** Whether or not to play sound fx */
  sound?: boolean;
}

export interface BoardProps extends HasSound {
  /** The current state of the game including adjacency, occupancy, turn, and more */
  gameState: GameState;

  /** Callback for when a player makes a play using the board */
  onPlay: (play: Action) => void;

  /** The player controlling the game, maybe this should be combined with gameState */
  disabled?: boolean;
}

export const maxRings = 6; // 6 rings is the maximum that looks OK right now. // TODO -- adapt point size and other things to support large number of rings
export const minRings = 2; // TODO -- we can support 3 men morris (1 ring) by adding a center point

/** Throws if ringCount is not in the supported range */
const validateRingCount = (ringCount: number) => {
  if (ringCount > maxRings || ringCount < minRings) {
    throw new Error(
      `ringCount of ${ringCount} was outside the supported range (${minRings} - ${maxRings})`
    );
  }
};

/** Represents a point, augmented with a little extra information to make displaying it easier / more efficient */
interface PointForDisplay extends Point {
  next?: boolean;
}

/**
 * Represents the morris board to be played on.
 *
 * Note: component should be used inside ErrorBoundary as it and other components inside throw.
 */
export const Board: React.FC<BoardProps> = (props) => {
  // Provide sensible defaults if props aren't provided
  const sound = props.sound ?? false;
  const { onPlay, gameState, disabled } = props;

  const [selectedPoint, setSelectedPoint] = React.useState<PointID>();
  const theme = useTheme();

  // We can calculate the number of rings based on the graph defined in state
  const numberOfPointsInRing = 8;
  const ringCount =
    Object.keys(gameState.stateGraph).length / numberOfPointsInRing;

  // Throw if ringCount is outside supported range (component should be used inside ErrorBoundary)
  validateRingCount(ringCount);

  // This is a magic value that makes the board look good
  const size = 400;

  // We use this in the ring size calculation to pad the outer ring from the edge of the svg
  const paddedSize = size * 0.9;
  const pointRadius = size * 0.035;

  // Build ring sizes based on ringCount
  const rings = !size
    ? []
    : new Array(ringCount).fill(undefined).map((_, i) => ({
        size: paddedSize * (i + 1) * (1 / ringCount),

        // This distributes 8 points from the state graph to each ring, moving from inner to outer
        // Here, we also take some information from the gameState and store it with the point for convenient display
        points: Object.entries(gameState.stateGraph)
          .slice(i * numberOfPointsInRing, (i + 1) * numberOfPointsInRing)
          .map<[PointID, PointForDisplay]>((p) => [
            p[0],
            {
              ...p[1],
              next: selectedPoint
                ? !Array.isArray(gameState.nextMoves) &&
                  gameState.nextMoves[selectedPoint].includes(p[0])
                : Array.isArray(gameState.nextMoves) &&
                  gameState.nextMoves.includes(p[0])
            }
          ])
      }));

  // When any point is clicked, dispatch an action noting so.
  // Action depends on the phase of the game and type of turn -- should tis rule be external to board?
  const onClick = (pointID: PointID) => {
    // If the turn is a "remove" turn, dispatch a removal
    if (gameState.turn.type === "remove") {
      onPlay({ type: "remove", to: pointID });
      return;
    }

    // If the game is in phase 1, dispatch a place
    if (gameState.phase === 1) {
      onPlay({ type: "place", to: pointID });
      return;
    }

    // If the game is in phase 2, let the user create a selection, and dispatch a move
    if (gameState.phase === 2) {
      // If there is a selection, must be the second click, dispatch a move and reset selection
      if (selectedPoint) {
        onPlay({ type: "move", from: selectedPoint, to: pointID });
        setSelectedPoint(undefined);
        return;
      }
      // Otherwise, if it's valid, this is their selection
      if (isValidSelection(pointID, gameState)) {
        setSelectedPoint(pointID);
        return;
      }
      return;
    }
  };

  // Render these three rings and the two sets of connections between them
  return (
    <svg viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring, i) => {
        const nextRing = rings[i + 1];
        // Short circuit if there is no outer ring to draw a connection to.
        if (!nextRing) return undefined;

        // Otherwise draw connections from the current ring to the next one out
        return (
          <Connections
            innerSize={ring.size}
            outerSize={nextRing.size}
            vbsize={size}
            stroke={theme.palette.neutral}
            key={i}
            theme={theme}
          />
        );
      })}

      {/* Currently have to reverse because rings must be drawn outer to inner to support click events */}
      {rings.reverse().map((ring) => (
        <Ring
          size={ring.size}
          vbsize={size}
          stroke={theme.palette.neutral}
          pointRadius={pointRadius}
          onClick={onClick}
          key={ring.size}
          points={ring.points}
          selectedPoint={selectedPoint}
          sound={sound}
          disabled={disabled}
          theme={theme}
        />
      ))}
    </svg>
  );
};

interface UsesTheme {
  theme: DefaultTheme;
}
interface ConnectionsProps extends UsesTheme {
  outerSize: number;
  innerSize: number;
  vbsize: number;
  stroke: string;
}

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

interface RingProps extends HasSound, UsesTheme {
  size: number;
  vbsize: number;
  stroke: string;
  pointRadius: number;
  points: [string, PointForDisplay][]; // Points in the ring from top-left clockwise as object.entries, augmented with display info
  onClick?: (pointID: PointID) => void;
  selectedPoint?: PointID;
  disabled?: boolean;
}

/**
 * Represents a single ring on the board. A square with 8 points
 */
const Ring = (props: RingProps) => {
  const sound = props.sound ?? false;
  const {
    size,
    vbsize,
    stroke,
    pointRadius,
    onClick,
    points,
    selectedPoint,
    disabled,
    theme
  } = props;
  const offset = vbsize - size;
  const origin = offset / 2;

  // Centers for square 6 man morris starting top-left going clockwise
  const centers = [
    { cx: origin, cy: offset / 2 },
    { cx: origin + size / 2, cy: offset / 2 },
    { cx: size + offset / 2, cy: offset / 2 },
    { cx: size + offset / 2, cy: origin + size / 2 },
    { cx: size + offset / 2, cy: size + origin },
    { cx: origin + size / 2, cy: size + origin },
    { cx: offset / 2, cy: size + origin },
    { cx: offset / 2, cy: size / 2 + origin }
  ];

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
      {points.map((point, i) => (
        <SVGPoint
          {...centers[i]}
          r={pointRadius}
          point={point[1]}
          id={point[0]}
          onClick={() => onClick?.(point[0])}
          selected={point[0] === selectedPoint}
          key={point[0]}
          sound={sound}
          disabled={disabled}
          theme={theme}
        />
      ))}
    </g>
  );
};

interface SVGPointProps extends HasSound, UsesTheme {
  cx: number;
  cy: number;
  r: number;
  point: PointForDisplay;
  id: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const SVGPoint: React.FC<SVGPointProps> = (props) => {
  const [hovered, setHovered] = React.useState(false);
  const {
    point,
    selected,
    onClick,
    sound: propsSound,
    disabled,
    theme,
    ...rest
  } = props;
  const sound = propsSound ?? false;

  const [debug] = useDebug(); // TODO how can we use this and be portable?

  const pointFill = (occupancy?: Occupancy) => {
    if (!occupancy) return theme.palette.surface;
    return occupancy === "a" ? theme.palette.primary : theme.palette.secondary;
  };

  const [playHover] = useSound(hoverSound);
  const [playClick] = useSound(clickSound);

  // Calc big r and small r for animation
  const { r } = rest;
  const br = 1.2 * r;
  const sr = 0.8 * r;

  // This allows us to trigger the animation when we want
  const isNext = !disabled && point.next;
  const isNextAnimationRef = React.useRef<any>();
  React.useEffect(() => {
    if (isNext) isNextAnimationRef.current.beginElement();
  }, [isNext]);

  return (
    <g>
      <circle
        {...rest}
        stroke={theme.palette.neutral}
        strokeWidth={selected ? 3 : 1}
        fill={pointFill(point.occupancy)}
        cursor={disabled ? "not-allowed" : "pointer"}
        onMouseOver={() => {
          if (disabled) return;
          // TODO: Should be informed by what kind of hover (empty valid, empty invalid, opponent, self, phase)
          sound && playHover();
          setHovered(true);
        }}
        onMouseOut={() => setHovered(false)}
        // TODO: Should be informed by what kind of click (empty valid, empty invalid, opponent, self, place, move)
        onClick={() => {
          if (disabled) return;
          onClick();
        }}
        onMouseDown={() => {
          if (disabled) return;
          sound && playClick();
        }}
        onMouseUp={() => {
          if (disabled) return;
          sound && playClick({ playbackRate: 1.5 });
        }}
      >
        {!disabled && HoverClickAnimations({ r, br, sr })}
      </circle>
      {!disabled && point.next && (
        <circle
          cx={rest.cx}
          cy={rest.cy}
          r={5}
          fill={"transparent"}
          stroke={theme.palette.neutral}
          pointerEvents="none"
        >
          <animate
            ref={isNextAnimationRef}
            attributeName="r"
            from={r}
            to={br}
            begin="indefinite"
            dur={"100ms"}
            fill="freeze"
          />
        </circle>
      )}
      {debug && (
        <text
          x={props.cx}
          y={props.cy}
          textAnchor="middle"
          stroke={theme.palette.neutralDark}
          fill={theme.palette.neutralDark}
          alignmentBaseline="middle"
          fontSize={props.r}
          cursor={"default"}
          pointerEvents={"none"}
        >
          {props.id}
        </text>
      )}
    </g>
  );
};

interface HoverClickAnimationsProps {
  r: number;
  br: number;
  sr: number;
}

const HoverClickAnimations = (props: HoverClickAnimationsProps) => {
  const { r, br, sr } = props;
  return (
    <>
      <animate
        attributeName="r"
        from={r}
        to={br}
        dur={"50ms"}
        begin="mouseenter"
        fill="freeze"
      />
      <animate
        attributeName="r"
        from={br}
        to={r}
        dur={"50ms"}
        begin="mouseleave"
        fill="freeze"
      />
      <animate
        attributeName="r"
        to={sr}
        from={br}
        dur={"50ms"}
        begin="mousedown"
        fill="freeze"
      />
      <animate
        attributeName="r"
        from={sr}
        to={r}
        dur={"50ms"}
        begin="mouseup"
        fill="freeze"
      />
    </>
  );
};
