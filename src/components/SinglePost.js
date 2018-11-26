// @flow
import React from 'react';

import { FlatFeed } from '..';

import type { FeedRequestOptions } from 'getstream';
import type {
  NavigationScreen,
  BaseActivityResponse,
  Renderable,
  StyleSheetLike,
} from '../types';

type Props = {|
  activity: BaseActivityResponse,
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  analyticsLocation?: string,
  Activity?: Renderable,
  Footer?: any,
  styles?: StyleSheetLike,
  navigation?: NavigationScreen,
|};

/**
 * Shows the detail of a single activity
 * @example ./examples/SinglePost.md
 */
export default class SinglePost extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <FlatFeed
          feedGroup={this.props.feedGroup}
          userId={this.props.userId}
          options={{
            withRecentReactions: true,
            ...this.props.options,
          }}
          Activity={this.props.Activity}
          styles={this.props.styles}
          navigation={this.props.navigation}
          doFeedRequest={(client, feedGroup, userId, options) => {
            return client
              .feed(feedGroup, userId)
              .getActivityDetail(this.props.activity.id, options);
          }}
          Footer={this.props.Footer}
          noPagination
        />
      </React.Fragment>
    );
  }
}
