// @flow

import * as React from 'react';
import stream from 'getstream/src/getstream-enrich';
import type { User, UserData } from '~/types';

const emptySession = stream.connect().createUserSession();

export const StreamContext = React.createContext({
  session: emptySession,
  user: emptySession.user,
  userData: undefined,
  changedUserData: () => {},
});

export type AppCtx = {
  session: stream.StreamUserSession,
  user: User,
  // We cannot simply take userData from user.data, since the reference to user
  // will stay the same all the time. Because of this react won't notice that
  // the internal fields changed so it thinks it doesn't need to rerender.
  userData: ?UserData,
  changedUserData: () => void,
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

type StreamAppState = AppCtx;

export class StreamApp extends React.Component<
  StreamCredentialProps,
  StreamAppState,
> {
  constructor(props: StreamCredentialProps) {
    super(props);
    let client = stream.connect(
      this.props.apiKey,
      null,
      this.props.appId,
      this.props.options || {},
    );

    let session = client.createUserSession(this.props.userId, this.props.token);
    this.state = {
      session: session,
      user: session.user,
      userData: session.user.data,
      changedUserData: () => {
        this.setState({ userData: this.state.user.data });
      },
    };
  }

  render() {
    return (
      <StreamContext.Provider value={{ ...this.state }}>
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
