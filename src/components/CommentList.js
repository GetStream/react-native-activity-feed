// @flow
import React from 'react';

import SectionHeader from './SectionHeader';
import CommentItem from './CommentItem';
import ReactionList from './ReactionList';
import { smartRender } from '../utils';

import type { Renderable, Comment } from '../types';

export type Props = {|
  /** The ID of the activity for which these comments are */
  activityId: string,
  /** The component that should render the comment */
  CommentItem: Renderable,
  /** Only needed for reposted activities where you want to show the comments of the original activity, not of the repost */
  activityPath?: ?Array<string>,
  /** If the CommentList should paginate when scrolling, by default it shows a "Load more" button  */
  infiniteScroll: boolean,
|};

/**
 * CommentList uses ReactionList under the hood to render a list of comments.
 *
 * @example ./examples/CommentList.md
 */
export default class CommentList extends React.PureComponent<Props> {
  static defaultProps = {
    CommentItem,
  };

  _Reaction = ({ reaction }: { reaction: Comment }) =>
    smartRender(this.props.CommentItem, { comment: reaction });
  render() {
    const { activityId, activityPath, infiniteScroll } = this.props;
    return (
      <ReactionList
        activityId={activityId}
        reactionKind={'comment'}
        Reaction={this._Reaction}
        activityPath={activityPath}
        infiniteScroll={infiniteScroll}
      >
        <SectionHeader>Comments</SectionHeader>
      </ReactionList>
    );
  }
}
