# SolMutator
SolMutator is a mutation testing tool for Solidity Smart Contracts. It features 44 mutation operators.



# Installation

To install SolMutator, run ```git clone https://github.com/mashiat0808/SolMutator.git```

# Configuration 
Before using SolMutator, you need to define your preferred settings in a ```solmutator-config.js``` file located in the root directory of the project. This configuration file is automatically created during the installation process.

Here's a simple example of ```solmutator-config.js```:

```
module.exports = {
  buildDir: 'build',
  contractsDir: 'contracts',
  testDir: 'test',
  skipContracts: [],
  skipTests: [],
  testingTimeOutInSec: 300,
  network: "none",
  testingFramework: "hardhat",
  minimal: false,
  tce: false,
}
```

### 1) Description of the fields in solmutator-config.js
These fields identify relevant project directories.

| Field | Description  |
| ------ | ------  |
| ```contractsDir```| relative path to the directory of the contracts to be mutated |
 | ```testDir```| relative path to the directory of the tests to be evaluated | 
 | ```buildDir```| relative path to the directory of the compilation artifacts  |  
| ```minimal```| use minimal mutation rules |
 | ```skipContracts```| list of relative paths to contract files (or folders) not to be used | 
| ```skipTests```| list of relative paths to test files (or folders) not to be used |
| ```tce```| use the Trivial Compiler Equivalence |    
| ```testingTimeOutInSec```| seconds after which a mutant is marked as timed-out during testing |  
| ```network```| the blockchain simulator to be used (```ganache```, ```none```)|
| ```testingFramework```| the testing framework to be used for compiling and testing the smart contracts  (```hardhat```)|


#### **Hardhat**
* SolMutator will rely on the local ```hardhat``` package installed in the project, so the user needs to install hardhat into the project using ``npm install hardhat```
* User should create a ```hardhat.config.js``` in the root folder of the project. 
Heres a simple example of ```hardhat.config.js```:

```
/** @type import('hardhat/config').HardhatUserConfig */
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


```


This configuration snippet defines the Solidity compiler settings for a Hardhat project. 
### Solidity Configuration Table

| **Field**         | **Description**                                                                 |
|--------------------|---------------------------------------------------------------------------------|
| `compilers`        | An array of compiler configurations.                                           |
| `version`          | Specifies the Solidity compiler version (e.g., `"0.8.27"`).                   |
| `settings`         | Additional compiler settings.                                                  |
| `optimizer.enabled`| Enables (`true`) or disables (`false`) the optimizer.                          |
| `optimizer.runs`   | Number of optimization runs (e.g., `200`).                                      |
| `metadata.bytecodeHash` | Type of hash included in bytecode metadata (e.g., `"none"` to exclude it). | 

### Contracts and tests

* User should create the folders mentioned in ```solmutator-config.js``` (```buildDir```, ```contractsDir```, ```testDir```) in the root folder of the project.
* Upload the smart contracts and tests in the folder.


# CLI Usage

## Selecting the Mutation Operators

Before starting the mutation process user can choose which mutation operators to use:

| Command       | Description                        | Example                             |
|---------------|--------------------------|-------------------------------------|
| `list`    | Shows the enabled mutation operators. | `node index.js list`  |
| `enable`    | Enables one or more mutation operators. If no operator IDs are specified, all of them are enabled. | ` node index.js enable` <br> `node index.js enable AOR BOR` |
| `disable`    | Disables one or more mutation operators. If no operator IDs are specified, all of them are disabled. |`node index.js disable` <br> `node index.js disable FVR` |

## Viewing the available mutations

| Command       | Description                          | Example                             |
|---------------|------------------------------------|-------------------------------------|
| `lookup`    | Generates the mutations and saves them to ./solmutator/generated.csv without starting mutation testing. |  `node index.js lookup` |
| `mutate`    | Generates the mutations and saves a copy of each `.sol` mutant to  to ./solmutator/mutants. | `node index.js mutate` |

## Running Mutation Testing


| Command       | Description                        | Usage                    | 
|---------------|------------------------------------|-------------------------------------|
| `pretest`    | Runs the test suite on the original smart contracts to check if all tests pass and can be successfully evaluated. Pretest is automatically run when `node index.js test` is executed. |  `node index.js pretest` |
| `test`    | Starts the mutation testing process. You can also choose a single mutant / an interval of mutants to be tested by sepcifying ```<startHash>``` and (optionally) ```<endHash>```.| `node index.js test` <br> `node index.js test mbc5e8f56 mbg5t86o6`|
| `restore`    | Restores the files to a clean version. This should be executed if the user suddenly interrupts the mutation process. Note that the restore command overwrites the codebase with the files stored in the ```solmutator/baseline``` folder. If the user needs to restore the project files, make sure to do so before performing other operations as the baseline is  refreshed on subsequent preflight or test runs.|  `node index.js restore`|

## Viewing the results
SolMutator  creates a ```solmutator\results``` folder in the root directory of the project with the following reports: <br/>
* ```operators.xlsx``` Results of the mutation testing process grouped by operator
* ```results.csv``` Results of the mutation testing process for each mutant. This log is updated each time a mutant is assigned a status
* ```solmutator-log.txt``` Logs info about the mutation testing process
* ```\mutants``` Mutated ```.sol``` contracts generated with ```node index.js mutate```



# Mutation Operators 

SolMutator includes 25 Solidity-specific operators and 19 Traditional operators.

## Traditional Mutation Operators

| Operator | Name | Mutation Example |  
| ------ | ------ |  ------ | 
| ACM| Argument Change of overloaded Method call | ```overloadedFunc(a,b);``` &rarr; ```overloadedFunc(a,b,c);``` |  
| AOR | Assignment Operator Replacement | ```+= ``` &rarr;  ```=``` | 
| BCRD | Break and Continue Replacement <br /> and Deletion | ```break``` &rarr; <br /> ```continue``` &rarr; ```break``` | 
| BLR | Boolean Literal Replacement | ```true``` &rarr; ```false``` | 
| BOR | Binary Operator Replacement | ```+``` &rarr; ```-``` <br /> ```<``` &rarr; ```>=``` |  
| CBD | Catch Block Deletion | ```catch{}``` &rarr; ``` ``` |  
| CSC | Conditional Statement Change | ```if(condition)``` &rarr; ```if(false)``` <br /> ```else{}``` &rarr; ``` ```  |  
| ER | Enum Replacemet |  ```enum.member1``` &rarr; ```enum.member2``` | 
| ECS | Explicit Conversion to Smaller type | ```uint256``` &rarr; ```uint8``` | 
| HLR | Hexadecimal Literal Replacement | ```hex\"01\"``` &rarr; ```hex\"random\"```|  
| ICM | Increments Mirror | ```-=``` &rarr; ```=-``` |  
| ILR | Integer Literal Replacement | ```1``` &rarr; ```0``` | 
| LCS | Loop Statement Change | ```while(condition)``` &rarr; ```while(false)``` | 
| OLFD | Overloaded Function Deletion | ```function overloadedF(){}``` &rarr; ``` ``` | 
| ORFD | Overridden Function Deletion | ```function f() override {}``` &rarr; ``` ``` |  
| SKI | Super Keyword Insertion | ```x = getData()``` &rarr; ```x = super.getData()``` | 
| SKD | Super Keyword Deletion | ```x = super.getData()``` &rarr; ```x = getData()``` | 
| SLR | String Literal Replacement | ```"string"``` &rarr; ```""```  |  
| UORD | Unary Operator Replacement and Deletion | ```++``` &rarr; ```--```  <br /> ```!``` &rarr; ``` ``` |  


