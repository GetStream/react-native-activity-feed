//@flow
import React from 'react';

import SectionHeader from './SectionHeader';
import CommentItem from './CommentItem';
import ReactionList from './ReactionList';
import LoadMoreButton from './LoadMoreButton';
import { smartRender } from '../utils';
import type { Renderable, Comment } from '../types';

export type Props = {|
  /** The ID of the activity for which these comments are */
  activityId: string,
  /** The component that should render the comment */
  CommentItem: Renderable,
  /** Only needed for reposted activities where you want to show the comments
   * of the original activity, not of the repost */
  activityPath?: ?Array<string>,
  /** The component that should render the reaction */
  LoadMoreButton: Renderable,
  /** If the CommentList should paginate when scrolling, by default it shows a
   * "Load more" button  */
  infiniteScroll: boolean,
  /** Show and load reactions starting with the oldest reaction first, instead
   * of the default where reactions are displayed and loaded most recent first.
   * */
  /** Any props the react native FlatList accepts */
  flatListProps?: {},
  /** Show and load reactions starting with the oldest reaction first, instead
   * of the default where reactions are displayed and loaded most recent first.
   * */
  oldestToNewest: boolean,
  /** Reverse the order the reactions are displayed in. */
  reverseOrder: boolean,
|};

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
export default class CommentList extends React.PureComponent<Props> {
  static defaultProps = {
    CommentItem,
    LoadMoreButton,
    infiniteScroll: false,
    oldestToNewest: false,
    reverseOrder: false,
  };

  _Reaction = ({ reaction }: { reaction: Comment }) =>
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
