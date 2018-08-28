// @flow

import * as React from 'react';
import { View, Text, Image } from 'react-native';
import immutable from 'immutable';
import stream from 'getstream';
import URL from 'url-parse';
import _ from 'lodash';

import StreamAnalytics from 'stream-analytics';
import type {
  StreamCloudClient,
  StreamUser,
  StreamUserSession,
} from 'getstream';
import type {
  FeedRequestOptions,
  FeedResponse,
  ReactionRequestOptions,
} from 'getstream';
import type {
  BaseActivityResponse,
  BaseAppCtx,
  BaseUserSession,
  ToggleReactionCallbackFunction,
  AddReactionCallbackFunction,
  RemoveReactionCallbackFunction,
} from './types';

const emptySession = stream.connectCloud('', '').createUserSession('', '');

export const StreamContext = React.createContext({
  session: emptySession,
  user: emptySession.user,
  userData: undefined,
  changedUserData: () => {},
  sharedFeedManagers: {},
});

export type AppCtx<UserData> = {|
  session: StreamUserSession<UserData>,
  user: StreamUser<UserData>,
  // We cannot simply take userData from user.data, since the reference to user
  // will stay the same all the time. Because of this react won't notice that
  // the internal fields changed so it thinks it doesn't need to rerender.
  userData: ?UserData,
  changedUserData: () => void,
  changeNotificationCounts?: any,
  analyticsClient?: any,
  sharedFeedManagers: { [string]: FeedManager },
|};

type StreamAppProps<UserData> = {|
  appId: string,
  apiKey: string,
  token: string,
  userId: string,
  options?: {},
  analyticsToken?: string,
  sharedFeeds: Array<FeedProps>,
  defaultUserData: UserData,
  children?: React.Node,
|};

type StreamAppState<UserData> = AppCtx<UserData>;

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
  };
  constructor(props: StreamAppProps<Object>) {
    super(props);

    let client: StreamCloudClient<Object> = stream.connectCloud(
      this.props.apiKey,
      this.props.appId,
      this.props.options || {},
    );

    let session = client.createUserSession(this.props.userId, this.props.token);

    let analyticsClient;
    if (this.props.analyticsToken) {
      analyticsClient = new StreamAnalytics({
        apiKey: this.props.apiKey,
        token: this.props.analyticsToken,
      });
      analyticsClient.setUser(this.props.userId);
    }
    this.state = {
      session: session,
      user: session.user,
      userData: session.user.data,
      changedUserData: () => {
        this.setState({ userData: this.state.user.data });
      },
      analyticsClient: analyticsClient,
      sharedFeedManagers: {},
    };
    for (let feedProps of this.props.sharedFeeds) {
      let manager = new FeedManager({ ...feedProps, ...this.state }, () =>
        this.forceUpdate(),
      );
      this.state.sharedFeedManagers[manager.feed().id] = manager;
    }
  }

  async componentDidMount() {
    // TODO: Change this to an empty object by default
    // TODO: Maybe move this somewhere else
    await this.state.user.getOrCreate(this.props.defaultUserData);
    this.state.changedUserData();
  }

  render() {
    return (
      <StreamContext.Provider value={{ ...this.state }}>
        <View style={{ flex: 1 }}>
          {this.props.children || (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 200,
                  height: 200,
                  margin: 50,
                  overflow: 'hidden',
                }}
                resizeMode="cover"
                borderRadius={100}
              >
                <Image
                  source={{
                    uri:
                      'https://popculturalstudies.files.wordpress.com/2016/02/batman-66-6.gif',
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    overflow: 'hidden',
                  }}
                />
              </View>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>
                You are now connected to Stream
              </Text>
            </View>
          )}
        </View>
      </StreamContext.Provider>
    );
  }
}

export const FeedContext = React.createContext({});

export type FeedCtx = {|
  feedGroup: string,
  userId?: string,
  activityOrder: Array<string>,
  activities: any,
  unread: number,
  unseen: number,
  refresh: (extraOptions?: FeedRequestOptions) => Promise<mixed>,
  refreshUnreadUnseen: () => Promise<mixed>,
  loadNextPage: () => Promise<mixed>,
  refreshing: boolean,
  realtimeAdds: Array<{}>,
  realtimeDeletes: Array<{}>,
  onToggleReaction: ToggleReactionCallbackFunction,
  onAddReaction: AddReactionCallbackFunction,
  onRemoveReaction: RemoveReactionCallbackFunction,
|};

type FeedProps = {|
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  analyticsLocation?: string,
  notify?: boolean,
  //** the feed read hander (change only for advanced/complex use-cases) */
  doFeedRequest?: (
    session: BaseUserSession,
    feedGroup: string,
    userId?: string,
    options?: FeedRequestOptions,
  ) => Promise<FeedResponse<Object, Object>>,
  children: React.Node,
|};

