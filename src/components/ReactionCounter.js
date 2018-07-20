// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  value: number,
  icon: string,
};

export default function ReactionCounter({ value, icon }: Props) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={icon} style={styles.controlImage} />
      <Text style={styles.text}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 12,
    marginRight: 40,
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
