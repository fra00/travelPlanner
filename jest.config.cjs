module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Dice a Jest di cercare i file di test solo nella cartella /test
  testMatch: ["<rootDir>/test/**/*.(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    // Mock per i file CSS, dato che Jest non sa come gestirli
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  // Ignora la cartella node_modules, tranne per le dipendenze che potrebbero necessitare di essere trasformate
  transformIgnorePatterns: ["/node_modules/"],
};
