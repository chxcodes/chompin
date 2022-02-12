import {
  DocumentType,
  getModelForClass,
  isDocument,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { WhatIsIt as Types } from "@typegoose/typegoose/lib/internal/constants";
import { Game } from "./Game";
import { User } from "./User";

@modelOptions({ schemaOptions: { _id: false } })
export class Player {
  @prop({ type: () => String, required: true })
  name!: string;

  @prop({ ref: () => User, required: true })
  user!: Ref<User>;

  toJSON() {
    return {
      name: this.name,
      user: isDocument(this?.user)
        ? this?.user?._id.toString()
        : this?.user?.toString(),
    };
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class GameChannel {
  @prop({ type: () => String, required: true })
  type!: string;

  @prop({ ref: () => Game, required: true })
  activeGame!: Ref<Game>;

  @prop({ ref: () => Game, default: [] }, Types.ARRAY)
  gameHistory!: Ref<Game>[];

  toJSON() {
    return {
      type: this.type,
      activeGame: isDocument(this?.activeGame)
        ? this.activeGame?._id.toString()
        : this.activeGame?.toString(),
      gameHistory: this.gameHistory.map((game) => game.toJSON()),
    };
  }
}

export class Group {
  @prop({ type: () => [Player], required: true, default: [] }, Types.ARRAY)
  public players!: Player[];

  @prop({ type: () => [GameChannel], required: true, default: [] }, Types.ARRAY)
  gameChannels!: Ref<GameChannel>[];
}

export const GroupModel = getModelForClass(Group, {
  schemaOptions: {
    toJSON: {
      versionKey: false,
      transform: (doc: DocumentType<Group>) => {
        return {
          players: doc.players.map((p) => p.toJSON()),
          sessionId: doc._id.toHexString(),
          gameChannels: doc.gameChannels.map((gc) => gc.toJSON()),
        };
      },
    },
  },
});
