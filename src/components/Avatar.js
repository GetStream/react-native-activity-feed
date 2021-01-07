//
import React from 'react';
import { View, Image } from 'react-native';

import UploadImage from './UploadImage';
import { StreamApp } from '../Context';
import { buildStylesheet } from '../styles';

/**
 * A users' profile picture
 * @example ./examples/Avatar.md
 */
export default class Avatar extends React.Component {
  render() {
    const { source, ...props } = this.props;
    if (typeof source === 'function') {
      const funcSource = source;
      return (
        <StreamApp.Consumer>
          {(appCtx) => {
            let newSource;
            if (appCtx.user.full) {
              newSource = funcSource(appCtx.user.full);
            }
            return <AvatarInner {...props} source={newSource} />;
          }}
        </StreamApp.Consumer>
      );
    } else {
      return <AvatarInner {...props} source={source} />;
    }
  }
}

const AvatarInner = (props) => {
  const {
    source,
    size = 200,
    noShadow,
    notRound,
    editButton,
    onUploadButtonPress,
  } = props;
  const styles = buildStylesheet('avatar', props.styles || {});
  const borderRadius = notRound ? undefined : size / 2;
  return (
    <View
      style={[
        styles.container,
        noShadow ? styles.noShadow : null,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Image
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius,
          },
        ]}
        source={source ? { uri: source } : require('../images/placeholder.png')}
        resizeMethod='resize'
      />
      {editButton ? (
        <UploadImage onUploadButtonPress={onUploadButtonPress} />
      ) : null}
    </View>
  );
};
