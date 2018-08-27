// @flow
import React from 'react';

import SectionHeader from './SectionHeader';
import { CommentItem, ReactionList } from 'expo-activity-feed';

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
