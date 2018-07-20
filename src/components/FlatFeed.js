// @flow
import React from 'react';
import { ScrollView, FlatList } from 'react-native';

import Activity from './Activity';
import type { AppCtx } from '~/Context';
import type { Activities, ActivityData, Feed, NavigationProps } from '~/types';

type Props = {
  feedGroup: string,
  userId?: string,
} & AppCtx &
  NavigationProps;

type State = {
  activities: Activities,
};

export default class FlatFeed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activities: [],
    };
  }

  _onItemPress = (item: ActivityData) => {
    this.props.navigation.navigate('SinglePost', { item: item });
  };

  _onAvatarPress = (id: string) => {
    console.log('user id: ', id);
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
    this.setState({ activities: response.results });
  }

  _renderActivity = ({ item }: { item: ActivityData }) => {
    return (
      <Activity
        activity={item}
        onItemPress={() => this._onItemPress(item)}
        onAvatarPress={() => this._onAvatarPress(item.id)}
        clickable
      />
    );
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={this.state.activities}
          keyExtractor={(item) => item.id}
          renderItem={this._renderActivity}
        />
      </ScrollView>
    );
  }
}
