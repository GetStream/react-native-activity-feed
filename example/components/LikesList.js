import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { Avatar } from 'react-native-activity-feed';

const LikesList = ({ likes, onAvatarPress }) => {
  return (
    <FlatList
      style={{ padding: 12, paddingLeft: 15, paddingRight: 15 }}
      horizontal
      data={likes}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onAvatarPress(item.id)}
          style={{ marginRight: 10 }}
        >
          <Avatar id={item.id} source={item.author.avatar} size={25} noShadow />
        </TouchableOpacity>
      )}
    />
  );
};

export default LikesList;
