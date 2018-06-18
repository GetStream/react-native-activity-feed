import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Avatar = ({source ,size, noShadow}) => {
  return (
    <View style={[styles.userAvatarView, noShadow ? styles.noShadow : null]}>
      <Image style={[styles.userAvatar, {width: size, height: size, borderRadius: size/2}]} source={{ uri: source }} />
    </View>
  );
}

const styles = StyleSheet.create({
  userAvatar: {
    shadowOffset: { width: 30, height: 30 }
  },
  userAvatarView: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5
  },
  noShadow: {
    shadowOpacity: 0,
  }
});

export default Avatar