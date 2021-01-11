//
import React from 'react';
import PropTypes from 'prop-types';

import SectionHeader from './SectionHeader';
import CommentItem from './CommentItem';
import ReactionList from './ReactionList';
import LoadMoreButton from './LoadMoreButton';
import { smartRender } from '../utils';

/**
 * CommentList uses ReactionList under the hood to render a list of comments.
 * To use this component in a `FlatFeed` you have to provide the following
 * props to `FlatFeed`:
 * ```
 * options={{withOwnReactions: true}}
 * ```
 *
 * @example ./examples/CommentList.md
 */
export default class CommentList extends React.PureComponent {
  static defaultProps = {
    CommentItem,
    LoadMoreButton,
    infiniteScroll: false,
    oldestToNewest: false,
    reverseOrder: false,
  };

  _Reaction = ({ reaction }) =>
    smartRender(this.props.CommentItem, { comment: reaction });
  render() {
    const {
      activityId,
      activityPath,
      infiniteScroll,
      oldestToNewest,
      reverseOrder,
      flatListProps,
      LoadMoreButton,
    } = this.props;
    return (
      <ReactionList
        activityId={activityId}
        reactionKind={'comment'}
        Reaction={this._Reaction}
        activityPath={activityPath}
        infiniteScroll={infiniteScroll}
        oldestToNewest={oldestToNewest}
        flatListProps={flatListProps}
        reverseOrder={reverseOrder}
        LoadMoreButton={LoadMoreButton}
      >
        <SectionHeader>Comments</SectionHeader>
      </ReactionList>
    );
  }
}

CommentList.propTypes = {
  /** The ID of the activity for which these comments are */
  activityId: PropTypes.string,
  /** The component that should render the comment */
  CommentItem: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /** Only needed for reposted activities where you want to show the comments
   * of the original activity, not of the repost */
  activityPath: PropTypes.arrayOf(PropTypes.string),
  /** UI The component that should render the reaction */
  LoadMoreButton: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /** If the CommentList should paginate when scrolling, by default it shows a
   * "Load more" button  */
  infiniteScroll: PropTypes.bool,
  /** Show and load reactions starting with the oldest reaction first, instead
   * of the default where reactions are displayed and loaded most recent first.
   * */
  /** Any props the react native FlatList accepts */
  flatListProps: PropTypes.object,
  /** Show and load reactions starting with the oldest reaction first, instead
   * of the default where reactions are displayed and loaded most recent first.
   * */
  oldestToNewest: PropTypes.bool,
  /** Reverse the order the reactions are displayed in. */
  reverseOrder: PropTypes.bool,
};
