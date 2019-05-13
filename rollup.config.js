import typescript from "rollup-plugin-typescript";

export default {
  input: ["./src/browsers/ChromeExt.ts"],
  plugins: [typescript()],
  output: {
    file: "./build/phodb.chrome.js",
    format: "iife"
  }
};
