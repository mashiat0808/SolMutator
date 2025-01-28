
/** @type import('hardhat/config').HardhatUserConfig */
require('solidity-coverage')
module.exports = {
    solidity: {
      compilers: [
        {
          version: "0.8.27",  // Specify the Solidity version you are using
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
            metadata: {
              bytecodeHash: "none",
            },
          },
        },
      ],
    },
  };
