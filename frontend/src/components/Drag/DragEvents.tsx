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

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    console.log("drag");
    onPointerDown?.(e);
  };

  const handlePointerUp = React.useCallback(
    (e: any) => {
      setIsDragging(false);
      console.log("drop");

      onPointerUp?.(e);
    },
    [onPointerUp]
  );

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      onDragMove(e);
    }
    onPointerMove?.(e);
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  return (
    <g
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={style}
      className={className}
    >
      {children}
    </g>
  );
};
