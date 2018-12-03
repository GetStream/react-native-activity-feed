// @flow

import * as React from 'react';
import stream from 'getstream';

import StreamAnalytics from 'stream-analytics';
import type { StreamClient, StreamUser } from 'getstream';

import type { ErrorHandler } from '../types';

import { FeedManager } from './Feed';
import type { FeedProps } from './Feed';
import { handleError } from '../errors';

export const StreamContext = React.createContext({
  changedUserData: () => {},
  sharedFeedManagers: {},
});

export type AppCtx<UserData> = {|
  client: StreamClient<UserData>,
  user: StreamUser<UserData>,
  // We cannot simply take userData from user.data, since the reference to user
  // will stay the same all the time. Because of this react won't notice that
  // the internal fields changed so it thinks it doesn't need to rerender.
  userData: ?UserData,
  changedUserData: () => void,
  changeNotificationCounts?: any,
  analyticsClient?: any,
  sharedFeedManagers: { [string]: FeedManager },
  errorHandler: ErrorHandler,
|};

type StreamAppProps<UserData> = {|
  /** The ID of your app, can be found on the [Stream dashboard](https://getstream.io/dashboard) */
  appId: string | number,
  /** The API key for your app, can be found on the [Stream dashboard](https://getstream.io/dashboard) */
  apiKey: string,
  /** The access token for the end user that uses your website, how to generate it can be found [here](https://getstream.io/docs/#frontend_setup) */
  token: string,
  /** Any options that [`stream.connect()`](https://getstream.io/docs/#setup) accepts */
  options?: {},
  analyticsToken?: string,
  sharedFeeds: Array<FeedProps>,
  defaultUserData: UserData,
  errorHandler: ErrorHandler,
  children?: React.Node,
|};

type StreamAppState<UserData> = AppCtx<UserData>;

/**
 * Manages the connection with Stream. Any components that should talk to
 * Stream should be a child of this component.
 */
export class StreamApp extends React.Component<
  StreamAppProps<Object>,
  StreamAppState<Object>,
> {
  static defaultProps = {
    sharedFeeds: [
      {
        feedGroup: 'notification',
        notify: true,
        options: { mark_seen: true },
      },
    ],
    defaultUserData: { name: 'Unknown' },
    errorHandler: handleError,
  };

  static Consumer = function StreamAppConsumer(props: {
    children?: (AppCtx<any>) => ?React.Element<any>,
  }) {
    return (
      <StreamContext.Consumer>
        {(appCtx) => {
          if (!props.children || !props.children.length) {
            return null;
          }
          if (!appCtx.client || !appCtx.user) {
            throw new Error(
              'This component should be a child of a StreamApp component',
            );
          }
          const Child = props.children;
          return Child(appCtx);
        }}
      </StreamContext.Consumer>
    );
  };

  constructor(props: StreamAppProps<Object>) {
    super(props);

    const client: StreamClient<Object> = stream.connect(
      this.props.apiKey,
      this.props.token,
      this.props.appId,
      this.props.options || {},
    );

    let analyticsClient;
    if (this.props.analyticsToken) {
      analyticsClient = new StreamAnalytics({
        apiKey: this.props.apiKey,
        token: this.props.analyticsToken,
      });
      analyticsClient.setUser(client.userId);
    }
    this.state = {
      client,
      user: client.currentUser,
      userData: client.currentUser.data,
      changedUserData: () => {
        this.setState({ userData: this.state.user.data });
      },
      analyticsClient,
      sharedFeedManagers: {},
      errorHandler: this.props.errorHandler,
    };
    for (const feedProps of this.props.sharedFeeds) {
      const manager = new FeedManager({
        ...feedProps,
        ...this.state,
      });
      this.state.sharedFeedManagers[manager.feed().id] = manager;
    }
  }

  componentDidUpdate(prevProps: StreamAppProps<Object>) {
    const appIdDifferent = this.props.appId !== prevProps.appId;
    if (appIdDifferent) {
      //TODO: Implement
    }
  }

  async componentDidMount() {
    try {
      await this.state.user.getOrCreate(this.props.defaultUserData);
    } catch (e) {
      this.props.errorHandler(e, 'get-user-info', {
        userId: this.state.user.id,
      });
      return;
    }
    this.state.changedUserData();
  }

  render() {
    return (
      <StreamContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </StreamContext.Provider>
    );
  }
}
