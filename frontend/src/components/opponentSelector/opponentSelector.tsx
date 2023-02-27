import React from "react";

// Theme
import { fontSizes, palette } from "theme";

// Components
import { Button, Chip, EditableName, IconButton } from "components";
import { FiPlus } from "react-icons/fi";

import { AIID } from "morris-ai";

// Tabs
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "./custom-tabs-style.css";
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

export const OpponentSelector = (props: OpponentSelectorProps) => {
  const { onDecision } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h1 style={{ fontSize: "large", color: palette.neutral, margin: 0 }}>
        Choose an opponent
      </h1>
      <div style={{ display: "flex", gap: 20 }}>
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
      </div>
    </div>
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

const OnlinePanel: React.FC<MakesDecision> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: 24,
      }}
    >
      <Button onClick={() => props.onDecision({ type: "online" })}>
        Connect
      </Button>
    </div>
  );
};

interface OpponentListItemProps {
  id: string;
  name: string;
  color?: string;
  onClick?: () => void;
}

/**
 * A single item in the `OpponentList`.
 */
const OpponentListItem: React.FC<OpponentListItemProps> = (props) => {
  return (
    <li
      onClick={props.onClick}
      style={{
        borderRadius: 5,
        border: "1px solid white",
        listStyleType: "none",
        marginTop: 10,
        boxSizing: "border-box",
        padding: 5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p style={{ margin: 0 }}>{props.name}</p>
      <Chip color={props.color} />
    </li>
  );
};

interface OpponentListProps {
  opponents: OpponentListItemProps[];
  onSelectOpponent: (id: string) => void;
  onAdd?: (newOpp: OpponentListItemProps) => void;
}

/**
 * A list of opponents to play against. They could be local or AI.
 */
const OpponentList: React.FC<OpponentListProps> = (props) => {
  const { onAdd, opponents, onSelectOpponent } = props;
  return (
    <ol style={{ padding: 0, fontSize: fontSizes.large }}>
      {onAdd && <AddExperience onAdd={onAdd} />}
      {opponents.map((o, i) => (
        <OpponentListItem
          key={i}
          {...o}
          onClick={() => onSelectOpponent(o.id)}
        />
      ))}
    </ol>
  );
};

interface AddExperienceProps {
  onAdd: (newOpponent: OpponentListItemProps) => void;
}

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
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        width: "100%",
      }}
    >
      <EditableName
        name={nameState}
        onNameChange={setNameState}
        color={palette.neutralLight}
        editing={true}
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
    </div>
  ) : (
    <li
      onClick={() => setAdding(true)}
      style={{
        borderRadius: 5,
        border: "1px solid white",
        listStyleType: "none",
        marginTop: 10,
        boxSizing: "border-box",
        padding: 5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p style={{ margin: 0 }}>Add a player</p>
      <FiPlus />
    </li>
  );
};
