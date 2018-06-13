// @flow

import * as React from 'react';
import {Image, View, Text, FlatList, SectionList, StyleSheet} from 'react-native';
import {StreamService} from '../core/Service';
import {StreamApp, StreamCurrentFeed} from '../core/Context';
import { List, ListItem } from 'react-native-elements'



const styles = StyleSheet.create({
  container: {
   flex: 1,
   width:"100%",
  },
  item: {
  },
});

type GetProps = {
  feed: any;
  direction?: number;
  limit?: string;
  offset?:string;
};

type State = {
  dataSource: Array<{}>,
};


class _activities extends React.Component<GetProps, State> {

  constructor(props:GetProps) {
      super(props);
      this.state = {
           dataSource: [],
         };
  }

  componentDidMount() {
    const options = {limit: this.props.limit, offset: this.props.offset};
    this.props.feed.get(options).then(res => {
      this.setState(previousState => {
                  return { dataSource: res['results'].map(i => ({key: i.id, data:i.data}))
               };
            });
    }).catch(reason => { console.log(reason)})
  }

  renderItem = ({item}) => (
        <View>
          <Image
            style={{width: 70, height: 70}}
            source={{uri:"https://api.adorable.io/avatars/70/" + item.data.origin + ".png"}}
          />
          <Text>
            {item.data.actor}
          </Text>
          <Text>
            {item.data.verb + " " + item.data.object}
          </Text>
        </View>
  );

  render() {
    return (
        <View style={styles.container}>
            <FlatList
              data= { this.state.dataSource }
              renderItem={this.renderItem}
            />
        </View>
    );
  }
}

export class FlatFeed extends React.Component<{}> {
  render() {
    return (
      <StreamCurrentFeed.Consumer>
          {feed => <_activities feed={feed} {...this.props}  />}
      </StreamCurrentFeed.Consumer>
    );
  }
}
