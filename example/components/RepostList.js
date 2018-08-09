// @flow
import React from 'react';
import { View } from 'react-native';

import RepostItem from './RepostItem';
import SectionHeader from './SectionHeader';

import { goToProfile } from '../utils';
import type { ReactionMap } from '../types';

type Props = {
  reactions: ?ReactionMap,
  reactionKind?: string,
};

const RepostList = ({ reactions, reactionKind }: Props) => {
  if (!reactions) {
    return null;
  }

  if (!reactionKind) {
    reactionKind = 'repost';
  }

  let reposts = reactions[reactionKind] || [];
  if (!reposts.length) {
    return null;
  }

  return (
    <React.Fragment>
      <SectionHeader>Reposts</SectionHeader>

      <View>
        {reposts.map((item) => {
          return (
            <RepostItem
              key={item.id}
              repost={item}
              onAvatarPress={goToProfile}
            />
          );
        })}
      </View>
    </React.Fragment>
  );
};

export default RepostList;
