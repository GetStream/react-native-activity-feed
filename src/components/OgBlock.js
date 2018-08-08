import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import _ from 'lodash';

export default class OgBlock extends React.Component {
  render() {
    return (
      <View style={[styles.wrapper, this.props.styles.wrapper]}>
        <View style={[styles.leftColumn, this.props.styles.leftColumn]}>
          { this.props.og && this.props.og.images ? (
            <TouchableOpacity
              onPress={this.props.removeOgBlock}>

            <Image
              source={ this.props.og.images[0].image ?  {
                uri:
                  this.props.og.images[0].image,
              } : require('../images/placeholder.png')}
              style={[styles.image, this.props.styles.image]}
            />
            <Image
              source={require('../images/icons/close-black.png')}
              style={[styles.closeButton, this.props.styles.closeButton]} />
            </TouchableOpacity>
          ) : null }
        </View>
        <View style={[styles.rightColumn, this.props.styles.rightColumn]}>
            <Text
              style={[styles.textStyle, this.props.styles.textStyle]}>
              {_.truncate(this.props.og.title, { length: 75 })}
            </Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  leftColumn: { position: 'relative' },
  rightColumn: { flex: 1, flexDirection: 'column', marginLeft: 8 },
  textStyle: { fontWeight: '700' },
  image: { width: 50, height: 50, borderRadius: 4, },
  closeButton: { width: 24, height: 24, position: 'absolute', top: -10, right: -10 }
});
