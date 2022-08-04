import React, { useEffect, useState } from "react";

type DragMoveProps = React.PropsWithChildren<{
  onDragMove: (e: any) => void;
  onPointerDown?: (e: any) => void;
  onPointerUp?: (e: any) => void;
  onPointerMove?: (e: any) => void;
  style?: React.CSSProperties;
  className?: string;
}>;

/** Base implementation of SVG drag and drop using pointer events from:
 * https://javascript.plainenglish.io/how-to-make-a-simple-custom-drag-to-move-component-in-react-f67d5c99f925
 */
export const DragMove = (props: DragMoveProps) => {
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
    console.log("drag!");
    onPointerDown?.(e);
  };

  const handlePointerUp = React.useCallback(
    (e: any) => {
      setIsDragging(false);
      console.log("done!");

      onPointerUp?.(e);
    },
    [onPointerUp]
  );

  const handlePointerMove = (e: any) => {
    if (isDragging) onDragMove(e);

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
