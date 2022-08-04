import * as React from "react";
import { DragMove } from "./Drag";

type DragTranslateProps = React.PropsWithChildren<{}>;

/** Wrap an SVG Element to allow it to be dragged and dropped */
export const DragTranslate = (props: DragTranslateProps) => {
  const { children } = props;
  const [translate, setTranslate] = React.useState({
    x: 0,
    y: 0,
  });

  const handleDragMove = (e: any) => {
    console.log("move");
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY,
    });
  };

  return (
    <DragMove onDragMove={handleDragMove}>
      <g transform={`translate(${translate.x} ${translate.y})`}>{children}</g>
    </DragMove>
  );
};
