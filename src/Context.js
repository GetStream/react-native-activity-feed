// @flow

import * as React from 'react';
import stream from 'getstream/src/getstream-enrich';

const emptySession = stream.connect().createUserSession();

export const StreamContext = React.createContext({
  session: emptySession,
  user: emptySession.user,
});

type AppCtx = {
  session: stream.StreamUserSession,
  user: stream.StreamUser,
};

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
  options: ?{},
} & BaseReactProps;

export class StreamApp extends React.Component<StreamCredentialProps> {
  render() {
    let client = stream.connect(
      this.props.apiKey,
      null,
      this.props.appId,
      this.props.options || {},
    );

    let session = client.createUserSession(this.props.userId, this.props.token);
    let appCtx = {
      session: session,
      user: session.user,
    };

    return (
      <StreamContext.Provider value={appCtx}>
        {this.props.children}
      </StreamContext.Provider>
    );
  }

  static get Consumer() {
    return StreamContext.Consumer;
  }
}

export const StreamFeedContext = React.createContext();

type StreamFeedProps = {
  feedSlug: string,
  userId: ?string,
} & BaseReactProps;

export class StreamCurrentFeed extends React.Component<StreamFeedProps> {
  render() {
    return (
      <StreamContext.Consumer>
        {(appCtx: AppCtx) => {
          const currentFeed = appCtx.session.feed(
            this.props.feedSlug,
            this.props.userId,
          );
          return (
            <StreamFeedContext.Provider value={currentFeed}>
              {this.props.children}
            </StreamFeedContext.Provider>
          );
        }}
      </StreamContext.Consumer>
    );
  }

  static get Consumer() {
    return StreamFeedContext.Consumer;
  }
}
