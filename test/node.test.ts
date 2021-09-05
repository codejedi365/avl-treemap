/**
 * UMD module testing (distribution build) for Node.js environment
 */
import { main } from "../package.json";
import { TreeMap as TreeMapType, StopSearchException } from "../src/treemap";

describe("UMD/Node.js", () => {
  describe("require()", () => {
    /* eslint-disable global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires */
    it("loads module", () => {
      expect(Object.keys(require(`../${main}`))).toEqual([
        TreeMapType.name,
        "TreeAlgorithm",
        StopSearchException.name
      ]);
    });
    it("creates a usable TreeMap object", () => {
      const { TreeMap } = require(`../${main}`) as {
        TreeMap: new () => TreeMapType<unknown, unknown>;
      };
      const treemap = new TreeMap();
      expect(treemap).toBeTruthy();
      treemap.add(1, "one");
      expect(treemap.size()).toEqual(1);
    });
    /* eslint-enable global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires */
  });
});
