// @flow
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike } from '../types';

type Props = {|
  adds: Array<{}>,
  deletes: Array<{}>,
  labelFunction?: func,
  styles?: StyleSheetLike,
  onPress?: () => mixed,
|};

/**
 * Renders a notification message when new activities are received by a feed
 * @example ./examples/NewActivitiesNotification.md
 */
export default class NewActivitiesNotification extends React.Component<Props> {
  
  const labelFunction = (labelStart, labelNewSingular, labelNewPlural, count, labelSingular, labelPlural) => {
    return (
      {count > 1 ? 
        (laberStart||'You have') count (labelNewPlural||'new') (labelPlural||'activities')
       : 
       (laberStart||'You have') count (labelNewSingular||'new') (labelSingular||'activity')
      }
    );
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
          {this.labelFunction}
        </Text>
      </TouchableOpacity>
    ) : null;
  }
}
