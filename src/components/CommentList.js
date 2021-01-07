//
import React from 'react';

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
