module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
            dynamicImport: true,
          },
          transform: {
            react: {
              runtime: "automatic",
              development: false,
              useBuiltins: true,
            },
          },
        },
      },
    ],
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^axios$": "<rootDir>/__mocks__/axiosMock.js",  // Mock axios to avoid import errors
  },
};
