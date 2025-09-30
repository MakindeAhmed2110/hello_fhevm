
/*
  This file is auto-generated.
  By commands: 'npx hardhat deploy' or 'npx hardhat node'
*/
export const PrivateGuessingGameABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "GameAlreadyActive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "GameNotActive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidRange",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotOwner",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "GameActivated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "guessNumber",
          "type": "uint256"
        }
      ],
      "name": "GuessMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isEqual",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isGreater",
          "type": "bool"
        }
      ],
      "name": "HintResult",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "SecretSet",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "guessEuint32",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "guessProof",
          "type": "bytes"
        }
      ],
      "name": "getHint",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "isEqual",
          "type": "bytes32"
        },
        {
          "internalType": "ebool",
          "name": "isGreater",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isGameActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "guessEuint32",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "guessProof",
          "type": "bytes"
        }
      ],
      "name": "makeGuess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "secretEuint32",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "secretProof",
          "type": "bytes"
        }
      ],
      "name": "setSecret",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

