import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class IconBade extends React.Component {
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
        console.log(data);
        this.setState({ loaded: true, unread: data.unread });
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
