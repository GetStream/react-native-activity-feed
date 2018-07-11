// @flow

import * as React from 'react';
import stream from 'getstream/src/getstream-enrich';

const StreamSessionContext = React.createContext(stream.connect().createUserSession());

type AppCtx = {
  session: stream.StreamUserSession,
  user: stream.StreamUser,
}

type ReactChildren = React.Element<*>;

type BaseReactProps = {
    children?: ReactChildren,
    className?: string,
};

type StreamCredentialProps = {
    appId: string,
    apiKey: string,
    token: string,
    userId: string,
} & BaseReactProps

export class StreamApp extends React.Component<StreamCredentialProps> {

  render() {
    let client = stream.connect(this.props.apiKey, null, this.props.appId)

    let session = client.createUserSession(this.props.userId, this.props.token)
    let appCtx = {
        session: session,
        user: session.user,
    }

    return (
      <StreamSessionContext.Provider value={appCtx}>
        {this.props.children}
      </StreamSessionContext.Provider>
    )
  }

  static get Consumer() {
    return StreamSessionContext.Consumer
  }
}

const StreamFeedContext = React.createContext();

type StreamFeedProps = {
    feedSlug: string,
    userId: ?string,
} & BaseReactProps


export class StreamCurrentFeed extends React.Component<StreamFeedProps> {

  render() {
    return (
      <StreamApp.Consumer>
        {appCtx => {
          const currentFeed = appCtx.session.feed(this.props.feedSlug, this.props.userId);
          return (
            <StreamFeedContext.Provider value={currentFeed}>
              {this.props.children}
            </StreamFeedContext.Provider>
            )
          }
        }
      </StreamApp.Consumer>
    )
  }

  static get Consumer() {
    return StreamFeedContext.Consumer
  }
}
