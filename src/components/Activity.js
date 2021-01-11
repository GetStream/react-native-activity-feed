//
import * as React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { buildStylesheet } from '../styles';

import _ from 'lodash';

import UserBar from './UserBar';
import Card from './Card';

import { smartRender } from '../utils';

/**
 * Renders feed activities
 * @example ./examples/Activity.md
 */
export default class Activity extends React.Component {
  static propTypes = {
    Header: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    Content: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    Footer: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    // The component that displays the url preview
    Card: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    onPress: PropTypes.func,
    onPressAvatar: PropTypes.func,
    /**
     *
     * @param {*} text
     * @param {*} activity
     */
    onPressMention: PropTypes.func,
    /**
     *
     * @param {*} text
     * @param {*} activity
     */
    onPressHashtag: PropTypes.func,
    sub: PropTypes.string,
    icon: PropTypes.string,
    // @todo: Fix it
    activity: PropTypes.object,
    /** Width of an image that's displayed, by default this is
     * the width of the screen */
    imageWidth: PropTypes.number,
    /** Styling of the component */
    styles: PropTypes.object,
    /**
     * Handle errors in the render method in a custom way, by
     * default this component logs the error in the console
     *
     * @param {*} error
     * @param {*} info
     * @param {*} props
     */
    componentDidCatch: PropTypes.func,
  };

  static defaultProps = {
    Card,
  };
  componentDidCatch(error, info) {
    if (this.props.componentDidCatch) {
      this.props.componentDidCatch(error, info, this.props);
    } else {
      console.error(error);
      console.error('The following activity caused the previous error');
      console.error(this.props.activity);
    }
  }

  _getOnPress = () => {
    if (this.props.onPress) {
      return this.props.onPress;
    }
  };

  _getOnPressAvatar = () => {
    if (this.props.activity.actor !== 'NotFound' && this.props.onPressAvatar) {
      return this.props.onPressAvatar;
    }
  };

  renderHeader = () => {
    const { time, actor: activityActor } = this.props.activity;
    const notFound = {
      id: '!not-found',
      created_at: '',
      updated_at: '',
      data: { name: 'Unknown', profileImage: '' },
    };
    let actor;
    if (
      typeof activityActor === 'string' ||
      typeof activityActor.error === 'string'
    ) {
      actor = notFound;
    } else {
      //$FlowBug
      actor = activityActor;
    }

    const styles = buildStylesheet('activity', this.props.styles);

    return (
      <View style={styles.header}>
        <UserBar
          username={actor.data.name}
          avatar={actor.data.profileImage}
          subtitle={this.props.sub}
          timestamp={time}
          icon={this.props.icon}
          onPressAvatar={this._getOnPressAvatar()}
        />
      </View>
    );
  };

  onPressMention = (text, activity) => {
    if (this.props.onPressMention !== undefined) {
      this.props.onPressMention(text, activity);
      return;
    }
  };

  onPressHashtag = (text, activity) => {
    if (this.props.onPressHashtag !== undefined) {
      this.props.onPressHashtag(text, activity);
      return;
    }
  };

  getAndTrimUrl = (text, activity) => {
    if (
      activity.attachments &&
      activity.attachments.og &&
      Object.keys(activity.attachments.og).length > 0
    ) {
      const textWithoutUrl = _.replace(text, activity.attachments.og.url, ' ');
      return textWithoutUrl.split(' ');
    } else {
      return text.split(' ');
    }
  };

  renderText = (text, activity) => {
    const tokens = text.split(' ');
    const rendered = [];
    const styles = buildStylesheet('activity', this.props.styles);

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i][0] === '@') {
        rendered.push(
          <Text
            style={styles.mention}
            onPress={() => {
              this.onPressMention(tokens[i], activity);
            }}
            key={i}
          >
            {tokens[i]}{' '}
          </Text>,
        );
      } else if (tokens[i][0] === '#') {
        rendered.push(
          <Text
            style={styles.hashtag}
            onPress={() => {
              this.onPressHashtag(tokens[i], activity);
            }}
            key={i}
          >
            {tokens[i]}{' '}
          </Text>,
        );
      } else if (
        activity.attachments &&
        activity.attachments.og &&
        Object.keys(activity.attachments.og).length > 0 &&
        tokens[i] === activity.attachments.og.url
      ) {
        const url = activity.attachments.og.url;
        rendered.push(
          <Text key={i} onPress={() => Linking.openURL(url)} style={styles.url}>
            {tokens[i].slice(0, 20)}
            {tokens[i].length > 20 ? '...' : ''}{' '}
          </Text>,
        );
      } else {
        rendered.push(
          <Text key={i} style={styles.text}>
            {tokens[i] + ' '}
          </Text>,
        );
      }
    }
    return rendered;
  };

  renderContent = () => {
    // return null;
    const width =
      this.props.imageWidth != null
        ? this.props.imageWidth
        : Dimensions.get('window').width;
    const { object, image, attachments } = this.props.activity;
    let { text } = this.props.activity;
    const styles = buildStylesheet('activity', this.props.styles);
    const { Card } = this.props;
    if (text === undefined) {
      if (typeof object === 'string') {
        text = object;
      } else {
        text = '';
      }
    }
    text = text.trim();

    return (
      <View>
        {Boolean(text) && (
          <View style={styles.content}>
            <Text style={styles.text}>
              {this.renderText(text, this.props.activity)}
            </Text>
          </View>
        )}

        {Boolean(image) && (
          <Image
            style={{ width, height: width }}
            source={{ uri: image }}
            resizeMethod='resize'
          />
        )}

        {attachments && attachments.images && attachments.images.length > 0 && (
          <Image
            style={{ width, height: width }}
            source={{ uri: attachments.images[0] }}
            resizeMethod='resize'
          />
        )}
        {attachments &&
          attachments.og &&
          Object.keys(attachments.og).length > 0 &&
          smartRender(Card, {
            title: attachments.og.title,
            description: attachments.og.description,
            image:
              attachments.og.images && attachments.og.images.length > 0
                ? attachments.og.images[0].image
                : null,
            url: attachments.og.url,
            og: attachments.og,
          })}

        {}
      </View>
    );
  };

  renderFooter = () => null;

  render() {
    const { Header, Content, Footer } = this.props;

    const styles = buildStylesheet('activity', this.props.styles);

    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this._getOnPress()}
        disabled={!this._getOnPress()}
      >
        {smartRender(Header, {}, this.renderHeader)}
        {smartRender(Content, {}, this.renderContent)}
        {smartRender(Footer, {}, this.renderFooter)}
      </TouchableOpacity>
    );
  }
}
