// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import { buildStylesheet } from '../styles';

import type { StylesProps } from '../types';

type Props = {|
  feedGroup: string,
  userId?: string,
  adds: Array<{}>,
  deletes: Array<{}>,
  labelSingular?: string,
  labelPlural?: string,
  ...StylesProps,
|};

export default class Pager extends React.Component<Props> {
  static defaultProps = {
    messages: [],
    labelSingular: 'activity',
    labelPlural: 'activities',
  };

  render() {
    let { adds, deletes, labelSingular, labelPlural } = this.props;
    let styles = buildStylesheet('pagerBlock', this.props.styles);
    let addCount = (adds || []).length;
    let deleteCount = (deletes || []).length;
    let count = addCount + deleteCount;
    return count ? (
      <View style={[styles.container]}>
        <Text style={[styles.text]}>
          You have {count} new {count > 1 ? labelPlural : labelSingular} drag
          down to refresh
        </Text>
      </View>
    ) : null;
  }
}
