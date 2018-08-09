import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { mergeStyles } from '../utils'
import _ from 'lodash';

export default class OgBlock extends React.Component {
  render() {
    return (
      <View style={mergeStyles('wrapper', styles, this.props)}>
        <View style={[styles.leftColumn]}>
          { this.props.og && this.props.og.images ? (


            <Image
              source={ this.props.og.images[0].image ?  {
                uri:
                  this.props.og.images[0].image,
              } : require('../images/placeholder.png')}
              style={[styles.image]}
            />


          ) : null }
        </View>
        <View style={[styles.rightColumn]}>
            <Text
            style={mergeStyles('textStyle', styles, this.props)}>
              {_.truncate(this.props.og.title, { length: 75 })}
            </Text>
        </View>
        <TouchableOpacity
          onPress={() => this.props.onPressDismiss(this.props.og.url)}>
          <Image
            source={require('../images/icons/close-black.png')}
            style={[styles.closeButton]} />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  leftColumn: { position: 'relative' },
  rightColumn: { flex: 1, flexDirection: 'column', marginLeft: 8 },
  textStyle: { fontWeight: '700' },
  image: { width: 35, height: 35, borderRadius: 4, },
  closeButton: { width: 20, height: 20, }
});
