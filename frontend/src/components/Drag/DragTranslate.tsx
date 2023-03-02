import * as React from "react";
import { DragEvents } from "./DragEvents";

type DragTranslateProps = React.PropsWithChildren<{
  /** Max distance in pixels this item may be dragged from its starting position. Currently ignored */
  maxDistance?: number;
  /** Do not allow a drag when true */
  disabled?: boolean;
  /** Called when the component is being dragged */
  onDrag?: () => void;
}>;

type Vector = { x: number; y: number };

const dist = (p1: Vector, p2: Vector) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const clampMag = (v: Vector, mag: number) => {
  // Divide by the norm, so you have a vector of unit length.
  const n = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
  // Multiply by the minimum of the original norm and your maximum.
  const f = Math.min(n, mag) / n;
  return { x: f * v.x, y: f * v.y };
};

const origin = {
  x: 0,
  y: 0,
};

/** Wrap an SVG Element to allow it to be dragged and dropped */
export const DragTranslate = (props: DragTranslateProps) => {
  const { children, maxDistance } = props;
  const disabled = props.disabled ?? false;
  const [translate, setTranslate] = React.useState<Vector>(origin);
  const [dragging, setDragging] = React.useState(false);

  const animref = React.useRef<any>();

  const handleDragMove: React.PointerEventHandler<SVGGElement> = (e) => {
    // Bail if disabled
    if (disabled) {
      return;
    }

    setDragging(true);
    // Allow us to drag over top other elements
    e.stopPropagation();
    const target = {
      x: translate.x + e.movementX,
      y: translate.y + e.movementY,
    };

    // TODO: Can we make this softer? Or "break" and lerp back to starting?
    if (maxDistance === undefined || dist(origin, target) < maxDistance) {
      setTranslate(target);
    } else {
      // This is clamping behavior that is not quite right for reasons above
      setTranslate(clampMag(target, maxDistance));

      // This is just ignoring that for now and taking the same action as the if
      // setTranslate(target);
    }
    props.onDrag?.();
  };

  return (
    <DragEvents
      onDragMove={handleDragMove}
      onPointerUp={() => {
        animref.current.beginElement();
        setTimeout(() => setTranslate(origin), 100);
        setDragging(false);
      }}
    >
      <g
        transform={
          dragging ? `translate(${translate.x} ${translate.y})` : undefined
        }
      >
        {children}
        <animateTransform
          ref={animref}
          attributeName="transform"
          attributeType="XML"
          type="translate"
          from={`${translate.x} ${translate.y}`}
          to={`${origin.x} ${origin.y}`}
          begin={"indefinite"}
          dur={"100ms"}
          fill={"freeze"}
          additive="sum"
        />
      </g>
    </DragEvents>
  );
};
