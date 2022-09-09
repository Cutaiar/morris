import React from "react";

// Types
import { Player } from "hooks/useGameState";

// Style
import { palette } from "theme";

// Components
import { RemainingMen, IconButton, IconButtonProps } from "components";
import { EditableName } from "./editableName";
import { Chip } from "./chip";
import { ToRemove } from "./ToRemove";

export type PlayerCardProps = React.PropsWithChildren<{
  /** Which player is this. undefined if not determined yet */
  player?: Player;
  /** Is the current turn a removal?*/
  remove?: boolean;
  /** Who's turn is it */
  turn: Player;
  /** Name of this player*/
  name: string;
  /** How many remaining men for this player?*/
  remainingMen?: number;
  /** Cb for when the player uses the card to change their name */
  onNameChange?: (newName: string) => void;
  /** any buttons which will be rendered in the playercard's toolbar */
  toolbarIcons?: IconButtonProps[];
  /** Is this playercard for a player whos hands are on the keyboard? */
  local?: boolean;
}>;

// TODO: This should somehow be aware of the current game type?
/** The number of remaining men that will be displayed when there is no remainingMen prop passed */
const defaultRemainingMenCount = 6;

/**
 * Represents a player in the game. `local` players may edit their profile.
 */
export const PlayerCard = (props: PlayerCardProps) => {
  const {
    player,
    remove,
    turn,
    name,
    remainingMen,
    onNameChange,
    toolbarIcons,
    local,
  } = props;

  const isMyTurn = player === turn;
  const isRemovalTurn = remove && isMyTurn;
  const nameColor = isMyTurn ? palette.neutralLight : palette.neutral;

  const [isEditing, setIsEditing] = React.useState(false);
  const [nameState, setNameState] = React.useState<string | undefined>(
    undefined
  );

  // If we start editing or name changes externally, sync it with out state
  React.useEffect(() => {
    setNameState(name);
  }, [name, isEditing]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "medium",
          gap: 10,
        }}
      >
        <EditableName
          name={nameState}
          onNameChange={setNameState}
          color={nameColor}
          editing={isEditing}
        />
        <Chip player={player} isMyTurn={isMyTurn} />
        {isRemovalTurn && <ToRemove />}
      </div>
      {/* TODO: Shimmer */}
      <RemainingMen
        remainingMenCount={remainingMen ?? defaultRemainingMenCount}
        player={player}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          width: "100%",
        }}
      >
        {toolbarIcons?.map((props) => (
          <IconButton {...props} />
        ))}
        {isEditing ? (
          <>
            <IconButton
              name="check"
              onClick={() => {
                nameState && onNameChange?.(nameState);
                setIsEditing(false);
              }}
              disabled={(nameState?.length ?? 0) === 0}
            />
            <IconButton
              name="x"
              onClick={() => {
                setNameState(name);
                setIsEditing(false);
              }}
            />
          </>
        ) : (
          local && (
            <IconButton
              name="edit"
              tooltip={
                player ? "You can't edit during a game" : "Edit your profile"
              }
              onClick={() => setIsEditing(true)}
              disabled={!!player} // Disallow edit while playing. Currently, this is when you have a player prop
            />
          )
        )}
      </div>
      {props.children}
    </>
  );
};
