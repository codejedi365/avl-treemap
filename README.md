# TreeMap.js

<p align="center">
  <a href="https://www.npmjs.com/package/treemap.js">
    <img src="https://img.shields.io/npm/v/treemap.js" />
  </a>
  <img src="https://img.shields.io/npm/l/treemap.js?color=yellow">
  <a href="https://github.com/codejedi365/treemap-js/blob/main/CHANGELOG.md">
    <img src="https://img.shields.io/badge/&#9741-changelog-yellow">
  </a>
  <a href="https://github.com/codejedi365/treemap-js/actions/workflows/ci.yml">
    <img src="https://github.com/codejedi365/treemap-js/actions/workflows/ci.yml/badge.svg" >
  </a>
  <a href="https://github.com/codejedi365/treemap-js/issues">
    <img src="https://img.shields.io/github/issues/codejedi365/treemap-js">
  </a>
  <img src="https://img.shields.io/badge/dependencies-0-success">
  <img src="https://img.shields.io/snyk/vulnerabilities/npm/treemap.js">
</p>
<p align="center">
  <img src="https://img.shields.io/npm/dependency-version/treemap.js/dev/webpack">
  <img src="https://img.shields.io/node/v-lts/treemap.js?color=blue">
  <img src="https://img.shields.io/bundlephobia/min/treemap.js" />
  <img src="https://img.shields.io/github/last-commit/codejedi365/treemap-js">
</p>

A TypeScript/Javascript implementation of a binary tree map.

## Package Objective

The `TreeMap` class merges the functionality of key=>value pairs with the
sorting power of an AVL Tree. An AVL Tree is a derivative of the Binary Search
Tree (BST) which self-balances its subtrees to achieve reliable _O(log n)_ on
the core lookup, insertion, & deletion functions.

At any one time, the heights of the two child subtrees of any node differ by at
most 1 due to rebalancing that occurs upon insertion & deletion when the tree
becomes unbalanced. The AVL data structure was designed and named after the
inventors Georgy Adelson-Velsky & Evgenii Landis.

This `TreeMap` class uses the object `compare()` method to sort the LeafNode
keys upon insertion. The associated value in the key-value pair is stored in the
same node as its key via `add(key, value)` function.

The TreeMap is implemented to support generic types provided at the `new`
construction of the TreeMap object. See the `constructor()` function for
examples.

The class provides default a `compare()` function to sort keys of either
`typeof number` or `typeof string`. See the `compare()` function for further
explanation. You must override this function to specify a different ordering
scheme or handle different `typeof key` sorting. Ordering schemes & sort will
effect how nodes are searched and ordered when extracted from the data
structure. For the best performance, using a key with `typeof number` is the
fastest, then `typeof string`, and lastly a custom object comparator. With this
in mind, if you are attempting to sort lots of objects, you should
extract/derive an unique numeric `id` or string `UUID` as the key to the
`key=>value` pair that you insert into the tree where your value is the object
you are attempting to sort and store.

## How to use

### 1. Install

```sh
npm install --save treemap
```

### 2. Import & intialize

```js
import { TreeMap } from "treemap"; // es6 import example

const treemap = new TreeMap(); // JavaScript
```

```js
// TypeScript generic construction
const treemap = new TreeMap<string, unknown>();
```

### 3. Common Uses

1.  Event Handling `msTimestamp => Event:{ ... }`

2.  Quick alphabetical sorting via insertion sort

### 4. Special Config

Change the default behavior of `keys()`, `values()`, `allEntries()` to a desired
search algorithm via provided `Treemap.defaultAlgorithm` attribute. **DEFAULT:
Depth-First Search (DFS)**

```js
import { TreeMap, TreeAlgorithm } from "treemap";

const treemap = new TreeMap(); // Algorithm is DFS [DEFAULT]

// Change to Breadth-First Search (BFS)
treemap.defaultAlgorithm = TreeAlgorithm.BFS;
```

<details>
<summary size="2">API</summary>

## API

### `ENUM TreeAlgorithm`

Defined constanjs to define supported search algorithms for traversing a binary
tree.

**`ENUM TreeAlgorithm.DFS`**

**`ENUM TreeAlgorithm.BFS`**

### `TreeMap`

**`defaultAlgorithm: TreeAlgorithm`**

