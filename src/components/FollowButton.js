import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { buildStylesheet } from '../styles';

const FollowButton = ({ followed, clicked, ...props }) => {
  let styles = buildStylesheet('followButton', props.styles);

  return (
    <TouchableOpacity onClick={clicked}>
      <View
        colors={followed ? ['#ccc', '#ccc'] : ['#008DFF', '#0079FF']}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {followed ? 'Following' : 'Follow'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FollowButton;
