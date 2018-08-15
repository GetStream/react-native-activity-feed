// @flow
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import UploadImage from './UploadImage';
import { mergeStyles } from '../utils';
import { StreamContext } from '../Context';
import { buildStylesheet } from '../styles';

import type { StylesProps } from '../types';
import type { UserResponse } from 'getstream';

export type Props = {|
  source?: ?string | ((activeUser: UserResponse<Object>) => ?string),
  size?: number,
  editButton?: boolean,
  noShadow?: boolean,
  notRound?: boolean,

  onUploadButtonPress?: () => mixed,
  ...StylesProps,
|};

class Avatar extends React.Component {

  render = function() {
    let {
      source,
      size = 200,
      noShadow,
      notRound,
      editButton,
      onUploadButtonPress,
    } = this.props;
    let styles = buildStylesheet('avatar', this.props.styles || {});
    let borderRadius = notRound ? undefined : size / 2;

    return (
      <StreamContext.Consumer>
        {(appCtx) => {
          if (typeof source === 'function') {
            if (appCtx.user.full) {
              source = source(appCtx.user.full);
            } else {
              source = undefined;
            }
          }
          return (
            <View
              style={mergeStyles(
                'container',
                styles,
                this.props,
                noShadow ? styles.noShadow : null,
                {
                  width: size,
                  height: size,
                },
              )}
            >
              <Image
                style={mergeStyles('image', styles, this.props, {
                  width: size,
                  height: size,
                  borderRadius: borderRadius,
                })}
                source={
                  source
                    ? { uri: source }
                    : require('../images/placeholder.png')
                }
              />
              {editButton ? (
                <UploadImage onUploadButtonPress={onUploadButtonPress} />
              ) : null}
            </View>
          );
        }}
      </StreamContext.Consumer>
    );
  };
}
export default Avatar;
