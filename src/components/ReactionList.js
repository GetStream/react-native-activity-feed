// @flow
import * as React from 'react';
import { FlatList } from 'react-native';
import { buildStylesheet } from '../styles';
import { smartRender } from '../utils';
import type { StyleSheetLike, BaseReactionMap, Renderable } from '../types';

type Props = {|
  reactions: ?BaseReactionMap,
  reactionKind: string,
  Reaction: Renderable,
  flatListProps?: {},
  children?: React.Node,
  styles?: StyleSheetLike,
|};

const ReactionList = ({ reactions, reactionKind, ...props }: Props) => {
  let styles = buildStylesheet('reactionList', props.styles);

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
        style={styles.container}
        data={reactionsOfKind}
        keyExtractor={(item, i) => item.id || '' + i}
        listKey={reactionKind}
        renderItem={({ item }) => smartRender(props.Reaction, item)}
        {...props.flatListProps}
      />
    </React.Fragment>
  );
};

export default ReactionList;
