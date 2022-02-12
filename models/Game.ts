import {
  DocumentType,
  getModelForClass,
  isDocument,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { WhatIsIt as Types } from "@typegoose/typegoose/lib/internal/constants";
import { User } from "./User";

@modelOptions({ schemaOptions: { _id: false } })
export class Word {
  @prop({ type: () => String })
  word!: string;

  @prop({ ref: () => User })
  player!: Ref<User>;
}

export class Game {
  @prop({ ref: () => User, required: true, default: [] }, Types.ARRAY)
  public players!: Ref<User>[];

  @prop({ type: () => [Word], default: [] }, Types.ARRAY)
  public words?: Word[];
}

export const GameModel = getModelForClass(Game, {
  schemaOptions: {
    toJSON: {
      versionKey: false,
      transform: (doc: DocumentType<Game>) => {
        return {
          players: doc.players.map((p) => p?.toString()),
          gameId: doc._id.toHexString(),
          words: doc.words,
        };
      },
    },
  },
});
