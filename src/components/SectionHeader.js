// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import { buildStylesheet } from '../styles';
import type { StyleSheetLike } from '../types';

type Props = {
  children: React.Node,
  styles?: StyleSheetLike,
};

export default function SectionHeader(props: Props) {
  let styles = buildStylesheet('sectionHeader', props.styles);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.children}</Text>
    </View>
  );
}
