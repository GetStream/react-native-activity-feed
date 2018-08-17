import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import { buildStylesheet } from '../styles';

export default class Button extends React.Component {
  render() {
    let { count, label, icon, on, onPress } = this.props;
    let styles = buildStylesheet('button', this.props.styles);
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image style={styles.image} source={on ? icon.on : icon.off} />
        <Text style={styles.text}>
          {count} {count !== 1 ? label.plural : label.single}
        </Text>
      </TouchableOpacity>
    );
  }
}
