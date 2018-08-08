import React from 'react';
import { Image, View, Text } from 'react-native';
import _ from 'lodash';

export default class OgBlock extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }}>
          <Image
            source={{ uri: this.props.og.images[0].image }}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ width: '100%', height: 25 }}>
            <Text>{_.truncate(this.props.og.title, { length: 100 })}</Text>
          </View>
          <View style={{ width: '100%', height: 25 }}>
            <Text>
              {_.truncate(this.props.og.description, { length: 100 })}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
