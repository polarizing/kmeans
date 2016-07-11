# kmeans
javascript implementation of k-means clustering algorithm for node.js

## API
To start an instance of k-means:

```javascript
var km = KMeans();
```

To start an instance of k-means w/ custom options:

```javascript
var km = KMeans({minClusterMove: 0.001, clusterAttempts: 15});
```

To add data points or vectors:
```javascript
var km = KMeans();
var data = [[10, 10], [20, 20]];
km.train(data); // data is stored in km.points
```

To return a list of clusters:
```javascript
var km = KMeans();
var data = [[10, 10], [20, 20]];
km.train(data);
km.clusters(3) // returns 3 clusters
```

To return vectors grouped by centroids:
```javascript
var km = KMeans();
var data = [[10, 10], [20, 20]];
km.train(data);
var centroids = km.clusters(3) 
km._groupVectors(centroids, data); // returns vectors grouped by centroid cluster
```
