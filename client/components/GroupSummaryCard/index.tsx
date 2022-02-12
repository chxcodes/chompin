import { styled } from "@stitches/react";

const GroupSummaryContainer = styled("div", {
  border: "1px solid lightgray",
  padding: 10,
});

const GroupTitle = styled("h2", {});

export const GroupSummaryCard = ({ group }) => {
  console.log(group.players);
  return (
    <GroupSummaryContainer>
      <h2>
        {group.name ||
          group.players.map((player) => (
            <span key={player.id}>{player.name}</span>
          ))}
      </h2>
    </GroupSummaryContainer>
  );
};
