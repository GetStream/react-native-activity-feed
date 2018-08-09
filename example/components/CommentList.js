// @flow
import React from 'react';
import { View } from 'react-native';

import CommentItem from './CommentItem';
import SectionHeader from './SectionHeader';

import type { ReactionMap } from '../types';

type Props = {
  reactions: ?ReactionMap,
  reactionKind?: string,
};

const CommentList = ({ reactions, reactionKind }: Props) => {
  if (!reactions) {
    return null;
  }

  if (!reactionKind) {
    reactionKind = 'comment';
  }

  let comments = reactions[reactionKind] || [];
  if (!comments.length) {
    return null;
  }

  return (
    <React.Fragment>
      <SectionHeader>Comments</SectionHeader>

      <View>
        {comments.map((item) => {
          return <CommentItem key={item.id} comment={item} />;
        })}
      </View>
    </React.Fragment>
  );
};

export default CommentList;
