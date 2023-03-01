import React, { useEffect, useState } from "react";

type DragEventsProps = React.PropsWithChildren<{
  onDragMove: React.PointerEventHandler<SVGGElement>;
  onPointerDown?: React.PointerEventHandler<SVGGElement>;
  onPointerUp?: React.PointerEventHandler<SVGGElement>;
  onPointerMove?: React.PointerEventHandler<SVGGElement>;
  style?: React.CSSProperties;
  className?: string;
}>;

/** Base implementation of SVG drag and drop using pointer events from [javascript.plainenglish.io](https://javascript.plainenglish.io/how-to-make-a-simple-custom-drag-to-move-component-in-react-f67d5c99f925)
 *
 * Renders its children inside a `<g>` tag which is listening for DND events. These events are then bubbled up via props.
 */
export const DragEvents = (props: DragEventsProps) => {
  const {
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onDragMove,
    children,
    style,
    className,
  } = props;

  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = React.useCallback(
    (e: any) => {
      setIsDragging(true);
      console.log("pointer down");
      onPointerDown?.(e);
    },
    [onPointerDown]
  );

  const handlePointerUp = React.useCallback(
    (e: any) => {
      setIsDragging(false);
      console.log("pointer up");
      onPointerUp?.(e);
    },
    [onPointerUp]
  );

  const handlePointerMove = React.useCallback(
    (e: any) => {
      if (isDragging) {
        onDragMove(e);
      }
      onPointerMove?.(e);
    },
    [isDragging, onDragMove, onPointerMove]
  );

  // Pointer move must be on the window to prevent dropping from mouse trailing
  //https://stackoverflow.com/questions/5758090/dragging-a-div-in-jquery-fine-when-mouse-is-slow-but-fails-on-fast-mouse-move
  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove]);

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  return (
    <g onPointerDown={handlePointerDown} style={style} className={className}>
      {children}
    </g>
  );
};
