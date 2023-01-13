import { config } from '@src/config/dev';
import * as Ably from 'ably';
import { ChannelPrefix } from '@common/pubsub/channels';

class Pubsub {
  private ably: Ably.Realtime;

  constructor() {
    this.ably = new Ably.Realtime(config.ably.apiKey);
  }

  private getChannel(channelPrefix: ChannelPrefix, userId: string) {
    return this.ably.channels.get(`${channelPrefix}/${userId}`);
  }

  publish<T>(channelPrefix: ChannelPrefix, userId: string, data: T) {
    this.getChannel(channelPrefix, userId).publish(data);
  }

  subscribe<T>(channelPrefix: ChannelPrefix, userId: string, cb: (payload: { data: T }) => void) {
    const channel = this.getChannel(channelPrefix, userId);
    channel.subscribe(cb);

    return () => channel.unsubscribe();
  }
}

export const pubsub = new Pubsub();
