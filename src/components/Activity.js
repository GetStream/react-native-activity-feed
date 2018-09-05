//@flow
import * as React from 'react';
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
import type { ActivityData, StyleSheetLike } from '../types';

type Props = {
  Header?: React.Element<any>,
  Content?: React.Element<any>,
  Footer?: React.Element<any>,
  onPress?: () => mixed,
  onPressAvatar?: () => mixed,
  sub?: string,
  icon?: string,
  activity: ActivityData,
  styles?: StyleSheetLike,
  imageWidth?: number,
};

/**
 * Renders feed activities
 * @example ./examples/Activity.md
 */
export default class Activity extends React.Component<Props> {
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
    let { time, actor } = this.props.activity;
    let notFound = {
      id: '!not-found',
      created_at: '',
      updated_at: '',
      data: { name: 'Unknown', profileImage: '' },
    };
    if (actor === 'NotFound') {
      actor = notFound;
    }
    let styles = buildStylesheet('activity', this.props.styles);

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

  onPressMention = (text: string, activity: ActivityData) => {
    console.log(`pressed on ${text} mention of ${activity.id}`);
  };

  onPressHashtag = (text: string, activity: ActivityData) => {
    console.log(`pressed on ${text} hashtag of ${activity.id}`);
  };

  getAndTrimUrl = (text: string, activity: ActivityData) => {
    if (
      activity.attachments &&
      activity.attachments.og &&
      Object.keys(activity.attachments.og).length > 0
    ) {
      let textWithoutUrl = _.replace(text, activity.attachments.og.url, ' ');
      return textWithoutUrl.split(' ');
    } else {
      return text.split(' ');
    }
  };

  renderText = (text: string, activity: ActivityData) => {
    let tokens = text.split(' ');
    let rendered = [];
    let styles = buildStylesheet('activity', this.props.styles);

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
        let url = activity.attachments.og.url;
        rendered.push(
          <Text key={i} onPress={() => Linking.openURL(url)} style={styles.url}>
            {tokens[i].slice(0, 20)}
            {tokens[i].length > 20 ? '...' : ''}{' '}
          </Text>,
        );
      } else {
        rendered.push(tokens[i] + ' ');
      }
    }
    return <Text>{rendered}</Text>;
  };

  renderContent = () => {
    // return null;
    const width = this.props.imageWidth
      ? this.props.imageWidth
      : Dimensions.get('window').width;
    let { verb, object, text, image, attachments } = this.props.activity;
    let styles = buildStylesheet('activity', this.props.styles);

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
            <Text>{text}</Text>
          </View>
        )}

        {verb == 'repost' &&
          object instanceof Object && <Card {...object.data} />}

        {Boolean(image) && (
          <Image
            style={{ width: width, height: width }}
            source={{ uri: image }}
          />
        )}

        {attachments &&
          attachments.images &&
          Boolean(attachments.images.length) && (
            <Image
              style={{ width: width, height: width }}
              source={{ uri: attachments.images[0] }}
            />
          )}

        {attachments &&
          attachments.og &&
          Object.keys(attachments.og).length > 0 && (
            <Card
              title={attachments.og.title}
              description={attachments.og.description}
              image={
                attachments.og.images ? attachments.og.images[0].image : null
              }
              url={attachments.og.url}
            />
          )}
      </View>
    );
  };

  renderFooter = () => {
    return null;
  };

  render() {
    let { Header, Content, Footer } = this.props;

    let styles = buildStylesheet('activity', this.props.styles);

    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this._getOnPress()}
        disabled={!this._getOnPress()}
      >
        {smartRender(Header, this.renderHeader)}
        {smartRender(Content, this.renderContent)}
        {smartRender(Footer, this.renderFooter)}
      </TouchableOpacity>
    );
  }
}

function smartRender(MaybeElement: any, fallback) {
  if (MaybeElement !== undefined) {
    if (!MaybeElement) {
      return null;
    }
    return React.isValidElement(MaybeElement) ? MaybeElement : <MaybeElement />;
  }
  return fallback && fallback();
}
