// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { ReactionCounts } from 'getstream';

type Props = {|
  icon: string,
  counts?: ReactionCounts,
  kind?: string,
  height?: number,
  width?: number,
  onPress?: (kind: ?string) => any,
|};

export default function ReactionIcon(props: Props) {
  let count = null;
  if (props.counts && props.kind) {
    count = props.counts[props.kind];
  }
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image
        source={props.icon}
        style={[
          styles.controlImage,
          { width: props.width, height: props.height },
        ]}
      />
      {count != null ? <Text style={styles.text}>{count}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 12,
  },
  controlImage: {
    height: 24,
    width: 24,
  },
  text: {
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '300',
    opacity: 0.8,
    fontSize: 14,
  },
});
