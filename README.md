# kmeans
javascript implementation of k-means clustering algorithm for node.js

To use with *js-ml-workshop*, replace **kmeans.js** in /js-ml-workshop/002_kmeans
, then run ```mocha kmeans_specs.js```

The digit and character recognition in the test specs should work!
You can also use this library standalone by invoking the API methods listed below. 

## API
To start an instance of k-means:

```javascript
var km = new KMeans();
```

To start an instance of k-means w/ custom options:

```javascript
var km = new KMeans({minClusterMove: 0.001, clusterAttempts: 15});
```

To add data points or vectors:
```javascript
var km = new KMeans();
var data = [[10, 10], [20, 20]];
km.train(data); // data is stored in km.points
```

To return a list of clusters:
```javascript
var km = new KMeans();
var data = [[10, 10], [20, 20]];
km.train(data);
km.clusters(1) // returns one centroid [ [ 15, 15 ] ]
```

To return vectors grouped by centroids:
```javascript
var km = new KMeans();
var dataset = [ [1950, 485833, 900], [1960, 485832, 1000], [1955, 483818, 700], [2000, 200000, 800], [1965, 200000, 200], [2008, 100000, 300] ];
km.train(data);
var centroids = km.clusters(2)  // returns two centroids [ [ 1955, 485161, 866.66 ], [ 1991, 166666.66, 433.33 ] ]
km._groupVectors(centroids, data); 
// returns vectors clustered by centroids
// [ [ [ 2000, 200000, 800 ], [ 1965, 200000, 200 ], [ 2008, 100000, 300 ] ], 
//   [ [ 1950, 485833, 900 ], [ 1960, 485832, 1000], [ 1955, 483818, 700 ] ] ]
```
