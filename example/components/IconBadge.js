import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class IconBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      unread: 0,
    };
  }

  componentDidMount() {
    this.props.session
      .feed('notification')
      .get({ limit: 1 })
      .then((data) => {
        this.setState({ loaded: true, unread: data.unread });
      });

    const user = this.props.session.client.feed(
      'notification',
      'batman',
      this.props.realtimeToken,
    );

    const callback = (data) => {
      this.setState((prevState) => ({
        unread: prevState.unread + data.new.length - data.deleted.length,
      }));
    };

    function successCallback() {
      console.log('now listening to changes in realtime');
    }

    function failCallback() {
      alert('something went wrong, check the console logs');
    }

    user.subscribe(callback).then(successCallback, failCallback);
  }

  _markAsRead() {
    this.setState({
      unread: 0,
    });
  }

  render() {
    const {
      mainElement,
      badgeStyle,
      mainStyle,
      showNumber,
      hidden,
    } = this.props;

    return (
      <View style={[mainStyle || {}]}>
        {mainElement}
        {!hidden &&
          this.state.unread > 0 &&
          this.state.loaded && (
            <View style={[styles.IconBadge, badgeStyle || {}]}>
              <View
                style={{
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  minWidth: 15,
                  height: 15,
                  paddingLeft: 3,
                  paddingRight: 3,
                  borderRadius: 20,
                }}
              >
                {showNumber && (
                  <Text style={{ fontSize: 10, color: '#fff' }}>
                    {this.state.unread}
                  </Text>
                )}
              </View>
            </View>
          )}
      </View>
    );
  }
}

// <IconBadge
//   feedGroup
//   realtimeToken
//   badgeNumbers
//   renderIcon
//   renderBadge />

const styles = StyleSheet.create({
  IconBadge: {
    position: 'absolute',
    top: -3,
    left: 12,
    alignSelf: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
  },
});
