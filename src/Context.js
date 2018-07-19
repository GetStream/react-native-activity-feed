// @flow

import * as React from 'react';
import stream from 'getstream/src/getstream-enrich';
import type { User, UserData, UserSession } from '~/types';
import type { StreamClient } from 'getstream';

const emptySession = stream.connect().createUserSession();

export const StreamContext = React.createContext({
  session: emptySession,
  user: emptySession.user,
  userData: undefined,
  changedUserData: () => {},
});

export type AppCtx = {
  session: UserSession,
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
    let client: StreamClient = stream.connect(
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

  async componentDidMount() {
    // TODO: Change this to an empty object by default
    // TODO: Maybe move this somewhere else
    await this.state.user.getOrCreate({
      name: 'Batman',
      url: 'batsignal.com',
      desc: 'Smart, violent and brutally tough solutions to crime.',
      profileImage:
        'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
      coverImage:
        'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
    });

    this.state.changedUserData();
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
  feedGroup: string,
  userId?: string,
} & BaseReactProps;

export class StreamCurrentFeed extends React.Component<StreamFeedProps> {
  render() {
    return (
      <StreamContext.Consumer>
        {(appCtx: AppCtx) => {
          const currentFeed = appCtx.session.feed(
            this.props.feedGroup,
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
