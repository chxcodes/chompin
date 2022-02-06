import { useCallback, useState } from "react";
import { useChannel } from "./useChannel";
import { useRouter } from "next/router";
import AutosizeInput from "react-input-autosize";

import { styled } from "../../styles/stitches.config";

const Game = styled("div", {
  margin: "5vh 10vw",
});
const Form = styled("form", {
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
});

const StyledWord = styled("span", {
  border: "1px solid transparent",
  borderRadius: 4,
  padding: "3px 2px",
});

const PlayerName = styled("span", {
  border: "1px solid transparent",
  borderRadius: 4,
  padding: "3px 2px",
});

const WordEntry = styled("div", {
  display: "inline-flex",
  position: "relative",
});
const StyledInput = styled(AutosizeInput, {
  paddingRight: 55,
  "& input": {
    // background color is set in the component
    border: "1px solid transparent",
    borderRadius: 4,
    padding: "3px 5px",
  },
  "& input:focus-visible": {
    outlineColor: "inherit",
  },
  "& input::placeholder": {
    color: "inherit",
  },
});
const SendWordButton = styled("button", {
  position: "absolute",
  right: 0,
});

function getDispayColors(player: Player) {
  return {
    color: player.color,
    backgroundColor: `${player.color}10`,
    outlineColor: `${player.color}20`,
  };
}
function getInputColors(player: Player) {
  return {
    color: `${player.color}70`,
    backgroundColor: `${player.color}10`,
    outlineColor: `${player.color}20`,
  };
}

type Player = {
  name: string;
  color: string;
};

const players = [
  { name: "Chris", color: "#bf3f27" },
  { name: "Kevin", color: "#010b8b" },
  { name: "Noodles", color: "#ef7b4f" },
];

export default function GameBoard() {
  const [words, setWords] = useState<{ word: string; player: Player }[]>([]);
  const [nextWord, setNextWord] = useState("");
  const router = useRouter();
  const [channel, ably] = useChannel(
    `chompin-${router.query.id}`,
    (message) => {
      setWords([
        ...words,
        {
          word: message.data,
          player: players[words.length % players.length],
        },
      ]);
      console.log(message);
    }
  );
  const sendWord = useCallback(
    (evt) => {
      evt.preventDefault();
      channel.publish({ name: "new-word", data: nextWord.trim() });
      setNextWord("");
    },
    [channel, nextWord]
  );

  const prompt = "TODO: Randomly generate a prompt";
  const activePlayer = players[words.length % players.length];
  console.log(words.length % players.length, activePlayer);

  return (
    <Game>
      <h1>🐊 Chompin'</h1>
      <ul>
        {players.map((player) => (
          <PlayerName
            key={player.name}
            style={{
              ...getDispayColors(player),
            }}
          >
            {player.name}
          </PlayerName>
        ))}
      </ul>
      <p>{prompt}</p>
      <Form onSubmit={sendWord}>
        {words.map(({ word }, idx) => (
          <StyledWord
            key={idx}
            style={{
              ...getDispayColors(players[idx % players.length]),
            }}
          >
            {word}
          </StyledWord>
        ))}
        <WordEntry>
          <StyledInput
            type="text"
            value={nextWord}
            inputStyle={{
              ...getInputColors(activePlayer),
            }}
            placeholder={`${activePlayer.name}`}
            onChange={(evt) =>
              setNextWord(
                evt.target.value.replace(/[^a-zA-Z\-\"\'\.\,\?\!]+/g, "")
              )
            }
          />
          <SendWordButton type="submit" disabled={!nextWord.length}>
            Send
          </SendWordButton>
        </WordEntry>
      </Form>
    </Game>
  );
}
