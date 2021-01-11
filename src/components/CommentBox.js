//
import React from 'react';
import { View, TextInput } from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import PropTypes from 'prop-types';

import Avatar from './Avatar';

import { buildStylesheet } from '../styles';
import { withTranslationContext } from '../Context';

/**
 * Comment box with keyboard control, avatar and text input
 * All props are fulfilled automatically if used as a child element
 * of an activity.
 */
class CommentBox extends React.Component {
  static defaultProps = {
    styles: {},
    height: 80,
    verticalOffset: 25,
    noKeyboardAccessory: false,
  };

  state = {
    text: '',
  };

  postComment(event) {
    if (this.props.onSubmit !== undefined) {
      this.props.onSubmit(event.nativeEvent.text);
    } else {
      this.props.onAddReaction('comment', this.props.activity, {
        text: event.nativeEvent.text,
      });
    }
  }

  render() {
    const { noKeyboardAccessory, textInputProps, t } = this.props;

    const styles = buildStylesheet('commentBox', this.props.styles);
    const input = (
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
          underlineColorAndroid='transparent'
          onChangeText={(text) => this.setState({ text })}
          onSubmitEditing={(event) => {
            this.setState({ text: '' });
            this.postComment(event);
          }}
          placeholder={t('Start Typing...')}
          returnKeyType='send'
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

CommentBox.propTypes = {
  /** Callback function called when the text is submitted, by default it adds a
   * comment reaction to the provided activity */
  onSubmit: PropTypes.func,
  /** Height in pixels for the whole component */
  height: PropTypes.number,
  /** Props used to render the Avatar component */
  avatarProps: PropTypes.object,
  /** Skips the Avatar component when provided */
  noAvatar: PropTypes.bool,
  /** Style changes to default */
  styles: PropTypes.object,
  /** activity */
  // @todo: Fix it
  activity: PropTypes.object,
  /**
   * event callback handler fired when the enter button is pressed
   * @param {*} string
   * @param {*} ActivityData
   * @param {*} any
   */
  onAddReaction: PropTypes.func,
  /** Removes KeyboardAccessory. When disabling this keep in mind that the
   * input won't move with the keyboard anymore. */
  noKeyboardAccessory: PropTypes.bool,
  /** Custom verticalOffset for the KeyboardAccessory if for some reason the
   * component is positioned wrongly when the keyboard opens. If the item is
   * positioned too high this should be a negative number, if it's positioned
   * too low it should be positive. One known case where this happens is when
   * using react-navigation with `tabBarPosition: 'bottom'`.  */
  verticalOffset: PropTypes.number,
  /** Any props the React Native TextInput accepts */
  textInputProps: PropTypes.object,
};

export default withTranslationContext(CommentBox);
