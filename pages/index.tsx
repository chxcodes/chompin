import type { NextPage } from "next";
import Head from "next/head";
import ShortUniqueId from "short-unique-id";

import { withSessionSsr } from "../server/sessions/withSession";
import { mongoose } from "@typegoose/typegoose";
import { User, UserModel } from "../models/User";
import { Group, GroupModel } from "../models/Group";
import { useCallback } from "react";
import { GroupSummaryCard } from "../client/components/GroupSummaryCard";
import { styled } from "@stitches/react";

const API_URL = "http://localhost:3000/api";
const getUid = new ShortUniqueId({ length: 10 });

const GroupSummaries = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const Home: NextPage<{ user: User; groups: Group[] }> = ({ user, groups }) => {
  const handleCreateNewGame = useCallback(async () => {
    const gameSession = await fetch(`${API_URL}/games/new`);
  }, []);

  return (
    <div>
      <Head>
        <title>🐊 Chompin&apos;</title>
        <meta name="description" content="A word game with friends" />
      </Head>

      <main style={{ padding: 20 }}>
        <h1>My Chomps</h1>
        <GroupSummaries>
          {groups.map((group) => (
            <GroupSummaryCard key={group.id} group={group} />
          ))}
        </GroupSummaries>
        <button onClick={handleCreateNewGame}>Create new game</button>
      </main>
    </div>
  );
};

export const getServerSideProps = withSessionSsr(async (ctx) => {
  await mongoose.connect("mongodb://localhost:27017/chompin", {
    useUnifiedTopology: true,
  });
  const { session } = ctx.req;
  let user = await UserModel.findById(session.userId);
  if (!user) {
    user = await new UserModel().save();
    session.userId = user._id;
    await session.save();
  }

  const groups = await GroupModel.find({
    players: { $elemMatch: { user: user._id } },
  })
    .populate("players")
    .populate("activeGame")
    .populate("activeGame.players");

  await mongoose.disconnect();

  return {
    props: {
      user: user.toJSON(),
      groups: groups.map((group) => group.toJSON()),
    },
  };
});

export default Home;
