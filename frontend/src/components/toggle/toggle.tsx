/**
 * A simple toggle component
 */
export const Toggle = (props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        id={props.label}
        type={"checkbox"}
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <label style={{ fontSize: "medium" }} htmlFor={props.label}>
        {props.label}
      </label>
    </div>
  );
};
