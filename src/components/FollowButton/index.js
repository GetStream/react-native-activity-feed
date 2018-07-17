import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo';

const FollowButton = ({ followed, clicked }) => {
  return (
    <TouchableOpacity onClick={clicked}>
      <LinearGradient
        colors={followed ? ['#ccc', '#ccc'] : ['#008DFF', '#0079FF']}
        style={styles.buttonGradient}
      >
        <Text style={styles.buttonText}>
          {followed ? 'Following' : 'Follow'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonGradient: {
    borderRadius: 6,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  buttonText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});

export default FollowButton;
