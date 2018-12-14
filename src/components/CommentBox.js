// @flow
import React from 'react';
import { View, TextInput } from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Avatar from './Avatar';

import type { StyleSheetLike } from '../types';
import type { Props as AvatarProps } from './Avatar';
import { buildStylesheet } from '../styles';

type Props = {|
  /** Callback function called when the text is submitted */
  onSubmit: (string) => mixed,
  /** Height in pixels for the whole component */
  height?: number,
  /** Props used to render the Avatar component */
  avatarProps?: AvatarProps,
  /** Skips the Avatar component when provided */
  noAvatar?: boolean,
  /** Style changes to default */
  styles?: StyleSheetLike,
  /** Removes KeyboardAccessory. When disabling this keep in mind that the
   * input won't move with the keyboard anymore. */
  noKeyboardAccessory: boolean,
  /** Custom verticalOffset for the KeyboardAccessory if for some reason the
   * component is positioned wrongly when the keyboard opens. If the item is
   * positioned too high this should be a negative number, if it's positioned
   * too low it should be positive. One known case where this happens is when
   * using react-navigation with `tabBarPosition: 'bottom'`.  */
  verticalOffset: number,
  /** Any props the React Native TextInput accepts */
  textInputProps?: {},
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
    verticalOffset: 0,
    noKeyboardAccessory: false,
  };

  state = {
    text: '',
  };

  render() {
    let { noKeyboardAccessory, textInputProps } = this.props;

    let styles = buildStylesheet('commentBox', this.props.styles);
    let input = (
      <View style={styles.container}>
        {this.props.noAvatar || (
          <Avatar
            size={48}
            styles={styles.avatar}
            {...this.props.avatarProps}
          />
        )}
        <TextInput
          value={this.state.text}
          style={styles.textInput}
          underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({ text })}
          onSubmitEditing={async (event) => {
            this.setState({ text: '' });
            this.props.onSubmit(event.nativeEvent.text);
          }}
          placeholder="Your comment..."
          returnKeyType="send"
          {...textInputProps}
        />
      </View>
    );
    if (noKeyboardAccessory) {
      return input;
    }

    return (
      <React.Fragment>
        <View style={{ height: this.props.height }} />
        <KeyboardAccessory verticalOffset={this.props.verticalOffset}>
          {input}
        </KeyboardAccessory>
      </React.Fragment>
    );
  }
}
