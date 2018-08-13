import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { mergeStyles } from '../utils';

const FollowButton = ({ followed, clicked, ...props }) => {
  return (
    <TouchableOpacity onClick={clicked}>
      <View
        colors={followed ? ['#ccc', '#ccc'] : ['#008DFF', '#0079FF']}
        style={mergeStyles('button', styles, props)}
      >
        <Text style={mergeStyles('buttonText', styles, props)}>
          {followed ? 'Following' : 'Follow'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    backgroundColor: '#007AFF',
    shadowRadius: 1,
  },
  buttonText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});

export default FollowButton;
