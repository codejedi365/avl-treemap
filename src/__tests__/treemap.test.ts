import { TreeMap, TreeAlgorithm } from "../treemap";

describe("treemap.ts", () => {
  let tmap: TreeMap<number, string>;
  const entry1Node: { key: number; data: string } = {
    key: 1,
    data: "one"
  };
  const entry2Node: { key: number; data: string } = {
    key: 2,
    data: "two"
  };
  const entry3Node: { key: number; data: string } = {
    key: 3,
    data: "three"
  };
  const entry4Node: { key: number; data: string } = {
    key: 4,
    data: "four"
  };
  const entry5Node: { key: number; data: string } = {
    key: 5,
    data: "five"
  };
  const entryOrder = [
    entry2Node,
    entry1Node,
    entry5Node,
    // Forces 2x rotates in opposite directions (next 2 steps)
    entry3Node,
    entry4Node
  ];

  beforeEach(() => {
    tmap = new TreeMap<number, string>();
    entryOrder.forEach((entryNode) => {
      tmap.add(entryNode.key, entryNode.data);
    });
  });

  it("first() returns first node's data", () => {
    expect(tmap.first()).toEqual(entry1Node.data);
  });

  it("firstKey() returns first node's key", () => {
    expect(tmap.firstKey()).toEqual(entry1Node.key);
  });

  it("last() returns last node's data", () => {
    expect(tmap.last()).toEqual(entry5Node.data);
  });

  it("lastKey() returns last node's key", () => {
    expect(tmap.lastKey()).toEqual(entry5Node.key);
  });

  it("fetch(key) returns specific key's data", () => {
    expect(tmap.fetch(entry1Node.key)).toEqual(entry1Node.data);
  });

  it("isKey(key) returns false when key does not exist", () => {
    expect(tmap.isKey(2.5)).toBeFalsy();
  });

  it("isKey(key) returns true when key exists", () => {
    expect(tmap.isKey(entry2Node.key)).toBeTruthy();
  });

  it("keys() returns list of keys in depth-first order by default", () => {
    expect(tmap.keys()).toEqual<(string | number)[]>([
      entry1Node.key,
      entry2Node.key,
      entry3Node.key,
      entry4Node.key,
      entry5Node.key
    ]);
  });

  it("keys() returns list of keys in breadth-first order when flag set to bfs", () => {
    tmap.defaultAlgorithm = TreeAlgorithm.BFS;
    expect(tmap.keys()).toEqual<(string | number)[]>([
      entry2Node.key,
      entry1Node.key,
      entry4Node.key,
      entry3Node.key,
      entry5Node.key
    ]);
  });

  it("dfsKeys() returns list of keys based on depth-first order", () => {
    expect(tmap.dfsKeys()).toEqual<(string | number)[]>([
      entry1Node.key,
      entry2Node.key,
      entry3Node.key,
      entry4Node.key,
      entry5Node.key
    ]);
  });

  it("bfsKeys() returns list of keys based on breadth-first order", () => {
    expect(tmap.bfsKeys()).toEqual<(string | number)[]>([
      entry2Node.key,
      entry1Node.key,
      entry4Node.key,
      entry3Node.key,
      entry5Node.key
    ]);
  });

  it("values() returns list of values in depth-first order by default", () => {
    expect(tmap.values()).toEqual<unknown[]>([
      entry1Node.data,
      entry2Node.data,
      entry3Node.data,
      entry4Node.data,
      entry5Node.data
    ]);
  });

  it("values() returns list of keys in breadth-first order when flag set to bfs", () => {
    tmap.defaultAlgorithm = TreeAlgorithm.BFS;
    expect(tmap.values()).toEqual<unknown[]>([
      entry2Node.data,
      entry1Node.data,
      entry4Node.data,
      entry3Node.data,
      entry5Node.data
    ]);
  });

  it("dfsValues() returns list of values based on depth-first order", () => {
    expect(tmap.dfsValues()).toEqual<unknown[]>([
      entry1Node.data,
      entry2Node.data,
      entry3Node.data,
      entry4Node.data,
      entry5Node.data
    ]);
  });

  it("bfsValues() returns list of values based on breadth-first order", () => {
    expect(tmap.bfsValues()).toEqual<unknown[]>([
      entry2Node.data,
      entry1Node.data,
      entry4Node.data,
      entry3Node.data,
      entry5Node.data
    ]);
  });

  it("allEntries() returns list of [key,data] entries in depth-first order by default", () => {
    expect(tmap.allEntries()).toEqual<[number, string][]>([
      [entry1Node.key, entry1Node.data],
      [entry2Node.key, entry2Node.data],
      [entry3Node.key, entry3Node.data],
      [entry4Node.key, entry4Node.data],
      [entry5Node.key, entry5Node.data]
    ]);
  });

  it("allEntries() returns list of [key,data] entries in breadth-first order when flat is set to bfs", () => {
    tmap.defaultAlgorithm = TreeAlgorithm.BFS;
    expect(tmap.allEntries()).toEqual<[number, string][]>([
      [entry2Node.key, entry2Node.data],
      [entry1Node.key, entry1Node.data],
      [entry4Node.key, entry4Node.data],
      [entry3Node.key, entry3Node.data],
      [entry5Node.key, entry5Node.data]
    ]);
  });

  it("dfsEntries() returns list of [key,data] entries based on depth-first order", () => {
    expect(tmap.dfsEntries()).toEqual<[number, string][]>([
      [entry1Node.key, entry1Node.data],
      [entry2Node.key, entry2Node.data],
      [entry3Node.key, entry3Node.data],
      [entry4Node.key, entry4Node.data],
      [entry5Node.key, entry5Node.data]
    ]);
  });

  it("bfsEntries() returns list of [key,data] entries based on breadth-first order", () => {
    expect(tmap.bfsEntries()).toEqual<[number, string][]>([
      [entry2Node.key, entry2Node.data],
      [entry1Node.key, entry1Node.data],
      [entry4Node.key, entry4Node.data],
      [entry3Node.key, entry3Node.data],
      [entry5Node.key, entry5Node.data]
    ]);
  });

  it("size() returns number of nodes in tree", () => {
    expect(tmap.size()).toEqual(entryOrder.length);
  });

  it("size() increases value as tree grows", () => {
    expect(tmap.size()).toEqual(entryOrder.length);
    tmap.add(0, "zero");
    expect(tmap.size()).toEqual(entryOrder.length + 1);
  });

  it("size() decreases value as tree grows", () => {
    expect(tmap.size()).toEqual(entryOrder.length);
    tmap.remove(entry1Node.key);
    expect(tmap.size()).toEqual(entryOrder.length - 1);
  });

  it("size() === 0 when tree is empty", () => {
    const emptyTree = new TreeMap();
    expect(emptyTree.size()).toEqual<number>(0);
  });

  it("removeAll() clears all nodes and returns empty tree", () => {
    const emptyTree = tmap.removeAll();
    expect(emptyTree).toEqual<typeof tmap>(tmap);
    expect(emptyTree.size()).toEqual<number>(0);
  });

  it("add(key, value) inserts node into tree", () => {
    const emptyTree = new TreeMap<number, string>();
    emptyTree.add(entry1Node.key, entry1Node.data);
    expect(emptyTree.size()).toEqual<number>(1);
    expect(emptyTree.isKey(entry1Node.key)).toBeTruthy();
    expect(emptyTree.fetch(entry1Node.key)).toEqual(entry1Node.data);
  });

  it("tree rotates left to ensure balance", () => {
    // add weight to right side
    tmap.add(6, "six");
    tmap.add(7, "seven");
    expect(tmap.bfsKeys()).toEqual<number[]>([4, 2, 6, 1, 3, 5, 7]);
  });

  it("tree rotates right to ensure balance", () => {
    // add weight to left side
    tmap.add(0, "zero");
    tmap.add(-1, "neg1");
    expect(tmap.bfsKeys()).toEqual<number[]>([2, 0, 4, -1, 1, 3, 5]);
  });

  it("merge(tree) combines 2 trees into 1 sorted representation", () => {
    const subtree = new TreeMap<number, string>();
    subtree.add(6, "six");
    subtree.add(7, "seven");
    tmap.merge(subtree);
    expect(tmap.dfsKeys()).toEqual<(string | number)[]>([
      entry1Node.key,
      entry2Node.key,
      entry3Node.key,
      entry4Node.key,
      entry5Node.key,
      6,
      7
    ]);
    expect(tmap.bfsKeys()).toEqual<(string | number)[]>([
      entry4Node.key,
      entry2Node.key,
      6,
      entry1Node.key,
      entry3Node.key,
      entry5Node.key,
      7
    ]);
  });

  it("remove(key) removes node based on key", () => {
    let prevSize = tmap.size();
    tmap.remove(entry1Node.key);
    expect(tmap.size()).toEqual<number>(--prevSize);
    expect(tmap.isKey(entry1Node.key)).toBeFalsy();
  });

  it("tree handles removal of root node", () => {
    let prevSize = tmap.size();
    tmap.remove(entry2Node.key);
    expect(tmap.size()).toEqual<number>(--prevSize);
    expect(tmap.isKey(entry2Node.key)).toBeFalsy();
    expect(tmap.dfsKeys()).toEqual<(string | number)[]>([
      entry1Node.key,
      entry3Node.key,
      entry4Node.key,
      entry5Node.key
    ]);
  });

  it("subtree(key) extracts subset of nodes as a tree representation", () => {
    /* eslint-disable @typescript-eslint/unbound-method */
    // REASON: We want to check the references of functions to ensure
    //         they point at the same function after a clone
    //-------------------------------------------------------
    // Setup: Using global tree which ensures target has 2 children
    // Execute function under test
    const subtree: typeof tmap | false = tmap.subtree(entry4Node.key);
    expect(subtree).toBeTruthy();

    // Inspect features of tree now that we know its a TreeMap
    const newPartialTree = subtree as typeof tmap;
    expect(newPartialTree.size()).toEqual(3);
    expect(newPartialTree.bfsEntries()).toEqual<[number, string][]>([
      [entry4Node.key, entry4Node.data], // root
      [entry3Node.key, entry3Node.data], // leftside of node 4
      [entry5Node.key, entry5Node.data] // rightside of node 4
    ]);
    expect(newPartialTree.compare).toEqual(tmap.compare);
    expect(newPartialTree.defaultAlgorithm).toEqual(tmap.defaultAlgorithm);
    expect(newPartialTree.toString).toEqual(tmap.toString);
    /* eslint-enable @typescript-eslint/unbound-method */
  });

  it.skip("custom compare() override", () => {
    //
  });

  it.skip("custom handler depth-first traversal", () => {
    //
  });

  it.skip("custom handler breadth-first traversal", () => {
    //
  });

  it("toString() creates a string representation", () => {
    expect(tmap.toString()).toEqual<string>(
      [
        "TreeMap:{",
        [
          `root: [${entry2Node.key}='${entry2Node.data}']`,
          `df:[${[
            `${Object.values(entry1Node).join("='")}'`,
            `${Object.values(entry2Node).join("='")}'`,
            `${Object.values(entry3Node).join("='")}'`,
            `${Object.values(entry4Node).join("='")}'`,
            `${Object.values(entry5Node).join("='")}'`
          ].join(", ")}]`
        ].join(", "),
        "}"
      ].join(" ")
    );
  });

  it.skip("print() outputs a string representation to the console", () => {
    // expect(tmap.print()).toEqual<string>(tmap.toString());
  });

  it.skip("pprint() outputs a pretty tree representation of tree to console", () => {
    // expect(tmap.pprint()).toEqual<string>([
    //
    // ].join("\n"));
  });
});
