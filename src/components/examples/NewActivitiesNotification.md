```js { "props": { "adds": [1] } }
import NewActivitiesNotification from '../NewActivitiesNotification';
<NewActivitiesNotification adds={[{}]} />;
```

```js
import NewActivitiesNotification from '../NewActivitiesNotification';
<NewActivitiesNotification
  labelSingular={'tweet'}
  labelPlural={'tweets'}
  adds={[{}, {}]}
/>;
```
