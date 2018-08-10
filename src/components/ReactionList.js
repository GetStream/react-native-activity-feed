// @flow
import React from 'react';
import { FlatList } from 'react-native';
import type {
  ChildrenProps,
  StyleProps,
  BaseReactionMap,
  ReactComponentFunction,
} from '../types';

type Props = {|
  reactions: ?BaseReactionMap,
  reactionKind: string,
  renderReaction: ReactComponentFunction,
  flatListProps?: {},
  ...StyleProps,
  ...ChildrenProps,
|};

const ReactionList = ({ reactions, reactionKind, ...props }: Props) => {
  if (!reactions) {
    return null;
  }

  let reactionsOfKind = reactions[reactionKind] || [];
  if (!reactionsOfKind.length) {
    return null;
  }

  return (
    <React.Fragment>
      {props.children}
      <FlatList
        style={props.style}
        data={reactionsOfKind}
        keyExtractor={(item, i) => item.id || '' + i}
        listKey={reactionKind}
        renderItem={({ item }) => props.renderReaction(item)}
        {...props.flatListProps}
      />
    </React.Fragment>
  );
};

export default ReactionList;
