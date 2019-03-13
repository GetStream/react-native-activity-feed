// @flow
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike } from '../types';

type Props = {|
  adds: Array<{}>,
  deletes: Array<{}>,
  labelSingular: string,
  labelPlural: string,
  /** A function that returns either the string to display or null in case no
   * notification should be displayed */
  labelFunction?: ({
    count: number,
    deleteCount: number,
    addCount: number,
    labelPlural: string,
    labelSingular: string,
  }) => string | null,
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

  _labelFunction = () => {
    const {
      adds,
      deletes,
      labelSingular,
      labelPlural,
      labelFunction,
    } = this.props;
    const addCount = (adds || []).length;
    const deleteCount = (deletes || []).length;
    const count = addCount + deleteCount;
    if (labelFunction) {
      return labelFunction({
        count,
        addCount,
        deleteCount,
        labelSingular,
        labelPlural,
      });
    }
    if (addCount === 0) {
      return null;
    }
    return `You have ${addCount} new ${
      addCount > 1 ? labelPlural : labelSingular
    }`;
  };

  render() {
    const styles = buildStylesheet('pagerBlock', this.props.styles);
    const label = this._labelFunction();
    return label != null ? (
      <TouchableOpacity style={[styles.container]} onPress={this.props.onPress}>
        <Text style={[styles.text]}>{label}</Text>
      </TouchableOpacity>
    ) : null;
  }
}
