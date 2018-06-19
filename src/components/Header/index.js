import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Text, StyleSheet, View, Image, TouchableComponent } from 'react-native';

import BackButton from '../BackButton'

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.left}>
        <BackButton color="blue" />
      </View>
      <Text style={styles.heading}>{'Notifications'.toUpperCase()}</Text>
      <View style={styles.left}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    opacity: 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6
  },
  heading: {
    fontWeight: "600",
    fontSize: 13
  },
  left: {
    flex: 1
  }
});

export default Header;
