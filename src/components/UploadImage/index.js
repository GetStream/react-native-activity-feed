import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const UploadImage = ({onUploadButtonPress}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 5,
        opacity: 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      }}
    >
      <TouchableOpacity
        onPress={onUploadButtonPress}>
        <Image
          source={require('../../images/icons/pickphoto.png')}
          style={{ width: 35, height: 35 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UploadImage;
