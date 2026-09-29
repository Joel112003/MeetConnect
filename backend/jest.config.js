export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
  clearMocks: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "app.js",
    "src/**/*.js",
    "!src/config/**",
  ],
};