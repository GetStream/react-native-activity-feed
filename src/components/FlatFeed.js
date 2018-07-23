// @flow
import React from 'react';
import { ScrollView, FlatList } from 'react-native';
import immutable from 'immutable';

import Activity from './Activity';
import type { AppCtx } from '~/Context';
import type { ActivityData, Feed, NavigationProps } from '~/types';

type Props = {
  feedGroup: string,
  userId?: string,
} & AppCtx &
  NavigationProps;

type State = {
  activityOrder: Array<string>,
  activities: any,
};

export default class FlatFeed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activityOrder: [],
      activities: immutable.Map(),
    };
  }

  _onItemPress = (item: ActivityData) => {
    this.props.navigation.navigate('SinglePost', { item: item });
  };

  _onAvatarPress = (id: string) => {
    console.log('user id: ', id);
  };

  _onReactionCounterPress = async (kind: string, activity: ActivityData) => {
    if (kind !== 'heart') {
      return;
    }
    let reaction = await this.props.session.react(kind, activity);
    this.setState((prevState) => {
      let activities = prevState.activities
        .updateIn([activity.id, 'reaction_counts', kind], (v) => v + 1)
        .updateIn(
          [activity.id, 'own_reactions', kind],
          (v) => (v ? v.push(reaction) : immutable.List([reaction])),
        );
      return { activities };
    });
  };

  async componentDidMount() {
    let feed: Feed = this.props.session.feed(
      this.props.feedGroup,
      this.props.userId,
    );
    let response = await feed.get({
      withReactionCounts: true,
      withOwnReactions: true,
    });

    let activityMap = response.results.reduce((map, a) => {
      map[a.id] = a;
      return map;
    }, {});
    this.setState({
      activityOrder: response.results.map((a) => a.id),
      activities: immutable.fromJS(activityMap),
    });
  }

  _renderActivity = ({ item }: { item: ActivityData }) => {
    return (
      <Activity
        activity={item}
        onItemPress={() => this._onItemPress(item)}
        onAvatarPress={() => this._onAvatarPress(item.id)}
        onReactionCounterPress={this._onReactionCounterPress}
        clickable
      />
    );
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
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
