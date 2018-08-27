// @flow
import React from 'react';

import SectionHeader from './SectionHeader';
import CommentItem from './CommentItem';
import ReactionList from './ReactionList';

import type { BaseReactionMap } from '../types';

type Props = {
  reactions: BaseReactionMap,
};

/**
 * A container for a list of comments
 * @example ./examples/CommentList.md
 */
const CommentList = ({ reactions }: Props) => {
  return (
    <ReactionList
      reactions={reactions}
      reactionKind={'comment'}
      renderReaction={(reaction) => <CommentItem comment={reaction} />}
    >
      <SectionHeader>Comments</SectionHeader>
    </ReactionList>
  );
};

export default CommentList;
