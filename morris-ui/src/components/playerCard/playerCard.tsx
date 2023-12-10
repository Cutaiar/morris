import * as React from "react";
import styled, { DefaultTheme, useTheme } from "styled-components";

// Types
import { Player } from "hooks/useGameState";

// Components
import {
  RemainingMen,
  IconButton,
  IconButtonProps,
  Chip,
  EditableName
} from "components";
import { ToRemove } from "./ToRemove";

// Hooks
import { useKey } from "react-use";

import { getChipColor } from "utils";

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
    local
  } = props;

  const isMyTurn = player === turn;
  const isRemovalTurn = remove && isMyTurn;

  const [isEditing, setIsEditing] = React.useState(false);
  const [nameState, setNameState] = React.useState<string | undefined>(
    undefined
  );

  // If we start editing or name changes externally, sync it with out state
  React.useEffect(() => {
    setNameState(name);
  }, [name, isEditing]);

  const onAcceptName = (name?: string) => {
    name && onNameChange?.(name);
    setIsEditing(false);
  };

  useKey("Enter", () => isEditing && onAcceptName(nameState), undefined, [
    nameState,
    onNameChange,
    isEditing
  ]);

  const theme = useTheme();

  return (
    <>
      <Title isMyTurn={isMyTurn}>
        <EditableName
          name={nameState}
          onNameChange={setNameState}
          editing={isEditing}
        />
        <Chip color={getChipColor(theme, player)} emphasis={isMyTurn} />
        {isRemovalTurn && <ToRemove />}
      </Title>
      {/* TODO: Shimmer */}
      <RemainingMen
        remainingMenCount={remainingMen ?? defaultRemainingMenCount}
        player={player}
      />
      <Toolbar>
        {toolbarIcons?.map((props, i) => (
          <IconButton key={i} {...props} />
        ))}
        {isEditing ? (
          <>
            <IconButton
              name="check"
              onClick={() => {
                onAcceptName(nameState);
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
      </Toolbar>
      {props.children}
    </>
  );
};

const Toolbar = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const Title = styled.div<{ isMyTurn?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.large};
  gap: 10px;
  color: ${({ isMyTurn, theme }) =>
    isMyTurn ? theme.palette.neutralLight : theme.palette.neutral};
`;
