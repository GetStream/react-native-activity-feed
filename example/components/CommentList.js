// @flow
import React from 'react';

import CommentItem from './CommentItem';
import SectionHeader from './SectionHeader';
import { ReactionList } from 'expo-activity-feed';

import type { ReactionMap } from '../types';

type Props = {
  reactions: ?ReactionMap,
};

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
