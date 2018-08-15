import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { buildStylesheet } from '../styles';
import _ from 'lodash';

export default class OgBlock extends React.Component {
  render() {
    let styles = buildStylesheet('ogBlock', this.props.styles);

    return (
      <View style={styles.wrapper}>
        <View style={[styles.leftColumn]}>
          {this.props.og && this.props.og.images ? (
            <Image
              source={
                this.props.og.images[0].image
                  ? {
                      uri: this.props.og.images[0].image,
                    }
                  : require('../images/placeholder.png')
              }
              style={[styles.image]}
            />
          ) : null}
        </View>
        <View style={[styles.rightColumn]}>
          <Text style={styles.textStyle}>
            {_.truncate(this.props.og.title, { length: 75 })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => this.props.onPressDismiss(this.props.og.url)}
        >
          <Image
            source={require('../images/icons/close-black.png')}
            style={[styles.closeButton]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
