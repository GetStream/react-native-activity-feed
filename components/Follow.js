// @flow

import * as React from 'react';
import {Image, View, Text, FlatList, SectionList, StyleSheet, RefreshControl} from 'react-native';
import {StreamCurrentFeed} from '../core/Context';


const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export const Direction = {
  IN: 1,
  OUT: 2,
};

type Props = {
  feed: any;
  direction?: number;
  limit?: string;
  offset?:string;
};

type State = {
  dataSource: Array<{}>,
  refreshing: any
};


class _follows extends React.Component<Props, State> {

  constructor(props:Props) {
      super(props);
      this.state = {
           dataSource: [],
           refreshing: false,
         };
  }

  componentDidMount() {
    this._onRefresh()
  }

  renderItemOld = ({ item }) => (
    <Text style={styles.item}>{item.key}</Text>
  );

  renderItem = ({item}) => (
    <View>
      <Text>
        <Image
          style={{width: 50, height: 50}}
          source={{uri:"https://api.adorable.io/avatars/70/" + item.key + ".png"}}
        />
        {item.key}
      </Text>
    </View>
  );

  _onRefresh() {
    if (this.state.refreshing) {
      return;
    }
    this.setState({refreshing: true});
    let updateState = res => {
      this.setState({refreshing: false});
      this.setState(previousState => {
                  return { dataSource: res['results'].map(i => (
                    {key: this.props.direction === Direction.IN ? i.feed_id : i.target_id}))
               };
            });
    };
    const options = {limit: this.props.limit, offset: this.props.offset};
    if (this.props.direction === Direction.IN) {
      this.props.feed.followers(options).then(updateState).catch(reason => { console.log(reason)});
    } else {
      this.props.feed.following(options).then(updateState).catch(reason => { console.log(reason)});
    }
  }

  render() {
    return (
      <FlatList
        data={this.state.dataSource}
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    );
  }
}

export class Follows extends React.Component<{}> {
  render() {
    return (
      <StreamCurrentFeed.Consumer>
          {feed => <_follows feed={feed} {...this.props}  />}
      </StreamCurrentFeed.Consumer>
    );
  }
}
