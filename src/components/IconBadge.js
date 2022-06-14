//
import * as React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';

/**
 * A badge icon that notifies the user if a feed has new activities
 * @example ./examples/IconBadge.md
 */
export default class IconBadge extends React.Component {
  static defaultProps = {
    feedGroup: 'notification',
    showNumber: false,
  };

  render() {
    return (
      <Feed feedGroup={this.props.feedGroup} userId={this.props.userId} notify>
        <FeedContext.Consumer>
          {(feedCtx) => <IconBadgeInner {...this.props} {...feedCtx} />}
        </FeedContext.Consumer>
      </Feed>
    );
  }
}

IconBadge.propTypes = {
  feedGroup: PropTypes.string.isRequired,
  userId: PropTypes.string,
  styles: PropTypes.object,
  showNumber: PropTypes.number,
  hidden: PropTypes.bool,
};
class IconBadgeInner extends React.Component {
  async componentDidMount() {
    await this.props.refreshUnreadUnseen();
  }

  render() {
    const { children, showNumber, hidden } = this.props;

    const styles = buildStylesheet('iconBadge', this.props.styles);

    return (
      <View style={styles.container}>
        {children}
        {!hidden && this.props.unseen > 0 && (
          <View style={styles.icon}>
            <View style={styles.iconInner}>
              {showNumber && (
                <Text style={styles.text}>{this.props.unseen}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
}
