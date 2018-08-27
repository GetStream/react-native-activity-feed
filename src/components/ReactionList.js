// @flow
import * as React from 'react';
import { FlatList } from 'react-native';
import { buildStylesheet } from '../styles';
import type {
  StyleSheetLike,
  BaseReactionMap,
  ReactComponentFunction,
} from '../types';

type Props = {|
  reactions: ?BaseReactionMap,
  reactionKind: string,
  renderReaction: ReactComponentFunction,
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
        renderItem={({ item }) => props.renderReaction(item)}
        {...props.flatListProps}
      />
    </React.Fragment>
  );
};

export default ReactionList;
