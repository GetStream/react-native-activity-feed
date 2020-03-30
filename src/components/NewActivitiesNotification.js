// @flow
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike } from '../types';
import type { Streami18Ctx } from '../Context';
import { withTranslationContext } from '../Context';

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
|} & Streami18Ctx;

/**
 * Renders a notification message when new activities are received by a feed
 * @example ./examples/NewActivitiesNotification.md
 */
class NewActivitiesNotification extends React.Component<Props> {
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
      t,
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

    let singleNotificationText = '';
    let pluralNotificationText = '';

    if (labelSingular) {
      singleNotificationText = `You have 1 new ${labelSingular}`;
    } else {
      singleNotificationText = t('You have 1 new notification');
    }

    if (labelPlural) {
      pluralNotificationText = `You have ${addCount} new ${labelPlural}`;
    } else {
      pluralNotificationText = t(
        'You have {{ notificationCount }} new notifications',
        {
          notificationCount: addCount,
        },
      );
    }

    return addCount > 1 ? pluralNotificationText : singleNotificationText;

    // return `You have ${addCount} new ${
    //   addCount > 1 ? labelPlural : labelSingular
    // }`;
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

export default withTranslationContext(NewActivitiesNotification);