Enum to specify which search algorithm to use by default in methods. See
[TreeAlgorithm](#enum-treealgorithm) for possible values.

**`constructor(): new TreeMap`**

Creates a new `TreeMap` object with 0 nodes. Initializes with DFS as the
`defaultAlgorithm`.

Example use:

```js
// 1. Explicit type mapping
const numbertree = new TreeMap<number, object>();

// 2. Dynamic type mapping
const key: string = "alphanumeric";
const data: number = 1;
const treemap = new TreeMap<typeof key, typeof data>();
```

**`first(): T | false`**

Finds the value of the first key in the dataset determined by the depth-first
search algorithm @returns the value

**`firstKey(): K | false`**

Finds the first key in the dataset determined via the depth-first search
algorithm @returns the key

**`last(): T | false`**

Finds the value with the last key in the dataset determined by the depth-first
search algorithm @returns the value

**`lastKey(): K | false`**

Finds the last key in the dataset determined via the depth-first search
algorithm @returns the key

**`fetch(key: K): T | null`**

Finds the value/data of the key=>value pair contained in the tree's nodes which
matches the specified key @param key the key to search for @returns the data
stored by the specified key

**`isKey(key: K): boolean`**

Determines if a specified key is in the TreeMap @param key the key to search for
@returns `True` if key exists, otherwise `False`

**`keys(): K[]`**

Returns all keys in the TreeMap according to the set `defaultAlgorithm`.
@returns an array of all keys

**`dfsKeys(): K[]`**

Returns all keys in the TreeMap defined by a Depth-First Search regardless of
the value of `treemap.defaultAlgorithm`. @returns an array of all keys in DFS
order

**`bfsKeys(): K[]`**

Returns all keys in the TreeMap defined by a Breadth-First Search regardless of
the value of `treemap.defaultAlgorithm`. @returns an array of all keys in BFS
order

**`values(): T[]`**

Returns all values in the TreeMap according to the order of keys found via the
set `defaultAlgorithm`. @returns an array of all values

**`dfsValues(): T[]`**

Returns all values in the TreeMap defined by a Depth-First Search of the
associated keys regardless of the value of `treemap.defaultAlgorithm`. @returns
an array of all values based on DFS order

**`bfsValues(): T[]`**

Returns all values in the TreeMap defined by a Breadth-First Search of the
associated keys regardless of the value of `treemap.defaultAlgorithm`. @returns
an array of all values based on BFS order

**`allEntries(): [K, T][]`**

Returns all key-value pairs as an entry `[key, value]` according to the order of
keys found via the set `defaultAlgorithm`. @returns an array of all key-value
pairs

**`dfsEntries(): [K, T][]`**

Returns all key-value pairs as an entry `[key, value]` according to the order of
a Depth-First Search, regardless of the value of `treemap.defaultAlgorithm`.
@returns an array of all key-value pairs based on DFS order

**`bfsEntries(): [K, T][]`**

Returns all key-value pairs as an entry `[key, value]` according to the order of
a Breadth-First Search, regardless of the value of `treemap.defaultAlgorithm`.
@returns an array of all key-value pairs based on BFS order

**`size(): number`**

Counts the number of nodes in the Tree @returns the number of nodes in the
TreeMap, `0` if empty

**`height(): number`**

Counts the number of layers in the Tree @returns the number of layers in the
TreeMap, `0` if empty

**`add(key: K, value: T): TreeMap<K, T>`**

Creates and inserts a key=>value node into the TreeMap @param key the key to
sort by @param value the data to store @returns this TreeMap instance for
chaining

**`merge(tree: TreeMap<K, T>): TreeMap<K, T> | false`**

Merges 2 TreeMaps into 1.

WARNING: Node keys in the provided tree that match keys in this tree will be
overwritten with the data in the provided tree. @param tree the tree of nodes to
merge into this tree @returns this adjusted TreeMap instance for chaining, or
`False` on failure

**`remove(key: K): T | false`**

Removes a node and return the associated data based on a given key @param key
the key that identifies the node @returns the data stored or false if key is not
found

**`removeAll(): TreeMap<K, T>`**

Quickly removes all nodes & values from TreeMap @returns this empty TreeMap for
chaining

**`dfTraversal<R>(nodeHandlerFn: (this: TreeMap<K, T>, head: LeafNode<K, T>, visited: R[]) => void): R[]`**

Performs a Depth-First traversal across the TreeMap and perform a custom
programable operation as each node is visited.

To interrupt and return from the DFS with the data collected, the
`nodeHanlderFn` can throw a `StopSearchException` which will be caught by this
function and the persistent array of collected data returned.

For Typescript, the generic type R should be provided to define the type of the
objects that exist in the array that will be returned from this function. It is
guaranteed to be an array by this function definition.

@param nodeHandlerFn custom function to call on each node. It is passed the
current node and the persistent array that can store data across each traversal
of a node. @returns an array of custom objects user defined

**`bfTraversal<R>(nodeHandlerFn: (this: TreeMap<K, T>, currentNode: LeafNode<K, T>, visited: R[], depth: number) => void): R[]`**

Performs a Breadth-First traversal across the TreeMap and perform a custom
programable operation as each node is visited.

To interrupt and return from the BFS with the data collected, the
`nodeHanlderFn` can throw a `StopSearchException` which will be caught by this
function and the persistent array of collected data returned.

For Typescript, the generic type R should be provided to define the type of the
objects that exist in the array that will be returned from this function. It is
guaranteed to be an array by this function definition.

@param nodeHandlerFn custom function to call on each node. It is passed the
current node and the persistent array that can store data across each traversal
of a node. @returns an array of custom objects user defined

**`subtree(start: K): TreeMap<K, T> | false`**

Takes a specific key and creates a shallow cloned subtree of that portion of the
tree. The new TreeMap will have a root node of the node found from the provided
and all of its descendants. It will also duplicate the original configuration of
the parent tree. See `sliceTree()` for details.

**WARNING: This is a shallow copy of the descendents, it is up to the user to
remove the reference in the parent tree to this subtree.** @param start a key
that matches a LeafNode within the current tree @returns a new TreeMap instance
from a portion of the current tree or `False` if key was not found.

**`compare(this: void, node1: LeafNode<K, T>, node2: LeafNode<K, T | null>): -1 | 0 | 1`**

Defines the sorting algorithm for nodes in this BST. This is expected to be
overriden by a users implementation unless they want to use the default
ascending numberic sorting or ascending ASCII string sort (`0,1,2,...n` \|\|
`a,b,c,...z`). Keys that are strings of numberic values will be converted to
numbers for comparison if they are both numeric.

If not overridden, this function passes the nodes off to the generic static
comparison function of the TreeMap class to perform the default action

If this function is overridden, it must return -1 || 0 || 1 to indicate to the
tree sorting algorithm whether to replace the current node, or which side should
it continue to traverse (-1 = left, 1 = right).

@param node1 base node in which to determine current position in tree @param
node2 node being evaluated for if it should be in front(left) or behind(right)
the base node @returns `-1` if node2 should be in to the left of node1, `+1` if
on the right, or `0` if keys are equal

**`toString(): string`**

Converts TreeMap to human readable (serialized-like) representation @override
`Object.toString()` @returns string in format
`TreeMap:{ root:[key=value], dfs:[entry, ...] }`

**`print(): void`**

Prints the serialized version of this TreeMap to stdout

### `[INTERNAL] LeafNode`

The internal generic class for defining a node within the binary tree. It
maintains a key of generic type K, the associated data of type T, and the
references to it's parent and descendents which are other LeafNodes within the
tree similar to a Linked List Node.

### `StopSearchException`

Exception to throw inside a custom traversal function to cause an interrupt that
terminates the search algorithm and returns immediately. `StopSearchException`
extends the built-in `Error` class.

**`constructor(message?: string): new StopSearchException`**

Creates a new `StopSearchException` object. If a `message` is provided it will
be passed to the Error superclass upon instantiation. The message currently has
no effect or use.

Examples:

```js
// 1. No message (default returns Exception name)
throw new StopSearchException();

// 2. Custom message
throw new StopSearchException("Custom Message");
```

</details>

## Vulnerability Report

| Vulnerability |       PKG        | Category |     In Production Pkg?      | Notes                                                                  |
| ------------- | :--------------: | :------: | :-------------------------: | ---------------------------------------------------------------------- |
| RegExp DoS    | trim\\@&lt;0.0.3 |   High   | No _(DevDependency/Linter)_ | waiting for remark-parse\\@^9.x.x release, owner will not patch v8.0.3 |

## Contributors

PR's & Issue contributions welcome! Please adhere to
[contributing guidelines](https://github.com/codejedi365/treemap-js/blob/main/CONTRIBUTING.md)
or your submission will be closed.

<!-- ## Future Features -->

<!-- ## Extras -->

Check out my other projects at [@codejedi365](https://github.com/codejedi365) on
GitHub.com
