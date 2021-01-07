//
import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

import { buildStylesheet } from '../styles';

import { withTranslationContext } from '../Context';

function defaultLabelFunction(count, props) {
  const { labelSingle, labelPlural, labelFunction, kind, t } = props;
  if (labelFunction) {
    return labelFunction({
      count,
      labelSingle,
      labelPlural,
    });
  }

  let label;

  if (labelSingle && labelPlural) {
    label = count === 1 ? `1 ${labelSingle}` : `${count} ${labelPlural}`;
  }

  if (!labelSingle || !labelPlural) {
    switch (kind) {
      case 'like':
        label =
          count === 1
            ? t('1 like')
            : t('{{ countLikes }} likes', { countLikes: count });
        break;
      case 'repost':
        label =
          count === 1
            ? t('1 repost')
            : t('{{ countReposts }} reposts', { countReposts: count });
        break;
      case 'comment':
        label =
          count === 1
            ? t('1 comment')
            : t('{{ countComments }} comments', { countComments: count });
        break;
      default:
        break;
    }
  }

  return label;
}

const ReactionIcon = withTranslationContext((props) => {
  let count = null;
  if (props.counts && props.kind) {
    count = props.counts[props.kind] || 0;
  }
  const styles = buildStylesheet('reactionIcon', props.styles);

  const dimensions = {};
  if (props.height !== undefined) {
    dimensions.height = props.height;
  }
  if (props.width !== undefined) {
    dimensions.width = props.width;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image source={props.icon} style={[styles.image, dimensions]} />
      {count != null ? (
        <Text style={styles.text}>{defaultLabelFunction(count, props)}</Text>
      ) : null}
    </TouchableOpacity>
  );
});

export default ReactionIcon;
