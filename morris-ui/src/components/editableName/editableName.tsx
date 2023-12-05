import React from "react";

// Style
import { fontSizes, palette } from "theme";
import "./editableName.css";

interface EditableNameProps {
  /** The name to render */
  name?: string;
  /** CB for when the user submits a name change */
  onNameChange?: (newName: string) => void;
  /** Text color of the name */
  color?: string;
  /** Is the name being edited? */
  editing?: boolean;
  /** Should the field fill its container? */
  fill?: boolean
  /** Additional style */
  style?: React.CSSProperties;
}

/**
 * Renders an editable name
 */
export const EditableName = (props: EditableNameProps) => {
  const { name, onNameChange, editing, fill, style } = props;

  const color = props.color ?? palette.neutral;

  const size = name?.length || 1;

  return editing ? (
    <>
      <input
        type={"text"}
        value={name}
        onChange={(e) => onNameChange?.(e.target.value)}
        size={size}
        style={{
          color: color,
          fontSize: fontSizes.large,
          borderColor: palette.neutral,
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: "4px",
          background: palette.surface,
          width: fill ? "100%" : undefined,
          ...style
        }}
      />
      {/* TODO: disabled={nameState.length === 0}, once these are action buttons */}
    </>
  ) : (
    <span
      style={{ color: color, fontSize: fontSizes.large }}
      className={`name-display-span${
        editing ? " name-display-span-editing" : ""
      }`}
    >
      {name}
    </span>
  );
};
