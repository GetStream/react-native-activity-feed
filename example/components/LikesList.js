// @flow
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { Avatar } from 'react-native-activity-feed';
import SectionHeader from './SectionHeader';
import type { ReactionMap } from '../types';

type Props = {
  reactions: ?ReactionMap,
  reactionKind?: string,
};

const LikesList = ({ reactions, reactionKind }: Props) => {
  if (!reactions) {
    return null;
  }

  if (!reactionKind) {
    reactionKind = 'heart';
  }

  let likes = reactions[reactionKind] || [];
  if (!likes.length) {
    return null;
  }

  return (
    <React.Fragment>
      <SectionHeader>Likes</SectionHeader>
      <FlatList
        style={{ padding: 12, paddingLeft: 15, paddingRight: 15 }}
        horizontal
        data={likes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ marginRight: 10 }}>
            <Avatar source={item.user.data.profileImage} size={25} noShadow />
          </TouchableOpacity>
        )}
      />
    </React.Fragment>
  );
};

export default LikesList;
