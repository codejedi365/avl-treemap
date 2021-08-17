/**
 * TreeMap Utility
 * AVL Tree Balancing + KeyValMapping as Tree.fetch(key) returns tNode.data
 * codejedi365 | MIT License | 17 Aug 2021
 */

// DISABLE LINT REASON: Need to set private class of node for tree class
/* eslint-disable max-classes-per-file */

export enum TreeAlgorithm {
  DFS,
  BFS
}

class LeafNode<K, T> {
  key: K;

  data: T;

  parent: LeafNode<K, T> | null;

  left: LeafNode<K, T> | null;

  right: LeafNode<K, T> | null;

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

  get height(): number {
    if (this.left === null && this.right === null) {
      return 0;
    }
    return 1 + Math.max(this.left?.height || 0, this.right?.height || 0);
  }

  setParent(node?: LeafNode<K, T> | null): LeafNode<K, T> {
    this.parent = !node ? null : node;
    return this;
  }

  strip(): LeafNode<K, T> {
    this.parent = null;
    this.left = null;
    this.right = null;
    return this;
  }

  clone(): LeafNode<K, T> {
    return new LeafNode<K, T>(
      this.key,
      this.data,
      this.parent,
      this.left,
      this.right
    );
  }

  toString(): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${this.key}='${this.data}'`;
  }
}

export class StopSearchException extends Error {
  // name = "TreeMap.StopSearchException";

  constructor(message: string) {
    super(message);
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, StopSearchException);
    } else {
      this.stack = new Error().stack;
    }
  }
}

export class TreeMap<K, T> {
  private root: LeafNode<K, T> | null;

  defaultAlgorithm: TreeAlgorithm;

  constructor() {
    this.root = null;
    this.defaultAlgorithm = TreeAlgorithm.DFS;
  }

  first(this: TreeMap<K, T>): T | false {
    const nodeCapture = this.dfTraversal(
      (node: LeafNode<K, T>, captureArray: T[]) => {
        captureArray.push(node.data);
        throw new StopSearchException("Found First Node's Data!");
      }
    );
    return nodeCapture.length > 0 ? nodeCapture[0] : false;
  }

  firstKey(this: TreeMap<K, T>): K | false {
    const nodeCapture = this.dfTraversal(
      (node: LeafNode<K, T>, captureArray: K[]) => {
        captureArray.push(node.key);
        throw new StopSearchException("Found First Node's Key!");
      }
    );
    return nodeCapture.length > 0 ? nodeCapture[0] : false;
  }

  last(this: TreeMap<K, T>): T | false {
    const values = this.dfsValues();
    return values.pop() || false;
  }

  lastKey(this: TreeMap<K, T>): K | false {
    const keys = this.dfsKeys();
    return keys.pop() || false;
  }

  fetch(this: TreeMap<K, T>, key: K): T | null {
    const testNode = new LeafNode(key, null);
    const n = !this.root
      ? null
      : TreeMap.binarySearch(this.compare, this.root, testNode);
    return n != null ? n.data : null;
  }

  isKey(this: TreeMap<K, T>, key: K): boolean {
    const testNode = new LeafNode(key, null);
    const n = !this.root
      ? null
      : TreeMap.binarySearch(this.compare, this.root, testNode);
    return n != null;
  }

  keys(this: TreeMap<K, T>): K[] {
    return this.defaultAlgorithm === TreeAlgorithm.DFS
      ? this.dfsKeys()
      : this.bfsKeys();
  }

  dfsKeys(this: TreeMap<K, T>): K[] {
    return this.dfTraversal<K>((node: LeafNode<K, T>, captureArray: K[]) => {
      captureArray.push(node.key);
    });
  }

  bfsKeys(this: TreeMap<K, T>): K[] {
    return this.bfTraversal<K>((node: LeafNode<K, T>, captureArray: K[]) => {
      captureArray.push(node.key);
    });
  }

  values(this: TreeMap<K, T>): T[] {
    return this.defaultAlgorithm === TreeAlgorithm.DFS
      ? this.dfsValues()
      : this.bfsValues();
  }

  dfsValues(this: TreeMap<K, T>): T[] {
    return this.dfTraversal<T>((node: LeafNode<K, T>, captureArray: T[]) => {
      captureArray.push(node.data);
    });
  }

  bfsValues(this: TreeMap<K, T>): T[] {
    return this.bfTraversal<T>((node: LeafNode<K, T>, captureArray: T[]) => {
      captureArray.push(node.data);
    });
  }

  allEntries(this: TreeMap<K, T>): [K, T][] {
    return this.defaultAlgorithm === TreeAlgorithm.DFS
      ? this.dfsEntries()
      : this.bfsEntries();
  }

  dfsEntries(this: TreeMap<K, T>): [K, T][] {
    return this.dfTraversal<[K, T]>(
      (node: LeafNode<K, T>, captureArray: [K, T][]) => {
        captureArray.push([node.key, node.data]);
      }
    );
  }

  bfsEntries(this: TreeMap<K, T>): [K, T][] {
    return this.bfTraversal<[K, T]>(
      (node: LeafNode<K, T>, captureArray: [K, T][]) => {
        captureArray.push([node.key, node.data]);
      }
    );
  }

  size(this: TreeMap<K, T>): number {
    return this.keys().length;
  }

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

  add(this: TreeMap<K, T>, key: K, value: T): TreeMap<K, T> {
    const newNode = new LeafNode<K, T>(key, value);
    TreeMap.insert(this, newNode, false);
    // console.log(tmap.bfsKeys());
    return this;
  }

  merge(this: TreeMap<K, T>, tree: TreeMap<K, T>): TreeMap<K, T> | false {
    return Object.getPrototypeOf(tree) === TreeMap.prototype
      ? TreeMap.insertSubtree(this, tree)
      : false;
  }

  remove(this: TreeMap<K, T>, key: K): T | false {
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

  removeAll(this: TreeMap<K, T>): TreeMap<K, T> {
    return TreeMap.setRoot(this, null);
  }

  dfTraversal<R>(
    this: TreeMap<K, T>,
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

    function depthFirstDig(this: TreeMap<K, T>, head: LeafNode<K, T>): void {
      if (head.left == null && head.right == null) {
        nodeHandlerFn.call(this, head, visited);
      } else {
        if (head.left != null) {
          depthFirstDig.call(this, head.left);
        }
        nodeHandlerFn.call(this, head, visited);
        if (head.right != null) {
          depthFirstDig.call(this, head.right);
        }
      }
    }

    try {
      depthFirstDig.call(this, this.root);
    } catch (err) {
      if (!(err instanceof StopSearchException)) throw err;
    }
    return visited;
  }

  bfTraversal<R>(
    this: TreeMap<K, T>,
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
      this: TreeMap<K, T>,
      head: LeafNode<K, T>,
      depth?: number
    ): void {
      if (depth === undefined) {
        // Tree root given
        // Breath-First-Search starts with depth = 0
        let startDepth = 0;
        while (startDepth <= head.height) {
          breadthFirstDig.call(this, head, startDepth++);
        }
      } else if (depth === 0) {
        // depth = 0
        nodeHandlerFn.call(this, head, visited, depth);
      } else {
        if (head.left != null) {
          breadthFirstDig.call(this, head.left, depth - 1);
        }
        if (head.right != null) {
          breadthFirstDig.call(this, head.right, depth - 1);
        }
      }
    }

    try {
      breadthFirstDig.call(this, this.root);
    } catch (err) {
      if (!(err instanceof StopSearchException)) throw err;
    }
    return visited;
  }

  private sliceTree(this: TreeMap<K, T>, start: LeafNode<K, T>): TreeMap<K, T> {
    const newTree: TreeMap<K, T> = TreeMap.nakedClone(this);
    return TreeMap.setRoot(newTree, start);
  }

  subtree(this: TreeMap<K, T>, start: K): TreeMap<K, T> | false {
    const subRoot = TreeMap.binarySearch(
      this.compare,
      this.root,
      new LeafNode(start, null)
    );
    return subRoot === null ? false : this.sliceTree(subRoot);
  }

  private static setRoot<K, T>(
    tree: TreeMap<K, T>,
    newRoot: LeafNode<K, T> | null
  ): TreeMap<K, T> {
    const t = tree;
    t.root = !newRoot ? null : newRoot.setParent();
    return tree;
  }

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

  private static rotate<K, T>(
    tree: TreeMap<K, T>,
    descendingNode: LeafNode<K, T>,
    risingNode: LeafNode<K, T>,
    skipBalance: boolean
  ) {
    const oldHead = descendingNode;
    const parentNode = oldHead.parent; // Capture original parent

    // console.log(`Node[${oldHead.key}].Rotate()`);

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
    // console.log(
    //   [
    //     `[newHeadTree] bfsKeys = ${newHeadTree.bfsKeys().toString()}`,
    //     `[oldHeadSubtree] bfsKeys = ${oldHeadSubtree.bfsKeys().toString()}`
    //   ].join("\n")
    // );
    if (!skipBalance) {
      // 3.5 Rebalance oldHead's partial tree since it just lost its right side
      TreeMap.balanceTree(oldHeadSubtree);
    }
    // 4. Re-Insert oldHead's rebalanced subtree onto newHead's subtree while keeping rest of references in-tact
    // IF FLAG set False, balancing will happen recursively from insertion point up the subtree
    TreeMap.insert(newHeadTree, oldHeadSubtree.root!, skipBalance); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    // 5. set newCompleteSubtree.root's parent as oldHead's parent
    const newHeadNode = newHeadTree.root!.setParent(parentNode); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    // console.log(
    //   `[combinedHeadTree] bfsKeys = ${newHeadTree.bfsKeys().toString()}`
    // );
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
   *
   * @param tree
   * @param head
   * @param skipBalance Boolean flag for toggling autobalancing.
   *                    Default is to autobalance.
   * @returns
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

  private static insertSubtree<K, T>(
    targetTree: TreeMap<K, T>,
    srcTree: TreeMap<K, T>
  ): TreeMap<K, T> {
    const KEY = 0;
    const DATA = 1;
    const breadthFirstEntries = srcTree.bfsEntries();
    for (let k = 0; k < breadthFirstEntries.length; k++) {
      const detachedLeaf = new LeafNode<K, T>(
        breadthFirstEntries[k][KEY],
        breadthFirstEntries[k][DATA]
      );
      TreeMap.insert(targetTree, detachedLeaf, false);
    }
    return targetTree;
  }

  // eslint-disable-next-line class-methods-use-this
  compare(
    this: void,
    node1: LeafNode<K, T>,
    node2: LeafNode<K, T | null>
  ): -1 | 0 | 1 {
    return TreeMap.compare(node1, node2);
  }

  private static compare<K, T>(
    node1: LeafNode<K, T>,
    node2: LeafNode<K, T | null>
  ): -1 | 0 | 1 {
    /* eslint-disable no-nested-ternary */
    // REASON: Simple 3 result compare of less than, equal or greater indicated by -1 | 0 | 1
    if (!Number.isNaN(node1.key)) {
      return node1.key > node2.key ? -1 : node1.key < node2.key ? 1 : 0;
    }
    if (typeof node1.key === "string" || node1.key instanceof String) {
      return node1.key > node2.key ? -1 : node1.key < node2.key ? 1 : 0;
    }
    return 1;
    /* eslint-enable no-nested-ternary */
  }

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

  toString(this: TreeMap<K, T>): string {
    if (!this.root) {
      return "TreeMap:{ root: NULL }";
    }
    let str = "";
    const KEY = 0;
    const DATA = 1;
    const entries = this.allEntries();
    entries.forEach(
      (
        entry: [K & { toString: () => string }, T & { toString: () => string }],
        index: number
      ) => {
        str += `${index === 0 ? "" : ", "}`;
        str += `${entry[KEY].toString()}='${entry[DATA].toString()}'`;
      }
    );

    return `TreeMap:{ root: [${this.root.toString()}], df:[${str}] }`;
  }

  print(this: TreeMap<K, T>): void {
    process.stdout.write(this.toString());
  }

  /**
   * Pretty Print tree keys (multiline)
   */
  // pprint(): void {
  //   //
  // }
}

export default TreeMap;
