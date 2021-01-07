//
import React from 'react';

import FlatFeed from './FlatFeed';

/**
 * Shows the detail of a single activity
 * @example ./examples/SinglePost.md
 */
export default class SinglePost extends React.Component {
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
