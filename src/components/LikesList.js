// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import Avatar from './Avatar';
import ReactionList from './ReactionList';
import SectionHeader from './SectionHeader';

import type { BaseReactionMap } from '../types';

type Props = {
  reactions: ?BaseReactionMap,
};

/**
 * A container for a list of likes
 * @example ./examples/LikesList.md
 */
const LikesList = ({ reactions }: Props) => {
  return (
    <ReactionList
      styles={{ container: { padding: 12, paddingLeft: 15, paddingRight: 15 } }}
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
