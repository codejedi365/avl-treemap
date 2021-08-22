/**
 * ----------------------------------------------------------------------------
 * TreeMap Utility
 * AVL Tree Balancing + KeyValMapping as Tree.fetch(key) returns tNode.data
 * codejedi365 | MIT License | 22 Aug 2021
 * ----------------------------------------------------------------------------
 */

// DISABLE LINT REASON: Need to set private class of node for tree class
/* eslint-disable max-classes-per-file */

/**
 * Defined constants to define supported search algorithms for traversing
 * a binary tree.
 */
export enum TreeAlgorithm {
  DFS, // Depth First Search
  BFS // Breadth First Search
}

/**
 * Internal generic class for defining a node within the binary tree.
 * It maintains a key of generic type K, the associated data of type T,
 * and the references to it's parent and descendents which are other
 * LeafNodes within the tree similar to a Linked List Node.
 */
class LeafNode<K, T> {
  /**
   * Key value of generic type K
   */
  key: K;
  /**
   * Reference to stored data structure of generic type T
   */
  data: T;
  /**
   * Reference to parent node if exists, otherwise `NULL`
   */
  parent: LeafNode<K, T> | null;
  /**
   * Reference to left side descendent if exists, otherwise `NULL`
   */
  left: LeafNode<K, T> | null;
  /**
   * Reference to right side descendent if exists, otherwise `NULL`
   */
  right: LeafNode<K, T> | null;

  /**
   * `LeafNode` Object Constructor
   * @param key value used for tree sorting of generic type T
   * @param data mapped data value of generic type K
   * @param parent [Optional] reference to ancestor node or `NULL`
   * @param left [Optional] reference to left descendent node or `NULL`
   * @param right [Optional] reference to right descendent node or `NULL`
   *
   * Example Use:
   * ```ts
   *   // 1. Unconnected Node
   *   const leaf = new LeafNode<K, T>(key, data);
   *   // 2. Node with previous leaf as parent
   *   const leaf2 = new LeafNode<K, T>(key, data, leaf);
   *   // 3. New root node
   *   // WARN: Does not update other leaves, nor consider tree sorting
   *   const rootLeaf = new LeafNode<K, T>(key, data, null, leaf, leaf2);
   * ```
   */
  constructor(
    key: K,
    data: T,
    parent: LeafNode<K, T> | null = null,
    left: LeafNode<K, T> | null = null,
    right: LeafNode<K, T> | null = null
  ) {
    this.key = key;
    this.data = data;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }

  /**
   * Calculated attribute for the maximum number of known descendents of a LeafNode.
   * Value is based on the side with `maximum(number of descendents) + 1`.
   * Value ranges from `0-N` where `0` is when the LeafNode has 0 descendents 
   */
  get height(): number {
    if (this.left === null && this.right === null) {
      return 0;
    }
    return 1 + Math.max(this.left?.height || 0, this.right?.height || 0);
  }

  /**
   * `Function` to set the `LeafNode.parent` attribute
   * @param node parent LeafNode to reference or `NULL`
   * @returns this node with parent attribute set
   */
  setParent(node?: LeafNode<K, T> | null): LeafNode<K, T> {
    this.parent = !node ? null : node;
    return this;
  }

  /**
   * `Function` to quickly prune all external LeafNode references
   * @returns this node without a `parent` or descendents (`left` or `right`)
   */
  strip(): LeafNode<K, T> {
    this.parent = null;
    this.left = null;
    this.right = null;
    return this;
  }

  /**
   * `Function` to create a shallow copy of the current LeafNode
   * @returns a new LeafNode reference object
   */
  clone(): LeafNode<K, T> {
    return new LeafNode<K, T>(
      this.key,
      this.data,
      this.parent,
      this.left,
      this.right
    );
  }

