//
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { buildStylesheet } from '../styles';

/**
 * Back button
 * @example ./examples/BackButton.md
 */
export default class BackButton extends React.Component {
  static propTypes = {
    styles: PropTypes.object,
    blue: PropTypes.bool,
    pressed: PropTypes.func,
  };

  render() {
    const styles = buildStylesheet('backButton', this.props.styles);
    const { blue, pressed } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={pressed}>
        <Image
          source={
            blue
              ? require('../images/icons/backarrow-blue.png')
              : require('../images/icons/backarrow.png')
          }
          style={styles.backArrow}
        />
      </TouchableOpacity>
    );
  }
}
