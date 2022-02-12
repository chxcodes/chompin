import { mongoose } from "@typegoose/typegoose";
import { NextApiRequest, NextApiResponse } from "next";
import { GameModel } from "../../../models/Game";
import { GroupModel } from "../../../models/Group";
import { withSessionRoute } from "../../../server/sessions/withSession";
import { ObjectID } from "mongodb";

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

export default withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = req.session.userId;
    if (!userId) {
      // what do we do?
      res.status(400).json({ error: "could not find a user session" });
      return;
    }

    await mongoose.connect("mongodb://localhost:27017/chompin", {
      useUnifiedTopology: true,
    });

    const activeGame = await GameModel.create({
      players: [new ObjectID(userId)],
    });

    const group = await GroupModel.create({
      activeGame: activeGame._id,
      players: [
        {
          user: new ObjectID(userId),
          name: uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: " ",
            length: 2,
          }),
        },
      ],
    });

    res.status(200).json({
      ...group.toJSON(),
      activeGame: {
        ...activeGame.toJSON(),
      },
    });

    // await mongoose.disconnect();
  }
);
