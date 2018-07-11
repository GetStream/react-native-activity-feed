import React from 'react';
import {FlatList, View, TouchableOpacity} from 'react-native';

import Avatar from '../Avatar';

const LikesList = ({
  likes,
  onPressAvatar
}) => {
  return (
    <FlatList
      style={{padding: 12,paddingLeft: 15, paddingRight: 15, }}
      horizontal
      data={likes}
      keyExtractor={item => `${item.id}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={onPressAvatar}
          style={{ marginRight: 10 }}>
          <Avatar id={item.id} source="https://placehold.it/100x100" size={25} noShadow />
        </TouchableOpacity>
      )}
    />
  );
}

export default LikesList;