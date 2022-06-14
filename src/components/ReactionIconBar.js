//
import * as React from 'react';
import { View } from 'react-native';
import { buildStylesheet } from '../styles';

export default function ReactionIconBar(props) {
  const styles = buildStylesheet('reactionIconBar', props.styles);

  return <View style={styles.container}>{props.children}</View>;
}
