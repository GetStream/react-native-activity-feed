import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Avatar = ({source ,size}) => {
  return (
    <View style={[styles.userAvatarView]}>
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
  }
});

export default Avatar