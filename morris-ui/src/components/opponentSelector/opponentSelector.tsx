import React from "react";
import styled from "styled-components";

// Theme
import { fontSizes, palette } from "theme";

// Components
import { Button, Chip, EditableName, IconButton } from "components";
import { FiPlus } from "react-icons/fi";

// Tabs
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "./custom-tabs-style.css";

import { AIID } from "morris-ai";
import { useKey } from "react-use";

export type OpponentType = "ai" | "local" | "online";

// Type system for decisions
type BaseDecision = {
  type: OpponentType;
};

type LocalOppID = string;

type AIDecision = BaseDecision & {
  type: "ai";
  ai: AIID;
};

type LocalDecision = BaseDecision & {
  type: "local";
  opponent: LocalOppID;
};

type OnlineDecision = BaseDecision & {
  type: "online";
};

/** Represents a decision made by the player regarding which opponent they would like to play */
export type Decision = AIDecision | LocalDecision | OnlineDecision;

// Maybe this can be the datatype we store on disc?
export type Opponent = {
  name: string;
  displayName?: string;
  type: Omit<OpponentType, "online">;
  chip: { color: string };
};

export interface OpponentSelectorProps {
  onDecision: (decision: Decision) => void;
}

const OpponentSelectorRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OpponentSelectorTitle = styled.h1`
  color: ${({theme}) => theme.palette.neutral};
  font-size: ${({theme}) => theme.fontSizes.large};
  margin: 0;
`;

export const OpponentSelector = (props: OpponentSelectorProps) => {
  const { onDecision } = props;

  const buttonStyle: React.CSSProperties = {marginBottom: 4}

  return (
    <OpponentSelectorRoot>
      <OpponentSelectorTitle>
        Choose an opponent
      </OpponentSelectorTitle>
        <Tabs>
          <TabList>
            <Tab>
              <IconButton name={"eye"} text={"AI"} />
            </Tab>
            <Tab>
              <IconButton name={"users"} text={"Local"} />
            </Tab>
            <Tab>
              <IconButton name={"wifi"} text={"Online"} />
            </Tab>
          </TabList>

          <TabPanel>
            <AIPanel onDecision={onDecision} />
          </TabPanel>
          <TabPanel>
            <LocalPanel onDecision={onDecision} />
          </TabPanel>
          <TabPanel>
            <OnlinePanel onDecision={onDecision} />
          </TabPanel>
        </Tabs>
    </OpponentSelectorRoot>
  );
};

interface MakesDecision {
  onDecision: (decision: Decision) => void;
}

const AIPanel: React.FC<MakesDecision> = (props) => {
  // TODO: These AI opponents should probably be stored somewhere else
  return (
    <OpponentList
      opponents={[
        { id: "rand", name: "Random", color: palette.secondary },
        { id: "smart", name: "Smart", color: palette.secondary },
        { id: "minimax", name: "Minimax", color: palette.secondary },
      ]}
      onSelectOpponent={(id) =>
        props.onDecision({ type: "ai", ai: id as AIID })
      }
    />
  );
};

const LocalPanel: React.FC<MakesDecision> = (props) => {
  // TODO: These should be in local storage, but we probably need a new context and system for this
  const fakeOpponents = [
    { name: "Opponent", id: "opponent", color: palette.secondary },
  ];
  const [opponents, setOpponents] =
    React.useState<OpponentListItemProps[]>(fakeOpponents);

  const onAddDone = (newOpp: OpponentListItemProps) => {
    setOpponents([newOpp, ...opponents]);
  };

  return (
    <OpponentList
      opponents={opponents}
      onSelectOpponent={(id) =>
        props.onDecision({ type: "local", opponent: id })
      }
      onAdd={onAddDone}
    />
  );
};

const OnlinePanelRoot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 24px;
`;

const OnlinePanel: React.FC<MakesDecision> = (props) => {
  return (
    <OnlinePanelRoot>
      <Button onClick={() => props.onDecision({ type: "online" })}>
        Connect
      </Button>
    </OnlinePanelRoot>
  );
};

interface OpponentListItemProps {
  id: string;
  name: string;
  color?: string;
  onClick?: () => void;
}

const ListItem = styled.li`
  list-style-type: none;
  margin-top: 8px;
`;

/**
 * A single item in the `OpponentList`.
 */
const OpponentListItem: React.FC<OpponentListItemProps> = (props) => {
  return (
    <ListItem>
      <IconButton onClick={props.onClick} fill text={props.name} End={() => <Chip color={props.color} />}/> 
    </ListItem>
  );
};

interface OpponentListProps {
  opponents: OpponentListItemProps[];
  onSelectOpponent: (id: string) => void;
  onAdd?: (newOpp: OpponentListItemProps) => void;
}

const OpponentListRoot = styled.ol`
  padding: 0;
  font-size: ${({theme}) => theme.fontSizes.large};
`;

/**
 * A list of opponents to play against. They could be local or AI.
 */
const OpponentList: React.FC<OpponentListProps> = (props) => {
  const { onAdd, opponents, onSelectOpponent } = props;
  return (
    <OpponentListRoot>
      {onAdd && <AddExperience onAdd={onAdd} />}
      {opponents.map((o, i) => (
        <OpponentListItem
          key={i}
          {...o}
          onClick={() => onSelectOpponent(o.id)}
        />
      ))}
    </OpponentListRoot>
  );
};

interface AddExperienceProps {
  onAdd: (newOpponent: OpponentListItemProps) => void;
}

const AddExperienceRoot = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  gap: 8px;
  color: ${({theme}) => theme.palette.neutralLight};
  font-size: ${({theme}) => theme.fontSizes.medium};
`;

/**
 * UI allowing user to add a new local player
 */
const AddExperience: React.FC<AddExperienceProps> = (props) => {
  const [adding, setAdding] = React.useState(false);
  const [nameState, setNameState] = React.useState("");

  const onAcceptName = (name?: string) => {
    name &&
      props.onAdd({
        id: name,
        name,
        color: palette.secondary,
      });
    setAdding(false);
    setNameState("");
  };

  useKey("Enter", () => adding && onAcceptName(nameState), undefined, [
    nameState,
    adding,
  ]);

  return adding ? (
    <AddExperienceRoot>
      <EditableName
        name={nameState}
        onNameChange={setNameState} 
        editing={true}
        fill
      />
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
            setNameState("");
            setAdding(false);
          }}
        />
      </>
    </AddExperienceRoot>
  ) : (
    <ListItem onClick={() => setAdding(true)}>
      <IconButton fill text="Add a player" End={() => <FiPlus />}/>
    </ListItem>
  );
};
