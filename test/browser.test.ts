/**
 * UMD module testing (distribution build) in different environments
 * @jest-environment ./test/puppeteer_environment.js
 */
import path from "path";
import { Page } from "puppeteer";

const consoleLogs: string[] = [];
const consoleErrors: string[] = [];
const networkErrors: string[] = [];

describe("UMD/Chromium", () => {
  let webpage: Page;

  beforeEach(async () => {
    // eslint-disable-next-line no-underscore-dangle
    webpage = await global.__BROWSER__.newPage();
    webpage.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      } else {
        consoleLogs.push(
          `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
        );
      }
    });
    webpage.on("pageerror", ({ message }) => consoleErrors.push(message));
    webpage.on("requestfailed", (request) =>
      networkErrors.push(
        `${request.failure()?.errorText || ""} ${request.url()}`
      )
    );
    await webpage.goto(`file://${path.resolve(__dirname, "./umd.html")}`);
  });

  afterEach(() => {
    consoleLogs.splice(0, consoleLogs.length);
    consoleErrors.splice(0, consoleErrors.length);
    networkErrors.splice(0, networkErrors.length);
    jest.restoreAllMocks();
  });

  it("should load without error", async () => {
    await webpage.evaluate(() => document.body.textContent);
    expect(consoleErrors).toHaveLength(0);
    expect(networkErrors).toHaveLength(0);
  });
  it("TreeMap is usable in other page scripts", async () => {
    const text = await webpage.evaluate(() => document.body.textContent);
    expect(text).toContain("SUCCESS");
    expect(text).toContain("window.treemap.size() = 2");
  });
});