## Solidity Mutation Operators
| Operator | Name | Mutation Example | 
| ------ | ------ |  ------ | 
| AVR | Address Value Replacement | ```0x67ED2e5dD3d0...``` &rarr; ``` address.this()```|  
| CCD | Contract Constructor Deletion | ```constructor(){}``` &rarr; ``` ``` | 
| DLR | Data Location Keyword Replacement | ```memory``` &rarr; ```storage``` |
| DOD | Delete Operator Deletion | ```delete``` &rarr; |  
| ETR | Ether Transfer function Replacement | ```delegatecall()``` &rarr; ```call()``` | 
| EED |  Event Emission Deletion |  ```emit Deposit(...)``` &rarr; ```/*emit Deposit(...)*/``` |  
| EHC | Exception Handling Change | ```require(...)``` &rarr; ```/*require(...)*/``` |  
| FVR | Function Visibility Replacement | ```function f() public``` &rarr; ```function f() private``` | 
| GVR | Global Variable Replacement | ```msg.value()``` &rarr; ```tx.gasprice()``` | 
| MCR | Mathematical and Cryptographic <br /> function Replacement | ```addmod``` &rarr; ```mulmod``` <br /> ```keccak256``` &rarr; ```sha256``` |
| MOD | Modifier Deletion | ```function f() onlyOwner``` &rarr; ```function f()``` | 
| MOI | Modifier Insertion | ```function f()``` &rarr; ```function f() onlyOwner``` |  
| MOC | Modifier Order Change |  ```function f() modA modB``` &rarr; ```function f() modB modA``` | 
| MOR | Modifier Replacement | ```function f() onlyOwner``` &rarr; ```function f() onlyAdmin``` | 
| OMD | Overridden Modifier Deletion | ```modifier m() override {}``` &rarr; ``` ``` | 
| PKD | Payable Keyword Deletion | ```function f() payable``` &rarr; ```function f()``` | 
| RSD | Return Statement Deletion | ```return amount;``` &rarr; ```//return amount;``` |  
| RVS | Return Values Swap | ```return (1, "msg", 100);``` &rarr; ```return (100, "msg", 1);``` | 
| SFD | Selfdestruct Deletion |  ```selfdestruct();``` &rarr; ```//selfdestruct();``` | 
| SFI | Selfdestruct Insertion | ```doSomething; selfdestruct();``` &rarr; ```selfdestruct(); doSomething;```  | 
| SFR | SafeMath Function Replacement | ```SafeMath.add``` &rarr; ```SafeMath.sub``` | 
| SCEC | Switch Call Expression Casting | ```Contract c = Contract(0x86C9...);``` &rarr; ```Contract c = Contract(0x67ED...); ``` | 
| TOR | Transaction Origin Replacement | ```msg.sender``` &rarr; ```tx.origin``` |  
| VUR | Variable Unit Replacement | ```wei``` &rarr; ```ether```  <br /> ```minutes``` &rarr; ```hours``` | 
| VVR | Variable Visibility Replacement | ```uint private data;``` &rarr; ```uint public data;``` | 



