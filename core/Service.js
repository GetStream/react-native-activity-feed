// @flow

import * as Stream from 'getstream/src/getstream-enrich';
import {StreamCollection, StreamFeed, StreamUser} from './Types';


export class StreamService {
  appId: string;
  apiKey: string;
  token: string;
  _client: ?any;

  constructor(appId: string, apiKey: string, token: string) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.token = token;
  }

  get client() {
    if (!this._client) {
      this._client = Stream.connect(this.apiKey, null, this.appId);
    }
    return this._client;
  }

  get reactions() {
    return this.client.reactions(this.token)
  }

  getUser(userId: string) {
    return new StreamUser(userId, this.getCollection("users"));
  }

  getCollection(name: string) {
    return new StreamCollection(this.client.collection(name, this.token), this)
  }

  getFeed(feedSlug:string, userId:string) {
    return new StreamFeed(this.client.feed(feedSlug, userId, this.token), this);
  }

}
