import { Types } from "ably";
import Ably from "ably/promises";
import { useEffect } from "react";

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest" });

export function useChannel(
  channelName: string,
  callbackOnMessage: (message: Types.Message) => void
): [Types.RealtimeChannelPromise, Types.RealtimePromise] {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
