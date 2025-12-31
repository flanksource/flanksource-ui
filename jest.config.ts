import nextJest from "next/jest";
// Sync object
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["@testing-library/jest-dom"], // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""]
  },
  setupFiles: ["./jest.setup.ts"],
  modulePathIgnorePatterns: ["<rootDir>/e2e/", "mocks"]
};

async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  // /node_modules/ is the first pattern
  // we need to exclude yaml from being transformed, otherwise it will break
  // our tests
  // @ts-expect-error
  nextJestConfig.transformIgnorePatterns[0] = "/node_modules/(?!yaml)/";
  return nextJestConfig;
}

module.exports = jestConfig();
