//
import React from 'react';
import PropTypes from 'prop-types';

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

// We have duplicated FeedRequestOptionsPropTypeShape at multiple places in codebase
// We can't abstract it out since stylegudist doesn't work with imported types.
const FeedRequestOptionsPropTypeShape = {
  withReactionCounts: PropTypes.bool,
  withRecentReactions: PropTypes.bool,
  withOwnReactions: PropTypes.bool,
  reactions: PropTypes.shape({
    recent: PropTypes.bool,
    own: PropTypes.bool,
    counts: PropTypes.bool,
  }),
  limit: PropTypes.number,
  offset: PropTypes.number,
  id_lt: PropTypes.string,
  id_lte: PropTypes.string,
  id_gt: PropTypes.string,
  id_gte: PropTypes.string,
  ranking: PropTypes.string,
  mark_seen: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  mark_read: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  refresh: PropTypes.bool,
};

SinglePost.propTypes = {
  activity: PropTypes.object,
  feedGroup: PropTypes.string,
  userId: PropTypes.string,
  options: PropTypes.shape(FeedRequestOptionsPropTypeShape),
  analyticsLocation: PropTypes.string,
  Activity: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  Footer: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  styles: PropTypes.object,
  navigation: PropTypes.object,
  /**
   * Override reaction add request
   * @param {*} kind
   * @param {*} activity
   * @param {*} data
   * @param {*} options
   */
  doReactionAddRequest: PropTypes.func,
  /**
   * Override reaction delete request
   * @param {*} id
   */
  doReactionDeleteRequest: PropTypes.func,
  /**
   * Override child reaction add request
   * @param {*} kind
   * @param {*} activity
   * @param {*} data
   * @param {*} options
   */
  doChildReactionAddRequest: PropTypes.func,
  /**
   * Override child reaction delete request
   * @param {*} id
   */
  doChildReactionDeleteRequest: PropTypes.func,
  /**
   * Override reactions filter request
   * @param {*} options
   */
  doReactionsFilterRequest: PropTypes.func,
  /**
   * @param {*} ref
   */
  setListRef: PropTypes.func,
};
