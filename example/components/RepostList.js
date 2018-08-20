// @flow
import React from 'react';
import { ReactionList } from 'expo-activity-feed';

import RepostItem from './RepostItem';
import SectionHeader from './SectionHeader';

import type { ReactionMap } from '../types';

type Props = {
  reactions: ?ReactionMap,
};

const RepostList = ({ reactions }: Props) => {
  return (
    <ReactionList
      reactions={reactions}
      reactionKind={'repost'}
      renderReaction={(reaction) => <RepostItem repost={reaction} />}
    >
      <SectionHeader>Reposts</SectionHeader>
    </ReactionList>
  );
};

export default RepostList;
