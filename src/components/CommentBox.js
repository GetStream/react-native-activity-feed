// @flow
import React from 'react';
import { View, TextInput } from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Avatar from './Avatar';

import type { StyleSheetLike } from '../types';
import type { Props as AvatarProps } from './Avatar';
import { buildStylesheet } from '../styles';

type Props = {|
  /** callback function called when the text is submitted */
  onSubmit: (string) => mixed,
  /** height in pixels for the whole component */
  height?: number,
  /** props used to render the Avatar component */
  avatarProps?: AvatarProps,
  /** skips the Avatar component when provided */
  noAvatar?: boolean,
  /** style changes to default */
  styles?: StyleSheetLike,
  /** removes KeyboardAccessory if in FlatFeed */       
  isFlatFeed: boolean,
  /** styles placeholder */       
  placeholder: string,
  /** styles returnKeyType */       
  returnKeyType: string,
|};

type State = {|
  text: string,
|};

/**
 * Comment box with keyboard control, avatar and text input
 */
export default class CommentBox extends React.Component<Props, State> {
  static defaultProps = {
    styles: {},
    height: 80,
    isFlatFeed: false,
    placeholder: "Your comment...",
    returnKeyType: "send",
  };
  state = {
    text: '',
  };

  let {
      isFlatFeed,
      placeholder,
      returnKeyType,
    } = this.props;

  render() {
    let styles = buildStylesheet('commentBox', this.props.styles);

    return (
      <React.Fragment>
        <View style={{ height: this.props.height }} />

      { !isFlatFeed && <KeyboardAccessory> }
          <View style={styles.container}>
            {this.props.noAvatar || (
              <Avatar
                size={48}
                // $FlowFixMe
                styles={this.props.styles.avatar}
                {...this.props.avatarProps}
              />
            )}
            <TextInput
              value={this.state.text}
              style={styles.textInput}
              placeholder={placeholder}
              underlineColorAndroid="transparent"
              returnKeyType={returnKeyType}
              onChangeText={(text) => this.setState({ text })}
              onSubmitEditing={async (event) => {
                this.setState({ text: '' });
                this.props.onSubmit(event.nativeEvent.text);
              }}
            />
          </View>
        { !isFlatFeed && </KeyboardAccessory> }
      </React.Fragment>
    );
  }
}
