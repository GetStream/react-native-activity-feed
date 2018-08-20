import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

import { buildStylesheet } from '../styles';

import { UserBar, Card } from 'react-native-activity-feed';

export default class BaseActivity extends React.Component {
  _onPress = () => {
    if (this.props.clickable) {
      this.props.navigation.navigate('SinglePost', {
        activity: this.props.activity,
        userId: this.props.userId,
        feedGroup: this.props.feedGroup,
      });
    }
  };

  _onPressAvatar = () => {
    if (this.props.activity.actor !== 'NotFound') {
      return;
    }
    // TODO: go to profile
  };

  renderHeader = () => {
    let { time, actor } = this.props.activity;
    let notFound = {
      id: '!not-found',
      created_at: '',
      updated_at: '',
      data: { name: 'Unknown' },
    };
    if (actor === 'NotFound') {
      actor = notFound;
    }
    return (
      <View style={{ padding: 15 }}>
        <UserBar
          username={actor.data.name}
          avatar={actor.data.profileImage}
          subtitle={this.props.sub}
          timestamp={time}
          icon={this.props.icon}
          onPressAvatar={this._onPressAvatar}
        />
      </View>
    );
  };

  onPressMention = (text, activity) => {
    console.log(`pressed on ${text} mention of ${activity.id}`);
  };

  onPressHashtag = (text, activity) => {
    console.log(`pressed on ${text} hashtag of ${activity.id}`);
  };

  renderText = (text, activity) => {
    let tokens = text.split(' ');
    let rendered = [];
    let styles = buildStylesheet('defaultActivity', this.props.styles);

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
      } else {
        rendered.push(tokens[i] + ' ');
      }
    }
    return <Text>{rendered}</Text>;
  };

  renderContent = () => {
    const { width } = Dimensions.get('window');
    let { verb, object, content, image, attachments } = this.props.activity;
    return (
      <View>
        <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
          <Text>
            {typeof object === 'string'
              ? this.renderText(object, this.props.activity)
              : this.renderText(content, this.props.activity)}
          </Text>
        </View>

        {verb == 'repost' &&
          object instanceof Object && (
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <Card item={object.data} />
            </View>
          )}

        {image && (
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
              item={{
                title: attachments.og.title,
                description: attachments.og.description,
                image: attachments.og.images
                  ? attachments.og.images[0].image
                  : null,
                url: attachments.og.url,
              }}
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

    let styles = buildStylesheet('defaultActivity', this.props.styles);

    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this._onPress}
        disabled={!this.props.clickable}
      >
        {smartRender(Header, this.renderHeader)}
        {smartRender(Content, this.renderContent)}
        {smartRender(Footer, this.renderFooter)}
      </TouchableOpacity>
    );
  }
}

function smartRender(MaybeElement, fallback) {
  if (MaybeElement !== undefined) {
    if (!MaybeElement) {
      return null;
    }
    return React.isValidElement(MaybeElement) ? MaybeElement : <MaybeElement />;
  }
  return fallback && fallback();
}
