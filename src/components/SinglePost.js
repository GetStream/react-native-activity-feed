// @flow
import React from 'react';

import { FlatFeed } from '..';

import type { FeedRequestOptions } from 'getstream';
import type {
  NavigationScreen,
  BaseActivityResponse,
  ReactComponentFunction,
  StyleSheetLike,
} from '../types';

type Props = {|
  activity: BaseActivityResponse,
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  analyticsLocation?: string,
  renderActivity: ReactComponentFunction,
  BelowPostComponent?: any,
  styles?: StyleSheetLike,
  navigation?: NavigationScreen,
|};

export default class SinglePost extends React.Component<Props> {
  render() {
    return (
      <FlatFeed
        feedGroup={this.props.feedGroup}
        userId={this.props.userId}
        options={{
          withRecentReactions: true,
          ...this.props.options,
        }}
        renderActivity={this.props.renderActivity}
        styles={this.props.styles}
        navigation={this.props.navigation}
        doFeedRequest={(session, feedGroup, userId, options) => {
          return session
            .feed(feedGroup, userId)
            .getActivityDetail(this.props.activity.id, options);
        }}
        BelowListComponent={this.props.BelowPostComponent}
        noPagination
      />
    );
  }
}
