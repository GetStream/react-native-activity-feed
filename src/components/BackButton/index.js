import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

const BackButton = ({ color, pressed }) => {
  if (color === 'blue') {
    return (
      <TouchableOpacity style={styles.backButton} onPress={pressed}>
        <Image
          source={require('../../images/icons/backarrow-blue.png')}
          style={styles.backArrow}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.backButton} onPress={pressed}>
        <Image
          source={require('../../images/icons/backarrow.png')}
          style={styles.backArrow}
        />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  backButton: { width: 50, paddingRight: 6, paddingTop: 6, paddingBottom: 6 },
  backArrow: { height: 22, width: 12 },
});

export default BackButton;
