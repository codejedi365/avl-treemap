import { TreeMap, TreeAlgorithm } from "../treemap";

describe("treemap.ts", () => {
  let tmap: TreeMap<number, string>;
  const firstEntry: { key: number; data: string } = {
    key: 1,
    data: "left"
  };
  const rootEntry: { key: number; data: string } = {
    key: 2,
    data: "root"
  };
  const lastEntry: { key: number; data: string } = {
    key: 3,
    data: "right"
  };

  beforeEach(() => {
    tmap = new TreeMap<number, string>();
    tmap.add(rootEntry.key, rootEntry.data);
    tmap.add(firstEntry.key, firstEntry.data);
    tmap.add(lastEntry.key, lastEntry.data);
  });

  it("first() returns first node's data", () => {
    expect(tmap.first()).toEqual(firstEntry.data);
  });

  it("firstKey() returns first node's key", () => {
    expect(tmap.firstKey()).toEqual(firstEntry.key);
  });

  it("last() returns last node's data", () => {
    expect(tmap.last()).toEqual(lastEntry.data);
  });

  it("lastKey() returns last node's key", () => {
    expect(tmap.lastKey()).toEqual(lastEntry.key);
  });

  it("fetch(key) returns specific key's data", () => {
    expect(tmap.fetch(firstEntry.key)).toEqual(firstEntry.data);
  });

  it("isKey(key) returns false when key does not exist", () => {
    expect(tmap.isKey(4)).toBeFalsy();
  });

  it("isKey(key) returns true when key exists", () => {
    expect(tmap.isKey(rootEntry.key)).toBeTruthy();
  });

  it("keys() returns list of keys in depth-first order by default", () => {
    expect(tmap.keys()).toEqual<(string | number)[]>([
      firstEntry.key,
      rootEntry.key,
      lastEntry.key
    ]);
  });

  it("keys() returns list of keys in breadth-first order when flag set to bfs", () => {
    tmap.defaultAlgorithm = TreeAlgorithm.BFS;
    expect(tmap.keys()).toEqual<(string | number)[]>([
      rootEntry.key,
      firstEntry.key,
      lastEntry.key
    ]);
  });

  it("dfsKeys() returns list of keys based on depth-first order", () => {
    expect(tmap.dfsKeys()).toEqual<(string | number)[]>([
      firstEntry.key,
      rootEntry.key,
      lastEntry.key
    ]);
  });

  it("bfsKeys() returns list of keys based on breadth-first order", () => {
    expect(tmap.bfsKeys()).toEqual<(string | number)[]>([
      rootEntry.key,
      firstEntry.key,
      lastEntry.key
    ]);
  });

  it("values() returns list of values in depth-first order by default", () => {
    expect(tmap.values()).toEqual<unknown[]>([
      firstEntry.data,
      rootEntry.data,
      lastEntry.data
    ]);
  });

  it("values() returns list of keys in breadth-first order when flag set to bfs", () => {
    tmap.defaultAlgorithm = TreeAlgorithm.BFS;
    expect(tmap.values()).toEqual<unknown[]>([
      rootEntry.data,
      firstEntry.data,
      lastEntry.data
    ]);
  });

  it("dfsValues() returns list of values based on depth-first order", () => {
    expect(tmap.dfsValues()).toEqual<unknown[]>([
      firstEntry.data,
      rootEntry.data,
      lastEntry.data
    ]);
  });

  it("bfsValues() returns list of values based on breadth-first order", () => {
    expect(tmap.bfsValues()).toEqual<unknown[]>([
      rootEntry.data,
      firstEntry.data,
      lastEntry.data
    ]);
  });

  it("allEntries() returns list of [key,data] entries in depth-first order by default", () => {
    expect(tmap.allEntries()).toEqual<[number, string][]>([
      [firstEntry.key, firstEntry.data],
      [rootEntry.key, rootEntry.data],
      [lastEntry.key, lastEntry.data]
    ]);
  });

  it("allEntries() returns list of [key,data] entries in breadth-first order when flat is set to bfs", () => {
    tmap.defaultAlgorithm = TreeAlgorithm.BFS;
    expect(tmap.allEntries()).toEqual<[number, string][]>([
      [rootEntry.key, rootEntry.data],
      [firstEntry.key, firstEntry.data],
      [lastEntry.key, lastEntry.data]
    ]);
  });

  it("dfsEntries() returns list of [key,data] entries based on depth-first order", () => {
    expect(tmap.dfsEntries()).toEqual<[number, string][]>([
      [firstEntry.key, firstEntry.data],
      [rootEntry.key, rootEntry.data],
      [lastEntry.key, lastEntry.data]
    ]);
  });

  it("bfsEntries() returns list of [key,data] entries based on breadth-first order", () => {
    expect(tmap.bfsEntries()).toEqual<[number, string][]>([
      [rootEntry.key, rootEntry.data],
      [firstEntry.key, firstEntry.data],
      [lastEntry.key, lastEntry.data]
    ]);
  });

  it("size() returns number of nodes in tree", () => {
    expect(tmap.size()).toEqual(3);
  });

  it("size() increases value as tree grows", () => {
    expect(tmap.size()).toEqual(3);
    tmap.add(4, "forth");
    expect(tmap.size()).toEqual(4);
  });

  it("size() decreases value as tree grows", () => {
    expect(tmap.size()).toEqual(3);
    tmap.remove(firstEntry.key);
    expect(tmap.size()).toEqual(2);
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
    emptyTree.add(firstEntry.key, firstEntry.data);
    expect(emptyTree.size()).toEqual<number>(1);
    expect(emptyTree.isKey(firstEntry.key)).toBeTruthy();
    expect(emptyTree.fetch(firstEntry.key)).toEqual(firstEntry.data);
  });

  it("tree rotates left to ensure balance", () => {
    // add weight to right side
    tmap.add(4, "fourth");
    tmap.add(5, "fifth");
    expect(tmap.bfsKeys()).toEqual<number[]>([2, 1, 4, 3, 5]);
  });

  it("tree rotates right to ensure balance", () => {
    // add weight to left side
    tmap.add(0, "zero");
    tmap.add(-1, "neg1");
    expect(tmap.bfsKeys()).toEqual<number[]>([2, 0, 3, -1, 1]);
  });

  it("merge(tree) combines 2 trees into 1 sorted representation", () => {
    const subtree = new TreeMap<number, string>();
    subtree.add(4, "fourth");
    subtree.add(5, "fifth");
    tmap.merge(subtree);
    expect(tmap.dfsKeys()).toEqual<(string | number)[]>([
      firstEntry.key,
      rootEntry.key,
      lastEntry.key,
      4,
      5
    ]);
    expect(tmap.bfsKeys()).toEqual<(string | number)[]>([
      rootEntry.key,
      firstEntry.key,
      4,
      lastEntry.key,
      5
    ]);
  });

  it("remove(key) removes node based on key", () => {
    let prevSize = tmap.size();
    tmap.remove(firstEntry.key);
    expect(tmap.size()).toEqual<number>(--prevSize);
    expect(tmap.isKey(firstEntry.key)).toBeFalsy();
  });

  it("tree handles removal of root node", () => {
    let prevSize = tmap.size();
    tmap.remove(rootEntry.key);
    expect(tmap.size()).toEqual<number>(--prevSize);
    expect(tmap.isKey(rootEntry.key)).toBeFalsy();
    expect(tmap.dfsKeys()).toEqual<(string | number)[]>([
      firstEntry.key,
      lastEntry.key
    ]);
  });

  it("subtree(key) extracts subset of nodes as a tree representation", () => {
    /* eslint-disable @typescript-eslint/unbound-method */
    // REASON: We want to check the references of functions to ensure
    //         they point at the same function after a clone
    //-------------------------------------------------------
    // Setup: ensure target node has children that should be extracted
    tmap.add(2.5, "leftside of 3");
    tmap.add(5, "rightside of 3");

    // Execute function under test
    const subtree: typeof tmap | false = tmap.subtree(lastEntry.key);
    expect(subtree).toBeTruthy();

    // Inspect features of tree now that we know its a TreeMap
    const newPartialTree = subtree as typeof tmap;
    expect(newPartialTree.size()).toEqual(3);
    expect(newPartialTree.bfsEntries()).toEqual<[number, string][]>([
      [lastEntry.key, lastEntry.data], // root
      [2.5, "leftside of 3"],
      [5, "rightside of 3"]
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
          `root: [${rootEntry.key}='${rootEntry.data}']`,
          `df:[${[
            `${Object.values(firstEntry).join("='")}'`,
            `${Object.values(rootEntry).join("='")}'`,
            `${Object.values(lastEntry).join("='")}'`
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