type FeedManagerState = {|
  activityOrder: Array<string>,
  activities: any,
  refreshing: boolean,
  lastResponse: ?FeedResponse<{}, {}>,
  realtimeAdds: Array<{}>,
  realtimeDeletes: Array<{}>,
  subscription: ?any,
  unread: number,
  unseen: number,
|};

type FeedState = {|
  manager: FeedManager,
|};

class FeedManager {
  props: FeedInnerProps;
  state: FeedManagerState = {
    activityOrder: [],
    activities: immutable.Map(),
    lastResponse: null,
    refreshing: false,
    realtimeAdds: [],
    realtimeDeletes: [],
    subscription: null,
    unread: 0,
    unseen: 0,
  };

  triggerUpdate: () => mixed;
  constructor(props, triggerUpdate) {
    this.props = props;
    this.triggerUpdate = triggerUpdate;
  }

  setState = (changed) => {
    if (typeof changed === 'function') {
      changed = changed(this.state);
    }
    this.state = { ...this.state, ...changed };
    this.triggerUpdate();
  };

  trackAnalytics = (
    label: string,
    activity: BaseActivityResponse,
    track: ?boolean,
  ) => {
    let analyticsClient = this.props.analyticsClient;

    if (!track || !analyticsClient) {
      return;
    }

    let feed = this.props.session.feed(this.props.feedGroup, this.props.userId);

    analyticsClient.trackEngagement({
      label: label,
      feed_id: feed.id,
      content: {
        foreign_id: activity.foreign_id,
      },
      location: this.props.analyticsLocation,
    });
  };

  onAddReaction = async (
    kind: string,
    activity: BaseActivityResponse,
    options: { trackAnalytics?: boolean } & ReactionRequestOptions<{}> = {},
  ) => {
    let reaction = await this.props.session.react(kind, activity, options);
    this.trackAnalytics(kind, activity, options.trackAnalytics);
    let enrichedReaction = immutable.fromJS({
      ...reaction,
      user: this.props.user.full,
    });

    this.setState((prevState) => {
      let activities = prevState.activities
        .updateIn([activity.id, 'reaction_counts', kind], (v = 0) => v + 1)
        .updateIn(
          [activity.id, 'own_reactions', kind],
          (v = immutable.List()) => v.unshift(enrichedReaction),
        )
        .updateIn(
          [activity.id, 'latest_reactions', kind],
          (v = immutable.List()) => v.unshift(enrichedReaction),
        );

      return { activities };
    });
  };

  onRemoveReaction = async (
    kind: string,
    activity: BaseActivityResponse,
    id: string,
    options: { trackAnalytics?: boolean } = {},
  ) => {
    await this.props.session.reactions.delete(id);
    this.trackAnalytics('un' + kind, activity, options.trackAnalytics);

    return this.setState((prevState) => {
      let activities = prevState.activities
        .updateIn([activity.id, 'reaction_counts', kind], (v = 0) => v - 1)
        .updateIn(
          [activity.id, 'own_reactions', kind],
          (v = immutable.List()) =>
            v.remove(v.findIndex((r) => r.get('id') === id)),
        )
        .updateIn(
          [activity.id, 'latest_reactions', kind],
          (v = immutable.List()) =>
            v.remove(v.findIndex((r) => r.get('id') === id)),
        );
      return { activities };
    });
  };

  onToggleReaction = async (
    kind: string,
    activity: BaseActivityResponse,
    options: { trackAnalytics?: boolean } & ReactionRequestOptions<{}> = {},
  ) => {
    let currentReactions = this.state.activities.getIn(
      [activity.id, 'own_reactions', kind],
      immutable.List(),
    );

    let last = currentReactions.last();
    if (last) {
      await this.onRemoveReaction(kind, activity, last.get('id'), options);
    } else {
      this.onAddReaction(kind, activity, options);
    }
  };

  getOptions = (extraOptions?: FeedRequestOptions): FeedRequestOptions => ({
    withReactionCounts: true,
    withOwnReactions: true,
    ...this.props.options,
    ...extraOptions,
  });

  doFeedRequest = async (options: FeedRequestOptions) => {
    if (this.props.doFeedRequest) {
      return this.props.doFeedRequest(
        this.props.session,
        this.props.feedGroup,
        this.props.userId,
        options,
      );
    }
    return this.feed().get(options);
  };

  feed = () => {
    return this.props.session.feed(this.props.feedGroup, this.props.userId);
  };

  responseToActivityMap = (response) => {
    return immutable.fromJS(
      response.results.reduce((map, a) => {
        map[a.id] = a;
        return map;
      }, {}),
    );
  };

  refresh = async (extraOptions) => {
    let options = this.getOptions(extraOptions);

    await this.setState({ refreshing: true });
    let response = await this.doFeedRequest(options);
    let newState = {
      activityOrder: response.results.map((a) => a.id),
      activities: this.responseToActivityMap(response),
      refreshing: false,
      lastResponse: response,
      realtimeAdds: [],
      realtimeDeletes: [],
      unread: response.unread || 0,
      unseen: response.unseen || 0,
    };

    if (options.mark_seen === true) {
      newState.unseen = 0;
    }
    if (options.mark_read === true) {
      newState.unread = 0;
    }

    return this.setState(newState);
  };

