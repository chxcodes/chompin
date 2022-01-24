import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!env.ABLY_API_KEY) throw new Error("Mis-configured key: ABLY_API_KEY");
  const client = new Ably.Realtime(env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "chompin",
  });
  res.status(200).json(tokenRequestData);
}
