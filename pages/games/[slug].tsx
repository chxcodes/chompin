import { mongoose } from "@typegoose/typegoose";
import type { NextPage, NextPageContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import GameBoard from "../../client/components/Game/GameBoard";
import { GameModel } from "../../models/Game";

const GamePage: NextPage = ({ game }) => {
  return (
    <div>
      <Head>
        <title>Always Chompin</title>
        <meta name="description" content="" />
      </Head>

      <main>
        <GameBoard game={game}></GameBoard>
      </main>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { slug } = context.query;
  console.log(slug);
  if (!slug) {
    // TODO: Validate slug
    // TODO: redirect
  }

  await mongoose.connect("mongodb://localhost:27017/chompin", {
    useUnifiedTopology: true,
  });

  try {
    const game = await GameModel.findOne({ slug }, { new: true });
    console.log(game);
    if (game) {
      return {
        props: {
          game: {
            words: [],
          },
        },
      };
    }
  } catch (err) {
    console.error(err);
  }
  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
};

export default GamePage;
