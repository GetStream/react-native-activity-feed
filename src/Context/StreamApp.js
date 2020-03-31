// @flow

import * as React from 'react';
import stream from 'getstream';

import StreamAnalytics from 'stream-analytics';
import type { StreamClient, StreamUser } from 'getstream';

import type { ErrorHandler } from '../types';
import Dayjs from 'dayjs';
import { FeedManager } from './Feed';
import type { FeedProps } from './Feed';
import { handleError } from '../errors';
import { Streami18n } from '../Streami18n';

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

export type Streami18Ctx = {|
  t: (msg: string, data?: Object) => string,
  tDateTimeParser: (input?: string | number) => Function,
|};

type StreamAppProps<UserData> = {
  /** The ID of your app, can be found on the [Stream dashboard](https://getstream.io/dashboard) */
  appId: string | number,
  /** The API key for your app, can be found on the [Stream dashboard](https://getstream.io/dashboard) */
  apiKey: string,
  /** The access token for the end user that uses your website, how to generate it can be found [here](https://getstream.io/docs/#frontend_setup) */
  token: string,
  /** Any options that [`stream.connect()`](https://getstream.io/docs/#setup) accepts */
  options?: {},
  /** The access token used for analytics requests */
  analyticsToken?: string,
  /** Normaly feed state is local to the feed component, such as FlatFeed and
   * NotificationFeed. This means that changes in one feed don't affect the
   * other. However in some cases you want the state to be shared in multiple
   * components. In the case of the NotificationDropdown you need state shared
   * between the NotificationFeed and the dropdown badge. This prop should be
   * used in those cases. Each element in the array provided to `sharedFeeds`
   * will create one globally managed feed. The default of this prop makes sure
   * that the NotificationDropdown works correctly. If you want need to change
   * some props on the NotificationDropdown, you should change them here
   * instead.
   */
  sharedFeeds: Array<FeedProps>,
  /** The data a user should get when no data is present in stream for this user yet */
  defaultUserData: UserData,
  /** A callback to handle errors produced by the components. This should
   * probably hook into your own notification system. */
  errorHandler: ErrorHandler,
  children?: React.Node,
  i18nInstance: Streami18n,
};

type StreamAppState<UserData> = {|
  ...AppCtx<UserData>,
  ...{|
    t?: (msg: string, data?: Object) => string,
    tDateTimeParser?: (input?: string | number) => Function,
  |},
|};

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
    if (this.props.analyticsToken) {
      analyticsClient = new StreamAnalytics({
        apiKey: this.props.apiKey,
        token: this.props.analyticsToken,
      });
      analyticsClient.setUser(client.userId);
    }
    for (const feedProps of this.props.sharedFeeds) {
      const manager = new FeedManager({
        ...feedProps,
        client: this.state.client,
        user: this.state.user,
        userData: this.state.userData,
        changedUserData: this.state.changedUserData,
        analyticsClient: this.state.analyticsClient,
        sharedFeedManagers: this.state.sharedFeedManagers,
        errorHandler: this.state.errorHandler,
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

  getUserInfo = async () => {
    try {
      await this.state.user.getOrCreate(this.props.defaultUserData);
    } catch (e) {
      this.props.errorHandler(e, 'get-user-info', {
        userId: this.state.user.id,
      });
      return;
    }
    this.state.changedUserData();
  };

  async componentDidMount() {
    this.getUserInfo();
    const { i18nInstance } = this.props;
    let streami18n;

    if (i18nInstance && i18nInstance instanceof Streami18n) {
      streami18n = i18nInstance;
    } else {
      streami18n = new Streami18n({ language: 'en' });
    }

    streami18n.registerSetLanguageCallback((t) => {
      this.setState({ t });
    });

    const { t, tDateTimeParser } = await streami18n.getTranslators();
    this.setState({ t, tDateTimeParser });
  }

  render() {
    if (!this.state.t) return null;

    const { t, tDateTimeParser, ...streamContextValue } = this.state;

    return (
      <StreamContext.Provider value={{ ...streamContextValue }}>
        <TranslationContext.Provider
          value={{
            t,
            tDateTimeParser,
          }}
        >
          {this.props.children}
        </TranslationContext.Provider>
      </StreamContext.Provider>
    );
  }
}

export const TranslationContext = React.createContext({
  t: (msg) => msg,
  tDateTimeParser: (input) => Dayjs(input),
});

export function withTranslationContext(
  OriginalComponent: React.ComponentType<any>,
) {
  const ContextAwareComponent = function ContextComponent(props: {}) {
    return (
      <TranslationContext.Consumer>
        {(translationContext) =>
          OriginalComponent && (
            <OriginalComponent {...translationContext} {...props} />
          )
        }
      </TranslationContext.Consumer>
    );
  };
  ContextAwareComponent.displayName =
    OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = ContextAwareComponent.displayName.replace(
    'Base',
    '',
  );

  return ContextAwareComponent;
}
