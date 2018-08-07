import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import UploadImage from './UploadImage';

const Avatar = ({
  source,
  size,
  noShadow,
  editButton,
  onUploadButtonPress,
}) => {
  return (
    <View
      style={[
        styles.userAvatarView,
        noShadow ? styles.noShadow : null,
        {
          width: size ? size : 200,
          height: size ? size : 200,
        },
      ]}
    >
      <Image
        style={[
          styles.userAvatar,
          {
            width: size ? size : 200,
            height: size ? size : 200,
            borderRadius: size / 2 ? size / 2 : 200 / 2,
          },
        ]}
        source={source ? { uri: source } : require('../images/placeholder.png')}
      />
      {editButton ? (
        <UploadImage onUploadButtonPress={onUploadButtonPress} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  userAvatar: {
    position: 'absolute',
  },
  userAvatarView: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noShadow: {
    shadowOpacity: 0,
  },
});

export default Avatar;
