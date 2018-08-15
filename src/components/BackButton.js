import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { buildStylesheet } from '../styles'

export default class BackButton extends React.Component {

  render() {
    let styles = buildStylesheet('backButton', this.props.styles);
    let { color, pressed } = this.props;

    if (color === 'blue') {
      return (
        <TouchableOpacity style={styles.backButton} onPress={pressed}>
          <Image
            source={require('../images/icons/backarrow-blue.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.backButton} onPress={pressed}>
          <Image
            source={require('../images/icons/backarrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
      );
    }
  };
}
