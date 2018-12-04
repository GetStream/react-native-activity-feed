// @flow
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike } from '../types';

type Props = {|
  adds: Array<{}>,
  deletes: Array<{}>,
  labelSingular?: string,
  labelPlural?: string,
  styles?: StyleSheetLike,
  onPress?: () => mixed,
|};

/**
 * Renders a notification message when new activities are received by a feed
 * @example ./examples/NewActivitiesNotification.md
 */
export default class NewActivitiesNotification extends React.Component<Props> {
  static defaultProps = {
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
      <TouchableOpacity style={[styles.container]} onPress={this.props.onPress}>
        <Text style={[styles.text]}>
          You have {count} new {count > 1 ? labelPlural : labelSingular}
        </Text>
      </TouchableOpacity>
    ) : null;
  }
}
