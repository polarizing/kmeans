function KMeans(options){
	if (options == undefined){options = {};}
	this.minClusterMove = options.minClusterMove || 0.01;
	this.clusterAttempts = options.clusterAttempts || 10;
	this.points = [];
}

//Adds vectors to points
KMeans.prototype.train = function (vectors) {
	this.points = this.points.concat(vectors);
}

//Returns a list of centroids
KMeans.prototype.clusters = function (clusterNum) {
	var self = this;
	return this._max(this._manyClusters(this.clusterAttempts, clusterNum), function (cluster) {
		return -self._clusterEvaluator(cluster, self.points)
	});
}

// HELPER FUNCTIONS

// Returns euclidean distance between two vectors
KMeans.prototype._distance = function (vector1, vector2) {
	if (vector1.length !== vector2.length) throw new Error("Vectors must be same length.");
	var _sum = 0;
	for (var i = 0; i < vector1.length; i++) {
		_sum += Math.pow((vector2[i] - vector1[i]), 2)
	}
	return Math.sqrt(_sum);
}

// Similar to _underscore or lodash _max function - returns max elem in mapped arr on fn
KMeans.prototype._max = function (arr, fn) {
	var newArr;
	if (fn.length === 1) newArr = arr.map( function (elem) { return fn(elem) });
	if (fn.length === 2) newArr = arr.map( function (elem, idx) { return fn(elem, idx)});

	// finding max index in array
	function maxIndex (array) {
		if (array.length === 0) return -1;
		var max = array[0]
		var index = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i] > max) {
				max = array[i];
				index = i;
			}
		}
		return index;
	}
	return arr[maxIndex(newArr)];
}

// Returns the sum square distances of all centroids from the centroid's relative cluster of vector points
KMeans.prototype._clusterEvaluator = function (centroids, vectors) {

	var self = this;

	return vectors.map(function (vector) {
		return Math.pow(centroids.map( function (centroid) {
			return self._distance(vector, centroid);
		}).reduce(function (a, b) {return Math.min (a, b)}), 2);
	}).reduce(function (a, b) {return a + b});	

}

// Returns mean location of vector points
KMeans.prototype._averageLocation = function (vectors) {

	return vectors.reduce(function (arr, vector) {
				vector.forEach(function (component, index) {
					if (arr[index] === undefined) arr[index] = component;
					else arr[index] += component;
				})
				return arr;
			}, []).map(function (componentSum) {
				return componentSum / vectors.length;
			})

	// alternate non-functional solution
	// var xSum = 0;
	// var ySum = 0;
	// for (var i = 0; i < vectors.length; i++) {
	// 	xSum = xSum + vectors[i][0];
	// 	ySum = ySum + vectors[i][1];
	// }
	// var xMean = xSum / vectors.length;
	// var yMean = ySum / vectors.length;
	// return [xMean, yMean];
}

// Return vectors grouped by centroid
KMeans.prototype._groupVectors = function (centroids, vectors) {
	var self = this;
	var centroidGroups = [];

	for (var i = 0; i < centroids.length; i++) {
		centroidGroups.push([]);
	}

	return groupedVectors = vectors.reduce (function (arr, vector) {
		var dist = centroids.map( function (centroid) { return self._distance(vector, centroid) });
		var groupIndex = dist.indexOf(Math.min.apply(null, dist));
		if (arr[groupIndex] === undefined) arr[groupIndex] = [];
		arr[groupIndex].push(vector);
		return arr;
	}, centroidGroups)
}

// Shifts and returns all centroid locations based on the centroid's cluster points' mean location.
KMeans.prototype._shiftCentroids = function (centroids, vectors) {

	var self = this;
	var groupedVectors = this._groupVectors(centroids, vectors);

	return groupedVectors.map(function (centroidGroup) {
		// if centroid group is empty cluster, replace with new random centroid http://stackoverflow.com/questions/11075272/k-means-empty-cluster
		if (centroidGroup.length === 0) return self._getRandomCentroids(vectors)[0]
		else return self._averageLocation(centroidGroup);
	});
}

// Determines if two groups of centroids have shifted
KMeans.prototype._haveShifted = function ( beforeCentroids, afterCentroids ) {
	var self = this;
	return !beforeCentroids.every(function (e, index) {
		return self._distance(e, afterCentroids[index]) <= self.minClusterMove;
	})
}

// Returns one (or n) random centroid(s) of n dimensions given vector array of n components per vector. 
// Gets random vector from bounded box of min and max vector components
KMeans.prototype._getRandomCentroids = function ( vectors, n ) {
	var numCentroids = ((n === undefined) ? 1 : n);
	var centroids = [];
		for (var i = 0; i < numCentroids; i++) {
			var componentsMinMax = vectors[0].reduce( function (arr, component, currIndex) {
				if (arr[currIndex] === undefined) arr[currIndex] = [];
				arr[currIndex].push(vectors.reduce(function (min, array) {
					return Math.min(min, array[currIndex]);
				}, component))
				arr[currIndex].push(vectors.reduce(function (max, array) {
					return Math.max(max, array[currIndex]);
				}, component));
				return arr;
			}, [])
			var randomComponents = componentsMinMax.map(function (component) {
				return parseFloat((Math.random() * (component[1] - component[0]) + component[0]).toFixed(2));
			})
			centroids.push(randomComponents);
		}
	return centroids;
}

// Runs a complete iteration of k-means
KMeans.prototype._clusters = function (numClusters, vectors) {
	var centroids = this._getRandomCentroids(vectors, numClusters);
	var newCentroids = this._shiftCentroids(centroids, vectors);

	while (this._haveShifted(centroids, newCentroids)) {
		centroids = newCentroids;
		newCentroids = this._shiftCentroids(centroids, vectors);
	}

	return centroids;
}

// Runs multiple iterations of k-means
KMeans.prototype._manyClusters = function ( times , numClusters ) {
	var clusters = [];

	for (var i = 0; i < times; i++) {
		clusters.push( this._clusters(numClusters, this.points) );
	}

	return clusters;
}

module.exports = KMeans