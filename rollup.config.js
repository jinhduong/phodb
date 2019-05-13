import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: ["./src/browsers/ChromeExt.ts"],
  plugins: [typescript(), uglify()],
  output: {
    file: "./build/release/phodb.chrome.js",
    format: "iife"
  }
};
