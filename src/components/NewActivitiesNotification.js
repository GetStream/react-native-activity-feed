//
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import { buildStylesheet } from '../styles';

import { withTranslationContext } from '../Context';

/**
 * Renders a notification message when new activities are received by a feed
 * @example ./examples/NewActivitiesNotification.md
 */
class NewActivitiesNotification extends React.Component {
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

NewActivitiesNotification.propTypes = {
  adds: PropTypes.arrayOf(PropTypes.object),
  deletes: PropTypes.arrayOf(PropTypes.string),
  labelSingular: PropTypes.string,
  labelPlural: PropTypes.string,
  /**
   * A function that returns either the string to display or null in case no
   * notification should be displayed
   * @param {object} param0 e.g.,
   * {
   *    count: number,
   *    deleteCount: number,
   *    addCount: number,
   *    labelPlural: string,
   *    labelSingular: string,
   *  }
   */
  labelFunction: PropTypes.func,
  styles: PropTypes.object,
  onPress: PropTypes.func,
};

export default withTranslationContext(NewActivitiesNotification);
