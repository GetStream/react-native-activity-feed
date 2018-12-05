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
  labelStart: string,
  labelNewSingular: string,
  labelNewPlural: string,
  /** A function that returns either the string to display or null in case no
   * notification should be displayed */
  labelFunction?: ({
    count: number,
    deleteCount: number,
    addCount: number,
    labelPlural: string,
    labelSingular: string,
    labelStart: string,
    labelNewSingular: string,
    labelNewPlural: string,
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
    labelStart: 'You have ',
    labelNewSingular: 'new',
    labelNewPlural: 'new',
  };

  _labelFunction = () => {
    let {
      adds,
      deletes,
      labelSingular,
      labelPlural,
      labelFunction,
      labelStart,
      labelNewSingular,
      labelNewPlural,
    } = this.props;
    let addCount = (adds || []).length;
    let deleteCount = (deletes || []).length;
    let count = addCount + deleteCount;
    if (labelFunction) {
      return labelFunction({
        count,
        addCount,
        deleteCount,
        labelSingular,
        labelPlural,
        labelStart,
        labelNewSingular,
        labelNewPlural,
      });
    }
    if (addCount == 0) {
      return null;
    }
    return `${
      addCount > 1 
      ? labelStart addCount labelNewPlural labelPlural 
      : labelStart addCount labelNewSingular labelSingular
    }`;
  };

  render() {
    let styles = buildStylesheet('pagerBlock', this.props.styles);
    let label = this._labelFunction();
    return label != null ? (
      <TouchableOpacity style={[styles.container]} onPress={this.props.onPress}>
        <Text style={[styles.text]}>{label}</Text>
      </TouchableOpacity>
    ) : null;
  }
}
