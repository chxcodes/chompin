import { getModelForClass, prop } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";

export class User {
  readonly id!: string;
  // @prop({ type: () => Date, default: () => new Date() })
  // lastOnline!: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    toJSON: {
      versionKey: false,
      transform: (_doc: User, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        // ret.lastOnline = ret.lastOnline.toJSON();
        // console.log(ret.lastOnline);
        return ret;
      },
    },
  },
});
