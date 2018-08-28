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
  notificationFeed?: any,
|};

type StreamAppProps<UserData> = {|
  appId: string,
  apiKey: string,
  token: string,
  userId: string,
  options?: {},
  analyticsToken?: string,
  notificationFeed?: {
    feedGroup?: string,
    userId?: string,
  },
  defaultUserData: UserData,
  children?: React.Node,
|};

type StreamAppState<UserData> = AppCtx<UserData>;

export class StreamApp<UserData> extends React.Component<
  StreamAppProps<UserData>,
  StreamAppState<UserData>,
> {
  constructor(props: StreamAppProps<UserData>) {
    super(props);
    let client: StreamCloudClient<UserData> = stream.connectCloud(
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
    let notificationFeed;
    if (this.props.notificationFeed) {
      //$FlowFixMe
      notificationFeed = session.client.feed(
        this.props.notificationFeed.feedGroup || 'notification',
        this.props.notificationFeed.userId || this.props.userId,
        //$FlowFixMe
        this.props.token,
      );
    }

    //$FlowFixMe
    this.state = {
      session: session,
      user: session.user,
      userData: session.user.data,
      changedUserData: () => {
        this.setState({ userData: this.state.user.data });
      },
      notificationFeed: notificationFeed,
      notificationCounts: {
        unread: 0,
        unseen: 0,
      },
      changeNotificationCounts: (counts) => {
        //$FlowFixMe
        this.setState({ notificationCounts: counts });
      },
      analyticsClient: analyticsClient,
    };
  }

  async componentDidMount() {
    // TODO: Change this to an empty object by default
    // TODO: Maybe move this somewhere else
    await this.state.user.getOrCreate(this.props.defaultUserData);
    if (this.state.notificationFeed) {
      let results = await this.state.notificationFeed.get({ limit: 1 });
      //$FlowFixMe
      this.state.changeNotificationCounts({
        unread: results.unread,
        unseen: results.unseen,
      });
      //$FlowFixMe
      this.state.notificationFeed.subscribe;
    }
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
  refresh: () => Promise<mixed>,
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
  ) => Promise<FeedResponse<{}, {}>>,
  children: React.Node,
|};

type FeedState = {|
  activityOrder: Array<string>,
  activities: any,
  refreshing: boolean,
  lastResponse: ?FeedResponse<{}, {}>,
  realtimeAdds: Array<{}>,
  realtimeDeletes: Array<{}>,
  subscription: ?any,
|};

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
  state = {
    activityOrder: [],
    activities: immutable.Map(),
    lastResponse: null,
    refreshing: false,
    realtimeAdds: [],
    realtimeDeletes: [],
    subscription: null,
  };

  _trackAnalytics = (
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

  _onAddReaction = async (
    kind: string,
    activity: BaseActivityResponse,
    options: { trackAnalytics?: boolean } & ReactionRequestOptions<{}> = {},
  ) => {
    let reaction = await this.props.session.react(kind, activity, options);
    this._trackAnalytics(kind, activity, options.trackAnalytics);
    let enrichedReaction = immutable.fromJS({
      ...reaction,
      user: this.props.user.full,
    });

    return this.setState((prevState) => {
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

  _onRemoveReaction = async (
    kind: string,
    activity: BaseActivityResponse,
    id: string,
    options: { trackAnalytics?: boolean } = {},
  ) => {
    await this.props.session.reactions.delete(id);
    this._trackAnalytics('un' + kind, activity, options.trackAnalytics);

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

  _onToggleReaction = async (
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
      await this._onRemoveReaction(kind, activity, last.get('id'), options);
    } else {
      this._onAddReaction(kind, activity, options);
    }
  };

  _doFeedRequest = async (extraOptions?: FeedRequestOptions) => {
    let options: FeedRequestOptions = {
      withReactionCounts: true,
      withOwnReactions: true,
      ...this.props.options,
      ...extraOptions,
    };

    if (this.props.doFeedRequest) {
      return this.props.doFeedRequest(
        this.props.session,
        this.props.feedGroup,
        this.props.userId,
        options,
      );
    }
    return this._feed().get(options);
  };

  _feed = () => {
    return this.props.session.feed(this.props.feedGroup, this.props.userId);
  };

  _responseToActivityMap(response) {
    return immutable.fromJS(
      response.results.reduce((map, a) => {
        map[a.id] = a;
        return map;
      }, {}),
    );
  }

  _refresh = async () => {
    await this.setState({ refreshing: true });
    let response = await this._doFeedRequest();
    this.setState({
      realtimeAdds: [],
      realtimeDeletes: [],
    });

    return this.setState({
      activityOrder: response.results.map((a) => a.id),
      activities: this._responseToActivityMap(response),
      refreshing: false,
      lastResponse: response,
    });
  };

  async componentDidMount() {
    await this._refresh();
    await this._subscribe();
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
      await this._refresh();
    }
    if (sessionDifferent || feedDifferent || notifyDifferent) {
      this._unsubscribe(this.state.subscription);
      this._subscribe();
    }
  }

  async _subscribe() {
    if (this.props.notify) {
      let subscription = this._feed()
        .subscribe((data) => {
          this.setState((prevState) => {
            return {
              realtimeAdds: prevState.realtimeAdds.concat(data.new),
              realtimeDeletes: prevState.realtimeDeletes.concat(data.deleted),
            };
          });
        })
        .then(
          () => {
            console.log(
              `now listening to changes in realtime ${this.props.feedGroup}:${
                this.props.user.id
              }`,
            );
          },
          (err) => {
            console.error(err);
          },
        );
      this.setState({ subscription });
    }
  }

  async _unsubscribe(subscription) {
    if (!subscription) {
      return;
    }
    try {
      await subscription.cancel();
    } catch (err) {
      console.log(err);
    }
  }

  async componentWillUnmount() {
    await this._unsubscribe(this.state.subscription);
  }

  _loadNextPage = async () => {
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
    let response = await this._doFeedRequest(nextURL.query);
    return this.setState((prevState) => {
      let activities = prevState.activities.merge(
        this._responseToActivityMap(response),
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

  getCtx = () => ({
    onToggleReaction: this._onToggleReaction,
    onAddReaction: this._onAddReaction,
    onRemoveReaction: this._onRemoveReaction,
    refresh: this._refresh,
    loadNextPage: this._loadNextPage,
    feedGroup: this.props.feedGroup,
    userId: this.props.userId,
    activityOrder: this.state.activityOrder,
    activities: this.state.activities,
    realtimeAdds: this.state.realtimeAdds,
    realtimeDeletes: this.state.realtimeDeletes,
    refreshing: this.state.refreshing,
  });

  render() {
    return (
      <FeedContext.Provider value={this.getCtx()}>
        {this.props.children}
      </FeedContext.Provider>
    );
  }
}
