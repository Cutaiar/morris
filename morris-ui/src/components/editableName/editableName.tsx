import styled from "styled-components";

interface EditableNameProps {
  /** The name to render */
  name?: string;
  /** CB for when the user submits a name change */
  onNameChange?: (newName: string) => void;
  /** Is the name being edited? */
  editing?: boolean;
  /** Should the field fill its container? */
  fill?: boolean;
}

/**
 * Renders an editable name
 */
export const EditableName = (props: EditableNameProps) => {
  const { name, onNameChange, editing, fill } = props;

  const size = name?.length || 1;

  // TODO: Address the little jump that happens when you start editing because Display has no border
  // TODO: disabled={nameState.length === 0}, once these are action buttons?
  return editing ? (
    <Input
      value={name}
      onChange={(e) => onNameChange?.(e.target.value)}
      size={size}
      {...props}
    />
  ) : (
    <Display>{name}</Display>
  );
};

const Display = styled.span`
  color: inherit;
  font-size: inherit;
  border: 1px solid transparent;
  transition: border 0.2s ease;
`;

const Input = styled.input.attrs({ type: "text" })<
  Pick<EditableNameProps, "fill">
>`
  color: inherit;
  font-size: inherit;
  border-color: ${({ theme }) => theme.palette.neutral};
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.surface};
  width: ${({ fill }) => fill && "100%"};
`;
