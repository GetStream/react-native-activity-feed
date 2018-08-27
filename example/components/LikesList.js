// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Avatar, ReactionList } from 'expo-activity-feed';
import SectionHeader from './SectionHeader';
import type { ReactionMap } from '../types';

type Props = {
  reactions: ?ReactionMap,
};

const LikesList = ({ reactions }: Props) => {
  return (
    <ReactionList
      style={{ padding: 12, paddingLeft: 15, paddingRight: 15 }}
      reactions={reactions}
      reactionKind={'like'}
      flatListProps={{ horizontal: true }}
      renderReaction={(reaction) => (
        <TouchableOpacity style={{ marginRight: 10 }}>
          <Avatar source={reaction.user.data.profileImage} size={25} noShadow />
        </TouchableOpacity>
      )}
    >
      <SectionHeader>Likes</SectionHeader>
    </ReactionList>
  );
};

export default LikesList;