  /**
   * `Function` to convert object to human readable representation
   * @override `Object.toString()`
   * @returns string in format `key=data`
   */
  toString(): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${this.key}='${this.data}'`;
  }
}

/**
 * `Error`: Exception to throw inside a custom traversal function to terminate search algorithm
 */
export class StopSearchException extends Error {
  /**
   * `StopSearchException` Object Constructor
   * @param message [Optional] string to pass to Error class
   * ```ts
   *    // 1. No message (default returns Exception name)
   *    throw new StopSearchException();
   *    // 2. Custom message
   *    throw new StopSearchException("Custom Message");
   * ```
   */
  constructor(message?: string) {
    super(message || StopSearchException.name);
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, StopSearchException);
    } else {
      this.stack = new Error().stack;
    }
  }
}

/**
 * The `TreeMap` class merges the functionality of key=>value pairs with the
 * sorting power of an AVL Tree. An AVL Tree is a derivative of the Binary
 * Search Tree (BST) which self-balances its subtrees to achieve reliable
 * *O(log n)* on the core lookup, insertion, & deletion functions.
 * 
 * At any one time, the heights of the two child subtrees of any node differ by
 * at most 1 due to rebalancing that occurs upon insertion & deletion when the
 * tree becomes unbalanced. The AVL data structure was designed and named after
 * the inventors Georgy Adelson-Velsky & Evgenii Landis.
 * 
 * This `TreeMap` class uses the object `compare()` method to sort the LeafNode
 * keys upon insertion. The associated value in the key-value pair is stored in
 * the same node as its key via `add(key, value)` function.
 * 
 * The TreeMap is implemented to support generic types provided at the `new`
 * construction of the TreeMap object. See the `constructor()` function for
 * examples.
 * 
 * The class provides default a `compare()` function to sort keys of either
 * `typeof number` or `typeof string`.  See the `compare()` function for further
 * explanation. You must override this function to specify a different ordering
 * scheme or handle different `typeof key` sorting. Ordering schemes & sort will
 * effect how nodes are searched and ordered when extracted from the data
 * structure. For the best performance, using a key with `typeof number` is the
 * fastest, then `typeof string`, and lastly a custom object comparator.  With
 * this in mind, if you are attempting to sort lots of objects, you should 
 * extract/derive an unique numeric `id` or string `UUID` as the key to the
 * `key=>value` pair that you insert into the tree where your value is the
 * object you are attempting to sort and store.
 */
export class TreeMap<K, T> {
  /**
   * Internal member to reference highest anscestor of the data.
   * This LeafNode is from where all search algorithm's start and
   * is the relative center of the data if tree is fully balanced.
   */
  private root: LeafNode<K, T> | null;
  /**
   * Enum to specify which search algorithm to use by default
   */
  defaultAlgorithm: TreeAlgorithm;

  /**
   * `TreeMap` Object Constructor
   * 
   * `[DEFAULT]` Search Algorithm = Depth-First Search (DFS)
   * 
   * Example use:
   * ```ts
   *    // 1. Explicit type mapping
   *    const numbertree = new TreeMap<number, object>();
   *    // 2. Dynamic type mapping
   *    const key: string = "alphanumeric";
   *    const data: number = 1;
   *    const treemap = new TreeMap<typeof key, typeof data>();
   * ```
   */
  constructor() {
    this.root = null;
    this.defaultAlgorithm = TreeAlgorithm.DFS;
  }

  /**
   * `Function` to find the value of the first key in the dataset determined
   * by the depth-first search algorithm
   * @returns the value
   */
  first(): T | false {
    const nodeCapture = this.dfTraversal(
      (node: LeafNode<K, T>, captureArray: T[]) => {
        captureArray.push(node.data);
        throw new StopSearchException("Found First Node's Data!");
      }
    );
    return nodeCapture.length > 0 ? nodeCapture[0] : false;
  }

  /**
   * `Function` to find the first key in the dataset determined via the
   * depth-first search algorithm
   * @returns the key
   */
  firstKey(): K | false {
    const nodeCapture = this.dfTraversal(
      (node: LeafNode<K, T>, captureArray: K[]) => {
        captureArray.push(node.key);
        throw new StopSearchException("Found First Node's Key!");
      }
    );
    return nodeCapture.length > 0 ? nodeCapture[0] : false;
  }

  /**
   * `Function` to find the value with the last key in the dataset 
   * determined by the depth-first search algorithm
   * @returns the value
   */
  last(): T | false {
    const values = this.dfsValues();
    return values.pop() || false;
  }

  /**
   * `Function` to find the last key in the dataset determined via the
   * depth-first search algorithm
   * @returns the key
   */
  lastKey(): K | false {
    const keys = this.dfsKeys();
    return keys.pop() || false;
  }

  /**
   * `Function` to find the value/data of the key=>value pair contained
   * in the tree's nodes which matches the specified key
   * @param key the key to search for
   * @returns the data stored by the specified key
   */
  fetch(key: K): T | null {
    const testNode = new LeafNode(key, null);
    const n = !this.root
      ? null
      : TreeMap.binarySearch(this.compare, this.root, testNode);
    return n != null ? n.data : null;
  }

  /**
   * `Function` to determine if a specified key is in the TreeMap
   * @param key the key to search for
   * @returns `True` if key exists, otherwise `False`
   */
  isKey(key: K): boolean {
    const testNode = new LeafNode(key, null);
    const n = !this.root
      ? null
      : TreeMap.binarySearch(this.compare, this.root, testNode);
    return n != null;
  }

  /**
   * `Function` to return all keys in the TreeMap according to the set
   * `defaultAlgorithm`.
   * @returns an array of all keys
   */
  keys(): K[] {
    return this.defaultAlgorithm === TreeAlgorithm.DFS
      ? this.dfsKeys()
      : this.bfsKeys();
  }

  /**
   * `Function` to return all keys in the TreeMap defined by a Depth-First Search
   * regardless of the value of `treemap.defaultAlgorithm`.
   * @returns an array of all keys in DFS order
   */
  dfsKeys(): K[] {
    return this.dfTraversal<K>((node: LeafNode<K, T>, captureArray: K[]) => {
      captureArray.push(node.key);
    });
  }

  /**
   * `Function` to return all keys in the TreeMap defined by a Breadth-First Search
   * regardless of the value of `treemap.defaultAlgorithm`.
   * @returns an array of all keys in BFS order
   */
  bfsKeys(): K[] {
    return this.bfTraversal<K>((node: LeafNode<K, T>, captureArray: K[]) => {
      captureArray.push(node.key);
    });
  }

  /**
   * `Function` to return all values in the TreeMap according to the order of
   * keys found via the set `defaultAlgorithm`.
   * @returns an array of all values
   */
  values(): T[] {
    return this.defaultAlgorithm === TreeAlgorithm.DFS
      ? this.dfsValues()
      : this.bfsValues();
  }

  /**
   * `Function` to return all values in the TreeMap defined by a Depth-First Search
   * of the associated keys regardless of the value of `treemap.defaultAlgorithm`.
   * @returns an array of all values based on DFS order
   */
  dfsValues(): T[] {
    return this.dfTraversal<T>((node: LeafNode<K, T>, captureArray: T[]) => {
      captureArray.push(node.data);
    });
  }

  /**
   * `Function` to return all values in the TreeMap defined by a Breadth-First Search
   * of the associated keys regardless of the value of `treemap.defaultAlgorithm`.
   * @returns an array of all values based on BFS order
   */
  bfsValues(): T[] {
    return this.bfTraversal<T>((node: LeafNode<K, T>, captureArray: T[]) => {
      captureArray.push(node.data);
    });
  }

  /**
   * `Function` to return all key-value pairs as an entry `[key, value]` according
   * to the order of keys found via the set `defaultAlgorithm`.
   * @returns an array of all key-value pairs
   */
  allEntries(): [K, T][] {
    return this.defaultAlgorithm === TreeAlgorithm.DFS
      ? this.dfsEntries()
      : this.bfsEntries();
  }

  /**
   * `Function` to return all key-value pairs as an entry `[key, value]` according
   * to the order of a Depth-First Search, regardless of the value of
   * `treemap.defaultAlgorithm`.
   * @returns an array of all key-value pairs based on DFS order
   */
  dfsEntries(): [K, T][] {
    return this.dfTraversal<[K, T]>(
      (node: LeafNode<K, T>, captureArray: [K, T][]) => {
        captureArray.push([node.key, node.data]);
      }
    );
  }

  /**
   * `Function` to return all key-value pairs as an entry `[key, value]` according
   * to the order of a Breadth-First Search, regardless of the value of
   * `treemap.defaultAlgorithm`.
   * @returns an array of all key-value pairs based on BFS order
   */
  bfsEntries(): [K, T][] {
    return this.bfTraversal<[K, T]>(
      (node: LeafNode<K, T>, captureArray: [K, T][]) => {
        captureArray.push([node.key, node.data]);
      }
    );
  }

  /**
   * `Function` to count the number of nodes in the Tree
   * @returns the number of nodes in the TreeMap, `0` if empty
   */
  size(): number {
    return this.keys().length;
  }

  /**
   * `Function` to count the number of layers in the Tree
   * @returns the number of layers in the TreeMap, `0` if empty
   */
  height(): number {
    return !this.root ? 0 : this.root.height + 1;
  }

  /**
   * `[INTERNAL]` `Function` to traverse a Binary Search Tree (BST) looking for the
   * existance of a key and returning that node when found. It uses the `compare()`
   * function to take the shortest route to where a key should exist since the
   * dataset is guaranteed to be sorted.
   * @param compareFn A Function which determines traversal direction & a successful find
   * @param head The LeafNode from which to start a search through the descendents
   * @param node A LeafNode with a specified `key`, `data` is ignored.
   * @returns The LeafNode found or `NULL`
   */
  private static binarySearch<K, T>(
    compareFn: (n1: LeafNode<K, T>, n2: LeafNode<K, T | null>) => -1 | 0 | 1,
    head: LeafNode<K, T> | null,
    node: LeafNode<K, T | null>
  ): LeafNode<K, T> | null {
    if (!head) {
      return null;
    }
    const comparison = compareFn(head, node);
    switch (comparison) {
      case -1:
        return TreeMap.binarySearch(compareFn, head.left, node);
      case 1:
        return TreeMap.binarySearch(compareFn, head.right, node);
      default:
        return head;
    }
  }

  /**
   * `[INTERNAL]` `Function` to insert a given LeafNode into the TreeMap in the
   * correct position based upon the tree's `compare()` function
   * @param tree the TreeMap instance to insert given leave into
   * @param leaf the LeafNode to insert
   * @param skipBalance internal flag determining if tree should be balanced
   *                    after insertion of node
   * @returns `True` if successful, otherwise `False`
   */
  private static insert<K, T>(
    tree: TreeMap<K, T>,
    leaf: LeafNode<K, T>,
    skipBalance: boolean
  ): boolean {
    // Internal Recursive function
    function compareNInsert(
      tmap: TreeMap<K, T>,
      head: LeafNode<K, T>,
      floatingLeaf: LeafNode<K, T>
    ): boolean {
      const node = head;
      const comparison = tmap.compare(node, floatingLeaf);
      if (comparison > 0) {
        if (node.right !== null) {
          compareNInsert(tmap, node.right, floatingLeaf);
        } else {
          node.right = floatingLeaf;
          floatingLeaf.setParent(node);
        }
      } else if (comparison < 0) {
        if (node.left !== null) {
          compareNInsert(tmap, node.left, floatingLeaf);
        } else {
          node.left = floatingLeaf;
          floatingLeaf.setParent(node);
        }
      } else {
        node.data = floatingLeaf.data;
        return false;
      }
      return skipBalance ? false : TreeMap.balanceTree(tmap, node);
    }

    if (!tree.root) {
      TreeMap.setRoot(tree, leaf);
      return true;
    }
    return compareNInsert(tree, tree.root, leaf);
  }

  /**
   * `Function` creates and inserts a key=>value node into the TreeMap
   * @param key the key to sort by
   * @param value the data to store
   * @returns this TreeMap instance for chaining
   */
  add(key: K, value: T): TreeMap<K, T> {
    const newNode = new LeafNode<K, T>(key, value);
    TreeMap.insert(this, newNode, false);
    return this;
  }

  /**
   * `Function` to merge 2 TreeMaps into 1.
   * 
   * WARNING: Node keys in the provided tree that match keys in this tree will
   * be overwritten with the data in the provided tree.
   * @param tree the tree of nodes to merge into this tree
   * @returns this adjusted TreeMap instance for chaining, or `False` on failure
   */
  merge(tree: TreeMap<K, T>): TreeMap<K, T> | false {
    return Object.getPrototypeOf(tree) === Object.getPrototypeOf(this)
      ? TreeMap.insertSubtree(this, tree)
      : false;
  }

  /**
   * `Function` to remove a node and return the associated data based on a given key
   * @param key the key that identifies the node
   * @returns the data stored or false if key is not found
   */
  remove(key: K): T | false {
    const testNode = new LeafNode(key, null);
    const n = TreeMap.binarySearch(this.compare, this.root, testNode);
    if (n === null) return false;

    while (n.left !== null || n.right !== null) {
      // Shift tree to move node to deepest depth aka the bottom of the tree
      const isLeftSideHeavier = TreeMap.calcBalanceFactor(n) > 0;
      if (isLeftSideHeavier) {
        // Left side heavier, move node to right side
        TreeMap.rotationRight(this, n, true);
      } else {
        // Balanced tree || Right side heavier, choose to move node to the left side
        TreeMap.rotationLeft(this, n, true);
      }
    }

    let { parent } = n;
    if (parent === null) {
      // node removed is last on tree, which means it is also the root
      this.root = null;
      return n.data;
    }
    if (parent.left === n) {
      parent.left = null;
    } else {
      parent.right = null;
    }

    if (parent.height > 0) {
      TreeMap.balanceTree(this, parent);
    }

    if (parent.parent == null) {
      TreeMap.setRoot(this, parent);
    } else {
      while (parent.parent != null) {
        parent = parent.parent;
        TreeMap.balanceTree(this, parent);
      }
    }

    return n.data;
  }

  /**
   * `Function` to quickly remove all nodes & values
   * @returns this empty TreeMap for chaining
   */
  removeAll(): TreeMap<K, T> {
    return TreeMap.setRoot(this, null);
  }

  /**
   * `Function` to perform a Depth-First traversal across the TreeMap and perform
   * a custom programable operation as each node is visited.
   * 
   * To interrupt and return from the DFS with the data collected, the `nodeHanlderFn`
   * can throw a `StopSearchException` which will be caught by this function and the
   * persistent array of collected data returned.
   * 
   * For Typescript, the generic type R should be provided to define the type of the
   * objects that exist in the array that will be returned from this function. It is
   * guaranteed to be an array by this function definition.
   * 
   * @param nodeHandlerFn custom function to call on each node.  It is passed the
   *                      current node and the persistent array that can store data
   *                      across each traversal of a node.
   * @returns an array of custom objects user defined
   */
  dfTraversal<R>(
    nodeHandlerFn: (
      this: TreeMap<K, T>,
      head: LeafNode<K, T>,
      visited: R[]
    ) => void
  ): R[] {
    const visited: R[] = [];
    if (typeof nodeHandlerFn !== "function" || this.root === null) {
      return visited;
    }

    function depthFirstDig(tree: TreeMap<K, T>, head: LeafNode<K, T>): void {
      if (head.left == null && head.right == null) {
        nodeHandlerFn.call(tree, head, visited);
      } else {
        if (head.left != null) {
          depthFirstDig(tree, head.left);
        }
        nodeHandlerFn.call(tree, head, visited);
        if (head.right != null) {
          depthFirstDig(tree, head.right);
        }
      }
    }

    try {
      depthFirstDig(this, this.root);
    } catch (err) {
      if (!(err instanceof StopSearchException)) throw err;
    }
    return visited;
  }

  /**
   * `Function` to perform a Breadth-First traversal across the TreeMap and perform
   * a custom programable operation as each node is visited.
   * 
   * To interrupt and return from the BFS with the data collected, the `nodeHanlderFn`
   * can throw a `StopSearchException` which will be caught by this function and the
   * persistent array of collected data returned.
   * 
   * For Typescript, the generic type R should be provided to define the type of the
   * objects that exist in the array that will be returned from this function. It is
   * guaranteed to be an array by this function definition.
   * 
   * @param nodeHandlerFn custom function to call on each node.  It is passed the
   *                      current node and the persistent array that can store data
   *                      across each traversal of a node.
   * @returns an array of custom objects user defined
   */
  bfTraversal<R>(
    nodeHandlerFn: (
      this: TreeMap<K, T>,
      currentNode: LeafNode<K, T>,
      visited: R[],
      depth: number
    ) => void
  ): R[] {
    const visited: R[] = [];
    if (typeof nodeHandlerFn !== "function" || this.root == null) {
      return visited;
    }

    function breadthFirstDig(
      tree: TreeMap<K, T>,
      head: LeafNode<K, T>,
      depth?: number
    ): void {
      if (depth === undefined) {
        // Tree root given
        // Breath-First-Search starts with depth = 0
        let startDepth = 0;
        while (startDepth <= head.height) {
          breadthFirstDig(tree, head, startDepth++);
        }
      } else if (depth === 0) {
        // depth = 0
        nodeHandlerFn.call(tree, head, visited, depth);
      } else {
        if (head.left != null) {
          breadthFirstDig(tree, head.left, depth - 1);
        }
        if (head.right != null) {
          breadthFirstDig(tree, head.right, depth - 1);
        }
      }
    }

    try {
      breadthFirstDig(this, this.root);
    } catch (err) {
      if (!(err instanceof StopSearchException)) throw err;
    }
    return visited;
  }

  /**
   * `[INTERNAL]` `Function` to take a defined node and return it as its own subtree.
   * 
   * **WARNING: It does not perform any action on the current tree context so this
   * returned object will not reference the previous tree but the previous tree
   * will have a reference to the root node of this tree.**
   * 
   * See `TreeMap.nakedClone()` for additional details
   * 
   * @param start a LeafNode that will be the new root node
   * @returns newly cloned TreeMap with start as the root node
   */
  private sliceTree(start: LeafNode<K, T>): TreeMap<K, T> {
    const newTree: TreeMap<K, T> = TreeMap.nakedClone(this);
    return TreeMap.setRoot(newTree, start);
  }

  /**
   * `Function` to take a specific key and create a shallow cloned subtree of that portion
   * of the tree. The new TreeMap will have a root node of the node found from the provided
   * and all of its descendants. It will also duplicate the original configuration of the
   * parent tree.  See `sliceTree()` for details.
   * 
   * **WARNING: This is a shallow copy of the descendents, it is up to the
   * user to remove the reference in the parent tree to this subtree.**
   * @param start a key that matches a LeafNode within the current tree
   * @returns a new TreeMap instance from a portion of the current tree or `False` if key
   *          was not found.
   */
  subtree(start: K): TreeMap<K, T> | false {
    const subRoot = TreeMap.binarySearch(
      this.compare,
      this.root,
      new LeafNode(start, null)
    );
    return subRoot === null ? false : this.sliceTree(subRoot);
  }

  /**
   * `[INTERNAL]` `Function` to modify the tree's root node reference
   * @param tree a TreeMap instance to modify
   * @param newRoot A LeafNode or `NULL` to set this tree's root node to
   * @returns this TreeMap for function chaining
   */
  private static setRoot<K, T>(
    tree: TreeMap<K, T>,
    newRoot: LeafNode<K, T> | null
  ): TreeMap<K, T> {
    const t = tree;
    t.root = !newRoot ? null : newRoot.setParent();
    return tree;
  }

  /**
   * `[INTERNAL]` `Function` to calcuate the numeric value of how unbalanced the
   * subtree's of a node are in relation to the height of the child nodes
   * @param node the target LeafNode to calculate the difference in its `left`
   *             & `right` descendent node heights
   * @returns the numeric difference in heights of descendent subtrees
   */
  private static calcBalanceFactor<K, T>(node: LeafNode<K, T> | null): number {
    return !node
      ? 0
      : ((head: LeafNode<K, T>) => {
          const leftSubTreeHeight =
            head.left != null ? head.left.height + 1 : 0;
          const rightSubTreeHeight =
            head.right != null ? head.right.height + 1 : 0;
          return leftSubTreeHeight - rightSubTreeHeight;
        })(node);
  }

  /**
   * `[INTERNAL]` `Function` to determine if tree is off-balance and if so
   * apply a rotation to the internal nodes of the tree in order to make the
   * descendent subtree's balanced.
   * @param tree the TreeMap instance to perform the balance action
   * @param head a LeafNode of provided `tree` to apply the balancing action upon.
   *             If not provided, the default is `tree.root`.
   * @returns `True` if balance succeeded, otherwise `False`
   */
  private static balanceTree<K, T>(
    tree: TreeMap<K, T>,
    head?: LeafNode<K, T>
  ): boolean {
    const node = !head ? tree.root : head;
    const unbalancedFactor = TreeMap.calcBalanceFactor(node);
    if ((-1 <= unbalancedFactor && unbalancedFactor <= 1) || node === null) {
      // defines interval or values -1,0,1
      return false;
    }
    if (unbalancedFactor === 2) {
      const isChildLeftDominant = TreeMap.calcBalanceFactor(node.left) === 1;
      if (isChildLeftDominant) {
        TreeMap.rotationRight(tree, node);
      } else {
        node.left = TreeMap.rotationLeft(tree, node.left!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        TreeMap.rotationRight(tree, node);
      }
    } else if (unbalancedFactor === -2) {
      const isChildLeftDominant = TreeMap.calcBalanceFactor(node.right) === 1;
      if (isChildLeftDominant) {
        node.right = TreeMap.rotationRight(tree, node.right!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        TreeMap.rotationLeft(tree, node);
      } else {
        TreeMap.rotationLeft(tree, node);
      }
    }
    return true;
  }

  /**
   * `[INTERNAL]` `Function` to perform a node rotation on a set of internal nodes.
   * This is the primary feature of a self-balancing AVL tree which it disconnects
   * and rearranges the node references to rebuild the most efficient node structure
   * for traversal, insertion, & removal.
   * 
   * Primarily `rotateLeft()` & `rotateRight()` are the higher level functions that
   * rely on this function and these should be called instead of this one.
   * 
   * @param tree the TreeMap instance to which perform the rotation on
   * @param descendingNode the LeafNode to which to demote to a lower descendent
   * @param risingNode the LeafNode to which to promote to the higher ancestor
   * @param skipBalance Boolean flag for toggling autobalancing.
   *                    Default is to autobalance
   * @returns a reference to the highest level ancester node
   */
  private static rotate<K, T>(
    tree: TreeMap<K, T>,
    descendingNode: LeafNode<K, T>,
    risingNode: LeafNode<K, T>,
    skipBalance: boolean
  ) {
    const oldHead = descendingNode;
    const parentNode = oldHead.parent; // Capture original parent

    // 1. Capture newHead as a subtree
    const newHeadTree = tree.sliceTree(risingNode);
    // 2. Disconnect newHead from oldHead node after determining which side is the newHead
    const isLeftSideRising = oldHead.left === risingNode;
    if (isLeftSideRising) {
      oldHead.left = null;
    } else {
      oldHead.right = null;
    }
    // 3. Create subtree for what is remaining of oldHead's descendants
    const oldHeadSubtree = tree.sliceTree(oldHead);
    if (!skipBalance) {
      // 3.5 Rebalance oldHead's partial tree since it just lost its right side
      TreeMap.balanceTree(oldHeadSubtree);
    }
    // 4. Re-Insert oldHead's rebalanced subtree onto newHead's subtree while keeping rest of references in-tact
    // IF FLAG set False, balancing will happen recursively from insertion point up the subtree
    TreeMap.insert(newHeadTree, oldHeadSubtree.root!, skipBalance); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    // 5. set newCompleteSubtree.root's parent as oldHead's parent
    const newHeadNode = newHeadTree.root!.setParent(parentNode); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    // 6. Glue newHead & its subtree into complete tree
    if (parentNode !== null) {
      // previous Head was not root (which means newHead is not the new root)
      const isLeftSideDescendent = parentNode.left === oldHead;
      if (isLeftSideDescendent) {
        parentNode.left = newHeadNode;
      } else {
        parentNode.right = newHeadNode;
      }
    } else {
      TreeMap.setRoot(tree, newHeadNode);
    }
    return newHeadNode;
  }

  /**
   * `[INTERNAL]` `Function` to perform a counter-clockwise rotation of the provided `head`.
   * This will move the right child up into the position of the given `head`
   * @param tree the TreeMap instance to which perform the rotation on
   * @param head the LeafNode to which to force to descend down the BST.
   * @param skipBalance Boolean flag for toggling autobalancing.
   *                    Default is to autobalance
   * @returns a reference to the node that rose up into the provided `head`'s place
   */
  private static rotationLeft<K, T>(
    tree: TreeMap<K, T>,
    head: LeafNode<K, T>,
    skipBalance = false
  ): LeafNode<K, T> {
    if (!head.right) {
      throw new Error(
        "RotateLeft() should not be happening if right child is null."
      );
    }
    return TreeMap.rotate(tree, head, head.right, skipBalance);
  }

  /**
   * `[INTERNAL]` `Function` to perform a clockwise rotation of the provided `head`.
   * This will move the left child up into the position of the given `head`
   * @param tree the TreeMap instance to which perform the rotation on
   * @param head the LeafNode to which to force to descend down the BST.
   * @param skipBalance Boolean flag for toggling autobalancing.
   *                    Default is to autobalance
   * @returns a reference to the node that rose up into the provided `head`'s place
   */
  private static rotationRight<K, T>(
    tree: TreeMap<K, T>,
    head: LeafNode<K, T>,
    skipBalance = false
  ): LeafNode<K, T> {
    if (!head.left) {
      throw new Error(
        "RotateRight() should not be happening if left child is null."
      );
    }
    return TreeMap.rotate(tree, head, head.left, skipBalance);
  }

  /**
   * `[INTERNAL]` `Function` to disect the `srcTree` instance and incrementally
   * insert the nodes smartly into the `targetTree`.  The Nodes themselves are
   * deeply copied but the key and data fields will still be referencing the
   * same object.
   * 
   * If the srcTree has a key that matches an existing key in the targetTree,
   * the targetTree's data for that key's node will be overwritten.
   * 
   * @param targetTree the destination TreeMap instance
   * @param srcTree the TreeMap instance in which to pull key/value's from
   * @returns the original targetTree instance with the nodes of the source included
   */
  private static insertSubtree<K, T>(
    targetTree: TreeMap<K, T>,
    srcTree: TreeMap<K, T>
  ): TreeMap<K, T> {
    srcTree.bfTraversal((currentNode) => {
      const detachedLeaf = new LeafNode<K, T>(
        currentNode.key,
        currentNode.data
      );
      TreeMap.insert(targetTree, detachedLeaf, false);
    });
    return targetTree;
  }

  /**
   * `Function` to define the sorting algorithm for nodes in this BST. This
   * is expected to be overriden by a users implementation unless they want
   * to use the default ascending numberic sorting or ascending ASCII string
   * sort (`0,1,2,...n` || `a,b,c,...z`).  Keys that are strings of numberic
   * values will be converted to numbers for comparison if they are both numeric.
   * 
   * If not overridden, this function passes the nodes off to the generic static
   * comparison function of the TreeMap class to perform the default action
   * 
   * If this function is overridden, it must return -1 || 0 || 1 to indicate to
   * the tree sorting algorithm whether to replace the current node, or which side
   * should it continue to traverse (-1 = left, 1 = right).
   * 
   * @param node1 base node in which to determine current position in tree
   * @param node2 node being evaluated for if it should be in front(left) or
   *              behind(right) the base node
   * @returns `-1` if node2 should be in to the left of node1, `+1` if on the right,
   *          or `0` if keys are equal
   */
  // eslint-disable-next-line class-methods-use-this
  compare(
    this: void,
    node1: LeafNode<K, T>,
    node2: LeafNode<K, T | null>
  ): -1 | 0 | 1 {
    return TreeMap.compare(node1, node2);
  }

  /**
   * `[INTERNAL]` `Function` to provide the default comparison function for the
   * most used key types and most desired human format "ascending".
   * 
   * Supports key types of string or number by default.
   * @param node1 base node in which to determine current position in tree
   * @param node2 node being evaluated for if it should be in front(left) or
   *              behind(right) the base node
   * @returns `-1` if node2 should be in to the left of node1, `+1` if on the right,
   *          or `0` if keys are equal
   */
  private static compare<K, T>(
    node1: LeafNode<K, T>,
    node2: LeafNode<K, T | null>
  ): -1 | 0 | 1 {
    /* eslint-disable no-nested-ternary */
    // REASON: Simple 3 result compare of less than, equal or greater indicated by -1 | 0 | 1
    if (!(Number.isNaN(node1.key) || Number.isNaN(node2.key))) {
      return node1.key > node2.key ? -1 : node1.key < node2.key ? 1 : 0;
    }
    if (typeof node1.key === "string" || node1.key instanceof String) {
      return node1.key > node2.key ? -1 : node1.key < node2.key ? 1 : 0;
    }
    return 1;
    /* eslint-enable no-nested-ternary */
  }

  /**
   * `[INTERNAL] Function` to create a bare cloned object without any nodes but
   * the same methods defined. The `defaultAlgorithm` attribute is duplicated
   * manually. This function is highly important to transfer the users defined
   * `compare()` & default search algorithm if it is defined.
   * @param tree the TreeMap object to duplicate
   * @returns an empty but cloned TreeMap with the same configuration
   */
  private static nakedClone<K, T>(tree: TreeMap<K, T>): TreeMap<K, T> {
    const clone = Object.create(Object.getPrototypeOf(tree)) as typeof tree;
    const keys = Object.getOwnPropertyNames(tree) as (keyof TreeMap<K, T>)[];
    keys.forEach((attr: keyof TreeMap<K, T>) => {
      if (typeof tree[attr] === "function") {
        const fnDef = { ...Object.getOwnPropertyDescriptor(tree, attr) };
        Object.defineProperty(clone, attr, fnDef);
      }
    });
    clone.defaultAlgorithm = tree.defaultAlgorithm;
    return clone;
  }

  /**
   * `Function` to convert TreeMap to human readable (serialized-like) representation
   * @override `Object.toString()`
   * @returns string in format `TreeMap:{ root:[key=value], dfs:[entry, ...] }`
   */
  toString(): string {
    if (!this.root) {
      return "TreeMap:{ root: NULL }";
    }
    const dfsString = this.dfTraversal<string>((currentNode, captureArray) => {
      captureArray.push(currentNode.toString());
    }).join(", ");
    return `TreeMap:{ root: [${this.root.toString()}], df:[${dfsString}] }`;
  }

  /**
   * `Function` to automatically print the serialized version of this TreeMap to stdout
   */
  print(): void {
    console.log(this.toString()); // eslint-disable-line no-console
  }
}

export default TreeMap;
