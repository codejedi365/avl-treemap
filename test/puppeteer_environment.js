/**
 * Puppeteer Environment for Node.js
 * FROM: https://jestjs.io/docs/puppeteer
 */
const { readFile, writeFile } = require("fs").promises;
const { sync: rmSync } = require("rimraf");
const mkdirp = require("mkdirp");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");
const NodeEnvironment = require("jest-environment-node");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");
const debugUrlSavedFile = path.join(DIR, "wsEndpoint");

async function browserSetup() {
  const browser = await puppeteer.launch();
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global.__BROWSER_GLOBAL__ = browser; // eslint-disable-line no-underscore-dangle

  // use the file system to expose the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR);
  await writeFile(debugUrlSavedFile, browser.wsEndpoint());
}

async function browserTearDown() {
  // close the browser instance
  // eslint-disable-next-line no-underscore-dangle
  if (global.__BROWSER_GLOBAL__) {
    await global.__BROWSER_GLOBAL__.close(); // eslint-disable-line no-underscore-dangle
  }

  // clean-up the wsEndpoint file
  rmSync(DIR);
}

class PuppeteerEnvironment extends NodeEnvironment {
  // Uses NodeEnvironment constructor

  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = await readFile(debugUrlSavedFile, "utf-8").catch(
      async () => {
        // Browser socket not found, build a new one & try again
        await browserSetup();
        const url = await readFile(debugUrlSavedFile, "utf-8");
        return url;
      }
    );
    // connect to puppeteer
    // eslint-disable-next-line no-underscore-dangle
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint
    });
  }

  async teardown() {
    await browserTearDown();
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = PuppeteerEnvironment;
