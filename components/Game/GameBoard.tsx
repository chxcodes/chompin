import { useCallback, useState } from "react";
import { useChannel } from "./useChannel";
import { useRouter } from "next/router";

export default function GameBoard() {
  const [words, setWords] = useState<string[]>([]);
  const [nextWord, setNextWord] = useState("");
  const router = useRouter();
  const [channel, ably] = useChannel(
    `chompin-${router.query.id}`,
    (message) => {
      setWords([...words, message.data]);
      console.log(message);
    }
  );
  const sendWord = useCallback(
    (evt) => {
      evt.preventDefault();
      channel.publish({ name: "new-word", data: nextWord });
      setNextWord("");
    },
    [channel, nextWord]
  );

  return (
    <div>
      <h1>Game board</h1>
      <form onSubmit={sendWord}>
        {words.map((word, idx) => (
          <span key={idx}>{word}</span>
        ))}
        <input
          type="text"
          value={nextWord}
          onChange={(evt) => setNextWord(evt.target.value)}
        />
        <button type="submit" disabled={!nextWord.length}>
          Send
        </button>
      </form>
    </div>
  );
}
