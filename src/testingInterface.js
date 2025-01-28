const appRoot = require('app-root-path');
const chalk = require('chalk')
const utils = require('./utils')
const { spawnSync, spawn } = require("child_process");
const rootDir = appRoot.toString().replaceAll("\\", "/");
const solmutatorConfig = require(rootDir + "/solmutator-config");

const testingTimeOutInSec = solmutatorConfig.testingTimeOutInSec

/**
* Spawns a new compile process through the interface provided by the connected testing framework 
* @param packageManager The package manager used within the SUT (npm or yarn)
*/
function spawnCompile(packageManager) {
  let compileChild;
  const testingFramework = solmutatorConfig.testingFramework;
  const execute = (packageManager === "npm") ? "npx" : "yarn";
  const executeCmd = (process.platform === "win32") ? execute + ".cmd" : execute;

  //Hardhat
  if (testingFramework === "hardhat") {
    compileChild = spawnSync(executeCmd, ["hardhat", "compile"], { stdio: "inherit", cwd: rootDir });
  }
   else {
    console.log(chalk.red("Error: The selected testing framework is not valid."));
    process.exit(1);
  }
  return compileChild.status === 0;
}

/**
* Spawns a new test process through the interface provided by the connected testing framework 
* @param packageManager The package manager used within the SUT (npm or yarn)
*/
function spawnTest(packageManager, testFiles) {

  let testChild;
  const testingFramework = solmutatorConfig.testingFramework;
  const skipTests = solmutatorConfig.skipTests;
  const execute = (packageManager === "npm") ? "npx" : "yarn";
  const executeCmd = (process.platform === "win32") ? execute + ".cmd" : execute;

  //Hardhat
   if (testingFramework === "hardhat") {
    if (skipTests.length === 0) {
      testChild = spawnSync(executeCmd, ["hardhat", "test", "--bail"], { stdio: "inherit", cwd: rootDir, timeout: testingTimeOutInSec * 1000 });
    } else {
      testChild = spawnSync(executeCmd, ["hardhat", "test", "--bail", ...testFiles], { stdio: "inherit", cwd: rootDir, timeout: testingTimeOutInSec * 1000 });
    }
  }
 
  else {
    console.log(chalk.red("Error: The selected testing framework is not valid."));
    process.exit(1);
  }

  let status;
  if (testChild.error && testChild.error.code === "ETIMEDOUT") {
    status = 999;
  } else {
    status = testChild.status;
  }
  return status;
}

/**
 * Spawns a new blockchain node instance
 * @param packageManager The package manager used within the SUT (npm or yarn) 
 **/
function spawnNetwork(packageManager) {
  var child;
  const execute = (packageManager === "npm") ? "npx" : "yarn";
  const executeCmd = (process.platform === "win32") ? execute + ".cmd" : execute;

  if (solmutatorConfig.network === "ganache") {
    console.log(chalk.yellow("\nStarting Ganache"))
    child = spawn(executeCmd, ["ganache-cli"], { stdio: "pipe", cwd: rootDir });
    child.unref();
    const waitForNode = () => {
      if (!isRunning(child)) {
        console.log("Waiting for Ganache ...");
        setTimeout(() => {
          waitForNode();
        }, 250);
      } else {
        resolve();
      }
    };
  }
    
  return child;
}

/**
 * Kills a ganache process (port 8545)
 * @param {*} nodeChild 
 */

function killNetwork(nodeChild) {
  if (solmutatorConfig.network === "ganache") {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", nodeChild.pid, "/f", "/t"]);
    }
    else if (process.platform === "linux") {
      spawn("fuser", ["-k", "8545/tcp"]);
    }
    else if (process.platform === "darwin") {
      let lsofProcess = spawnSync("lsof", ["-i:8545", "-t"]);
      let ganachePid = lsofProcess.stdout.toString().trim();
      spawn("kill", [ganachePid]);
    }
    utils.cleanTmp();
  }
}

module.exports = {
  spawnCompile: spawnCompile,
  spawnTest: spawnTest,
  spawnNetwork: spawnNetwork,
  killNetwork: killNetwork
};