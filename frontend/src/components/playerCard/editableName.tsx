import React from "react";

// Style
import { palette } from "../../theme";
import "./editableName.css";

// Hooks
import { useKeyPressEvent } from "react-use";

// Components
import { FiCheck, FiX } from "react-icons/fi";

interface EditableNameProps {
  /** The name to render */
  name: string;
  /** CB for when the user submits a name change */
  onNameChange?: (newName: string) => void;
  /** Text color of the name */
  color?: string;
}

/**
 * Renders an editable name
 */
export const EditableName = (props: EditableNameProps) => {
  const { name, onNameChange } = props;

  const color = props.color ?? palette.neutral;

  const [isEditing, setIsEditing] = React.useState(false);
  const [nameState, setNameState] = React.useState<string | undefined>(
    undefined
  );

  // Sync internal state with prop (and reset it when finished or starting editing)
  React.useEffect(() => setNameState(name), [name, isEditing]);

  // Represents the intention to change the name
  const handleSubmit = () => {
    nameState && onNameChange?.(nameState); // Fortunately, "" is falsy so this blocks empty name save too
    setIsEditing(false);
  };

  // Submit on enter
  useKeyPressEvent("Enter", handleSubmit);

  return isEditing ? (
    <>
      <input
        type={"text"}
        value={nameState}
        onChange={(e) => setNameState(e.target.value)}
        autoFocus
        size={nameState?.length}
        style={{
          color: color,
          fontSize: "larger",
          borderColor: palette.neutral,
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: "4px",
          background: palette.neutralDark,
        }}
      />
      {/* TODO: disabled={nameState.length === 0}, once these are action buttons */}
      <FiCheck color={palette.neutral} onClick={handleSubmit} />
      <FiX
        color={palette.neutral}
        onClick={() => {
          setNameState(undefined);
          setIsEditing(false);
        }}
      />
    </>
  ) : (
    <span
      onClick={() => {
        setIsEditing(true);
      }}
      style={{ color: color, fontSize: "larger" }}
      className={"name-display-span"}
    >
      {name}
    </span>
  );
};
