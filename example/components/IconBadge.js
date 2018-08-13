import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class IconBade extends React.Component {
  state = {};

  render() {
    const {
      mainElement,
      badgeElement,
      badgeStyle,
      mainStyle,
      hidden,
    } = this.props;

    return (
      <View style={[mainStyle || {}]}>
        {mainElement}
        {!hidden && (
          <View style={[styles.IconBadge, badgeStyle || {}]}>
            {badgeElement}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  IconBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 12,
    height: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
  },
});
