import { IncomingMessage } from "http";
import type { IronSession } from "iron-session/next";
import { SessionUser } from "../models/User";

declare module "iron-session" {
  interface IronSessionData {
    userId?: string;
  }
}
