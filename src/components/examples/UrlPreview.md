```js
import UrlPreview from '../UrlPreview';

<UrlPreview
  // open graph data is retrieved using client.og('url') this is just an example with mock data
  og={{
    title: '2001: A Space Odyssey (1968)',
    images: [
      {
        image:
          'https://m.media-amazon.com/images/M/MV5BMmNlYzRiNDctZWNhMi00MzI4LThkZTctMTUzMmZkMmFmNThmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR90,0,630,1200_AL_.jpg',
      },
    ],
  }}
  onPressDismiss={() => {}}
/>;
```
