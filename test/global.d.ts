/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */
/* eslint-disable no-var, vars-on-top */
import Puppeteer from "puppeteer";

declare global {
  var __BROWSER__: Puppeteer.Browser;
  var __DEFAULT_BROWSER__: Puppeteer.Browser;
}
