const appRoot = require('app-root-path');
const rootDir = appRoot.toString().replaceAll("\\", "/");
const fs = require('fs')


const solmutatorconfig = "module.exports = {\n    buildDir: '',\n    contractsDir: '',\n    testDir: '',\n    skipContracts: [],\n    skipTests: [],\n    testingTimeOutInSec: 300,\n    network: \"none\",\n    testingFramework: \"truffle\",\n    minimal: false,\n    tce: false\n  }"
if (!fs.existsSync(rootDir + "/solmutator-config.js")) {
    fs.writeFileSync(rootDir + "/solmutator-config.js", solmutatorconfig)
}
