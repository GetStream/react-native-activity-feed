// @flow
import * as React from 'react';
import { ScrollView, FlatList, RefreshControl } from 'react-native';
import immutable from 'immutable';

import Activity from './Activity';
import type { AppCtx } from '../Context';
import type {
  ActivityData,
  Feed,
  NavigationProps,
  ChildrenProps,
  ReactElementCreator,
} from '../types';
import type { FeedRequestOptions } from 'getstream';

type Props = {
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  ActivityComponent?: ReactElementCreator,
} & AppCtx &
  NavigationProps &
  ChildrenProps;

type State = {
  activityOrder: Array<string>,
  activities: any,
  refreshing: boolean,
};

export default class FlatFeed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activityOrder: [],
      activities: immutable.Map(),
      refreshing: false,
    };
  }

  _onItemPress = (item: ActivityData) => {
    this.props.navigation.navigate('SinglePost', { item: item });
  };

  _onAvatarPress = (id: string) => {
    console.log('user id: ', id);
  };

  _onAddReaction = async (kind: string, activity: ActivityData) => {
    let reaction = await this.props.session.react(kind, activity);

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
    activity: ActivityData,
    id: string,
  ) => {
    await this.props.session.reactions.delete(id);

    this.setState((prevState) => {
      let activities = prevState.activities
        .updateIn([activity.id, 'reaction_counts', kind], (v = 0) => v - 1)
        .updateIn([activity.id, 'own_reactions', kind], (v) => v.pop());
      return { activities };
    });
  };

  _onToggleReaction = async (kind: string, activity: ActivityData) => {
    let currentReactions = this.state.activities.getIn(
      [activity.id, 'own_reactions', kind],
      immutable.List(),
    );

    if (currentReactions.size) {
      await this._onRemoveReaction(
        kind,
        activity,
        currentReactions.last().get('id'),
      );
    } else {
      this._onAddReaction(kind, activity);
    }
  };

  _refresh = async () => {
    this.setState({ refreshing: true });

    let feed: Feed = this.props.session.feed(
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

  _renderActivity = ({ item }: { item: ActivityData }) => {
    let ActivityComponent = this.props.ActivityComponent || Activity;
    return (
      <ActivityComponent
        activity={item}
        onItemPress={() => this._onItemPress(item)}
        onAvatarPress={() => this._onAvatarPress(item.id)}
        onToggleReaction={this._onToggleReaction}
        onAddReaction={this._onAddReaction}
        onRemoveReaction={this._onRemoveReaction}
        clickable
      />
    );
  };

  render() {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
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
