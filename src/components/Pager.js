// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import { StreamContext } from '../Context';
import { buildStylesheet } from '../styles';

import type { BaseAppCtx } from '../types';

type Props = {|
  feedGroup: string,
  userId?: string,
  labelSingular?: string,
  labelPlural?: string,
  Child: Class<React.Component<any>>,
|};

type PropsInner = {| ...Props, ...BaseAppCtx |};

class PagerBlock extends React.Component<any, State> {
  static defaultProps = {
    messages: [],
    labelSingular: 'activity',
    labelPlural: 'activities',
  };

  render() {
    let { messages, labelSingular, labelPlural } = this.props;
    let styles = buildStylesheet('pagerBlock', this.props.styles);
    return messages && messages.length > 0 ? (
      <View style={[styles.container]}>
        <Text style={[styles.text]}>
          You have {this.props.messages.length} new{' '}
          {messages.length > 1 ? labelPlural : labelSingular} drag down to
          refresh
        </Text>
      </View>
    ) : null;
  }
}

export default class Pager extends React.Component<Props> {
  static defaultProps = {
    Child: PagerBlock,
    feedGroup: 'timeline',
    labelSingular: 'activity',
    labelPlural: 'activities',
  };

  innerRef: ?React.Component<any, any>;

  constructor(props: Props) {
    super(props);
    this.innerRef = null;
  }

  dismiss() {
    if (this.innerRef) {
      // $FlowFixMe
      this.innerRef.dismiss();
    }
  }

  render() {
    return (
      <StreamContext.Consumer>
        {(appCtx) => {
          return (
            <PagerInner
              {...this.props}
              {...appCtx}
              ref={(node) => {
                this.innerRef = node;
              }}
            />
          );
        }}
      </StreamContext.Consumer>
    );
  }
}

type State = {
  messages: Array<any>,
  subscription: any,
};

class PagerInner extends React.Component<PropsInner, State> {
  state = {
    messages: [],
    subscription: {},
  };

  async componentDidMount() {
    const feed = this.props.session.feed(
      this.props.feedGroup,
      this.props.user.id,
    );

    let subscription = feed
      .subscribe((data) => {
        this.setState((prevState) => {
          prevState.messages.push(data.new);
          return { messages: [prevState.messages] };
        });
      })
      .then(
        () => {
          console.log(
            `now listening to changes in realtime ${this.props.feedGroup}:${
              this.props.user.id
            }`,
          );
        },
        (err) => {
          console.error(err);
        },
      );
    this.setState({ subscription });
  }

  async componentWillUnmount() {
    try {
      await this.state.subscription.cancel();
    } catch (err) {
      console.log(err);
    }
  }

  dismiss() {
    this.setState({ messages: [] });
  }

  render() {
    let Child = this.props.Child;
    return <Child messages={this.state.messages} {...this.props} />;
  }
}
