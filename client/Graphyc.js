// Simple Graphs implementation by Pranay 
	// v 0.0.1 (01/13/15)

// var assert = require('assert');

// adjacency list format [[value_0, edge_1, edge_2, ..., edge_n-1], ...]
// value format [val_0, val_1, ..., val_n-1]

var Graph = function(numOfNodes) {
	var num = numOfNodes;
	this.list = this._makeList(num || 5);
	this.values = this._makeVals(num || 5); 
	this.nodeStore = [];
}

Graph.prototype._isInList = function(node) {
	if (node < 0) {return false}
	var list = this.list;
	if (node >= list.length) {return false}
	return true;
}

Graph.prototype._makeList = function(num) {
	var list = [];
	for (var i = 0; i < num; i++) {
		list[i] = [];
	}
	return list;
}

Graph.prototype._makeVals = function(num) {
	var vals = [];
	for (var i = 0; i < num; i++) {
		vals[i] = null;
	}
	return vals;
}

Graph.prototype._get = function(prop) {
	return this[prop];
}

Graph.prototype._set = function(prop, val) {
	this[prop] = val;
	return this;
}


Graph.prototype._getVal = function(node) {
	if (!this._isInList(node)) {throw new Error('not in list')}

	return this.values[node];
}

Graph.prototype._setVal = function(node, val) {
	if (!this._isInList(node)) {throw new Error('not in list')}
	this.values[node] = val;
	return this;
}

Graph.prototype._getEdges = Graph.prototype._getNeighbors = function(node) {
	if (!this._isInList(node)) {throw new Error('not in list')}
	return this.list[node];
}

Graph.prototype._setEdges = Graph.prototype._getNeighbors = function(node, edges) {
	if (!this._isInList(node)) {throw new Error('not in list')}
	if (typeof edges !== 'object' || !Array.isArray(edges)) {throw new Error('edges must be an array')}

	this.list[node] = edges;
	return this;
}

Graph.prototype.makeRandomList = function(num) {
	var al = [];
	for (var i = 0; i < num; i++) {
		al[i] = [];
		for (var j = 0; j < num; j++) {
			Math.round(Math.random())?al[i].push(j):null;
		}
	}
	return al;
}

Graph.prototype._connect = function(node1, node2) {
	if (!this._isInList(node1) || !this._isInList(node2)){
		throw new Error('both nodes must be in list')
	}
	this.list.indexOf(node2) < 0 ? this.list[node1].push(node2) : null;
	this.list.indexOf(node1) < 0 ? this.list[node2].push(node1) : null;
}

Graph.prototype.invertAdjacencyList = function(wantNew) {
	var al = this.al;
	var c = 0;
	var a = [];
	for (var i = 0; i < this.al.length; i++) {
		var edges = this.al[i];
		a[i] = a[i] || [];
		for (var j = 0; j < edges.length; j++) {
			c++;
			a[edges[j]] = (a[edges[j]] || []).concat([i]);
		}
	}
	this.al=wantNew?this.al:a;
	return a;
}

Graph.prototype.bfs = function(node, stopDepth, cb){
	if (!this._isInList(node)) {throw new Error('not in list')}
	stopDepth = stopDepth || Number.POSITIVE_INFINITY;
	var ns = this.nodeStore, list = this.list, hash = {};
	var that = this;
	function rec(node, depth) {
		if (depth === stopDepth + 1) {
			return;
		}
		ns[node] = depth;
		hash[node] = true;
		cb.call(that, node);
		list[node].forEach(function(e,i,a) {
			if (!(e in hash)) {
				rec(e, depth + 1);
			}
		});
	}
	rec(node, 0);
}

var graph = new Graph(4);
graph._set('list', [[1,2],[0],[0, 3],[]])
console.log(graph.list);
// graph._connect(3,1);
console.log(graph.list);
graph.bfs(2,1,function(e) {
	console.log(this.values[e], this.list[e], e)
})