  subscribe = async () => {
    if (this.props.notify) {
      await this.setState(({ subscription }) => {
        if (subscription) {
          return {};
        }
        subscription = this.feed()
          .subscribe((data) => {
            this.setState((prevState) => {
              let numActivityDiff = data.new.length - data.deleted.length;
              return {
                realtimeAdds: prevState.realtimeAdds.concat(data.new),
                realtimeDeletes: prevState.realtimeDeletes.concat(data.deleted),
                unread: prevState.unread + numActivityDiff,
                unseen: prevState.unseen + numActivityDiff,
              };
            });
          })
          .then(
            () => {
              console.log(
                `now listening to changes in realtime for ${this.feed().id}`,
              );
            },
            (err) => {
              console.error(err);
            },
          );
        return { subscription };
      });
    }
  };

  unsubscribe = async () => {
    let { subscription } = this.state;
    if (!subscription) {
      return;
    }
    try {
      await subscription.cancel();
      console.log(
        `stopped listening to changes in realtime for ${this.feed().id}`,
      );
    } catch (err) {
      console.log(err);
    }
  };

  loadNextPage = async () => {
    let lastResponse = this.state.lastResponse;
    if (!lastResponse || !lastResponse.next) {
      return;
    }
    let cancel = false;
    await this.setState((prevState) => {
      if (prevState.refreshing) {
        cancel = true;
        return {};
      }
      return { refreshing: true };
    });

    if (cancel) {
      return;
    }

    let nextURL = new URL(lastResponse.next, true);
    let options = this.getOptions(nextURL.query);

    let response = await this.doFeedRequest(options);
    return this.setState((prevState) => {
      let activities = prevState.activities.merge(
        this.responseToActivityMap(response),
      );
      return {
        activityOrder: prevState.activityOrder.concat(
          response.results.map((a) => a.id),
        ),
        activities: activities,
        refreshing: false,
        lastResponse: response,
      };
    });
  };

  refreshUnreadUnseen = async () => {
    let response = await this.doFeedRequest({ limit: 1 });
    return this.setState({
      unread: response.unread || 0,
      unseen: response.unseen || 0,
    });
  };
}

export class Feed extends React.Component<FeedProps, FeedState> {
  render() {
    return (
      <StreamContext.Consumer>
        {(appCtx: AppCtx<any>) => {
          return <FeedInner {...this.props} {...appCtx} />;
        }}
      </StreamContext.Consumer>
    );
  }
}

type FeedInnerProps = {| ...FeedProps, ...BaseAppCtx |};
class FeedInner extends React.Component<FeedInnerProps, FeedState> {
  constructor(props: FeedInnerProps) {
    super(props);
    let feedId = props.session.feed(props.feedGroup, props.userId).id;
    let manager = props.sharedFeedManagers[feedId];
    if (!manager) {
      manager = new FeedManager(props, () => this.forceUpdate());
    }

    this.state = {
      manager: manager,
    };
  }

  async componentDidMount() {
    await this.state.manager.subscribe();
  }

  async componentDidUpdate(prevProps) {
    let sessionDifferent = this.props.session !== prevProps.session;
    let notifyDifferent = this.props.notify != prevProps.notify;
    let feedDifferent =
      this.props.userId != prevProps.userId ||
      this.props.feedGroup != prevProps.feedGroup;
    let optionsDifferent = !_.isEqual(this.props.options, prevProps.options);
    let doFeedRequestDifferent =
      this.props.doFeedRequest !== this.props.doFeedRequest;

    if (
      sessionDifferent ||
      feedDifferent ||
      optionsDifferent ||
      doFeedRequestDifferent
    ) {
      await this.state.manager.refresh();
    }
    if (sessionDifferent || feedDifferent || notifyDifferent) {
      this.state.manager.unsubscribe();
      this.state.manager.subscribe();
    }
  }

  async componentWillUnmount() {
    await this.state.manager.unsubscribe();
  }

  getCtx = () => {
    let { manager } = this.state;
    let state = manager.state;
    return {
      onToggleReaction: manager.onToggleReaction,
      onAddReaction: manager.onAddReaction,
      onRemoveReaction: manager.onRemoveReaction,
      refresh: manager.refresh,
      refreshUnreadUnseen: manager.refreshUnreadUnseen,
      loadNextPage: manager.loadNextPage,
      feedGroup: this.props.feedGroup,
      userId: this.props.userId,
      activityOrder: state.activityOrder,
      activities: state.activities,
      realtimeAdds: state.realtimeAdds,
      realtimeDeletes: state.realtimeDeletes,
      refreshing: state.refreshing,
      unread: state.unread,
      unseen: state.unseen,
    };
  };

  render() {
    return (
      <FeedContext.Provider value={this.getCtx()}>
        {this.props.children}
      </FeedContext.Provider>
    );
  }
}
