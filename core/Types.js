// @flow

import type {StreamService} from './Service';

export function StreamCollection(collection:any, service: StreamService) {
  collection.__service__ = service;
  return new Proxy(collection, {});
}

export function StreamFeed(feed:any, service: StreamService) {
  let handler = {
      get: (obj, prop) => {
        switch (prop) {
          case "get":
          case "getEnriched":
            return (options, callback) => {
              return new Promise(function(resolve, reject) {
                obj.getEnriched(options, callback).then(res => {
                  res['results'] = res['results'].map(i => new StreamActivity(i, obj));
                  resolve(res)
                }).catch(reason => {reject(reason)})
              });
            };
          default:
            return obj[prop];
        }
      },
  };
  feed.__service__ = service;
  return new Proxy(feed, handler);
}

export class StreamActivity {
  id: any;
  data: any;
  feed: StreamFeed;
  origin: any;

  constructor(data: any, feed: any) {
    this.data = data;
    this.id = data['id'] || '';
    this.feed = feed;
    this.origin = data['origin'] || [];
  }

  reaction(kind: string, data: any, callback:any) {
    return this.feed.__service__.client.reaction.add(this.id, kind, data, callback)
  }
}

export class StreamUser {
  id: string;
  userCollection: StreamCollection;

  constructor(id: string, userCollection: StreamCollection) {
    this.userCollection = userCollection;
    this.id = id;
  }
}
