// @flow
import * as React from 'react';
import { ScrollView, FlatList, RefreshControl, StyleSheet } from 'react-native';
import immutable from 'immutable';

import { StreamContext } from '../Context';
import { mergeStyles } from '../utils';
import type {
  NavigationProps,
  ChildrenProps,
  StylesProps,
  ReactElementCreator,
  BaseActivityResponse,
  BaseAppCtx,
} from '../types';
import type { FeedRequestOptions, StreamFeed } from 'getstream';

type Props = {|
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  ActivityComponent: ReactElementCreator,
  analyticsLocation?: string,
  ...NavigationProps,
  ...ChildrenProps,
  ...StylesProps,
|};

export default function FlatFeed(props: Props) {
  return (
    <StreamContext.Consumer>
      {(appCtx) => <FlatFeedInner {...props} {...appCtx} />}
    </StreamContext.Consumer>
  );
}

type PropsInner = {| ...Props, ...BaseAppCtx |};
type State = {
  activityOrder: Array<string>,
  activities: any,
  refreshing: boolean,
};

class FlatFeedInner extends React.Component<PropsInner, State> {
  constructor(props: PropsInner) {
    super(props);
    this.state = {
      activityOrder: [],
      activities: immutable.Map(),
      refreshing: false,
    };
  }

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
    options: { trackAnalytics?: boolean } = {},
  ) => {
    let reaction = await this.props.session.react(kind, activity);
    this._trackAnalytics(kind, activity, options.trackAnalytics);

    this.setState((prevState) => {
      let activities = prevState.activities
        .updateIn([activity.id, 'reaction_counts', kind], (v = 0) => v + 1)
        .setIn(
          [activity.id, 'own_reactions', kind],
          immutable.fromJS([reaction]),
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

    this.setState((prevState) => {
      let activities = prevState.activities
        .updateIn([activity.id, 'reaction_counts', kind], (v = 0) => v - 1)
        .updateIn([activity.id, 'own_reactions', kind], (v) => v.pop());
      return { activities };
    });
  };

  _onToggleReaction = async (
    kind: string,
    activity: BaseActivityResponse,
    options: { trackAnalytics?: boolean } = {},
  ) => {
    let currentReactions = this.state.activities.getIn(
      [activity.id, 'own_reactions', kind],
      immutable.List(),
    );

    if (currentReactions.size) {
      await this._onRemoveReaction(
        kind,
        activity,
        currentReactions.last().get('id'),
        options,
      );
    } else {
      this._onAddReaction(kind, activity, options);
    }
  };

  _refresh = async () => {
    this.setState({ refreshing: true });

    let feed: StreamFeed<{}, {}> = this.props.session.feed(
      this.props.feedGroup,
      this.props.userId,
    );
    let options: FeedRequestOptions = {
      withReactionCounts: true,
      withOwnReactions: true,
      withRecentReactions: true,
      ...this.props.options,
    };

    let response = await feed.get(options);

    let activityMap = response.results.reduce((map, a) => {
      map[a.id] = a;
      return map;
    }, {});

    this.setState({
      activityOrder: response.results.map((a) => a.id),
      activities: immutable.fromJS(activityMap),
      refreshing: false,
    });
  };

  async componentDidMount() {
    await this._refresh();
  }

  _renderActivity = ({ item }: { item: BaseActivityResponse }) => {
    let ActivityComponent = this.props.ActivityComponent;
    return (
      <ActivityComponent
        activity={item}
        onToggleReaction={this._onToggleReaction}
        onAddReaction={this._onAddReaction}
        onRemoveReaction={this._onRemoveReaction}
        navigation={this.props.navigation}
        clickable
      />
    );
  };

  render() {
    console.log(this.state.activities);
    return (

      <ScrollView
        style={mergeStyles('container', styles, this.props)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._refresh}
          />
        }
      >
        {this.props.children}
        <FlatList
          data={this.state.activityOrder.map((id) =>
            this.state.activities.get(id).toJS(),
          )}
          keyExtractor={(item) => item.id}
          renderItem={this._renderActivity}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
