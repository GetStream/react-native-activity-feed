// @flow

import * as Stream from 'getstream/src/getstream-enrich';
import {StreamCollection, StreamFeed, StreamUser} from './Types';


export class StreamService {
  appId: string;
  apiKey: string;
  token: string;
  _userInfos: ?any;

  constructor(appId: string, apiKey: string, token: string) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.token = token;
  }

  get client() {
    return Stream.connect(this.apiKey, null, this.appId);
  }

  get reactions() {
    return this.client.reactions(this.token)
  }

  get userInfos() {
    if (!this._userInfos) {
      this._userInfos = this.client.collection(name, this.token);
    }
    return this._userInfos;
  }

  getUserInfo(userId: string) {
    return new StreamUser(this, userId);
  }

  getCollection(name: string) {
    return new StreamCollection(this, this.client.collection(name, this.token))
  }

  getFeed(feedSlug:string, userId:string) {
    return new StreamFeed(this, this.client.feed(feedSlug, userId, this.token));
  }

}
