// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  value?: number,
  icon: any,
  onPress?: () => any,
};

export default function ReactionCounter(props: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image
        source={props.icon.source}
        style={[
          styles.controlImage,
          { width: props.icon.width, height: props.icon.height },
        ]}
      />
      {props.value == null ? (
        <Text style={styles.text}>{props.value}</Text>
      ) : null}
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
