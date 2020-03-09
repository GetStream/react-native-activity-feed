// @flow
import React from 'react';

import FlatFeed from './FlatFeed';

import type { FeedRequestOptions } from 'getstream';
import type {
  NavigationScreen,
  BaseActivityResponse,
  BaseReaction,
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
  /** Override reaction add request */
  doReactionAddRequest?: (
    kind: string,
    activity: BaseActivityResponse,
    data?: {},
    options: {},
  ) => mixed,
  /** Override reaction delete request */
  doReactionDeleteRequest?: (id: string) => mixed,
  /** Override child reaction add request */
  doChildReactionAddRequest?: (
    kind: string,
    activity: BaseReaction,
    data?: {},
    options: {},
  ) => mixed,
  /** Override child reaction delete request */
  doChildReactionDeleteRequest?: (id: string) => mixed,
  /** Override reactions filter request */
  doReactionsFilterRequest?: (options: {}) => Promise<Object>,
  setListRef?: (ref: any) => any,
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
          doFeedRequest={(client, feedGroup, userId, options) =>
            client
              .feed(feedGroup, userId)
              .getActivityDetail(this.props.activity.id, options)
          }
          doReactionAddRequest={this.props.doReactionAddRequest}
          doReactionDeleteRequest={this.props.doReactionDeleteRequest}
          doChildReactionAddRequest={this.props.doChildReactionAddRequest}
          doChildReactionDeleteRequest={this.props.doChildReactionDeleteRequest}
          doReactionsFilterRequest={this.props.doReactionsFilterRequest}
          Footer={this.props.Footer}
          setListRef={this.props.setListRef}
          noPagination
        />
      </React.Fragment>
    );
  }
}
