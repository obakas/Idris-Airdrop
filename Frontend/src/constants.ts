export const AIRDROP_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

export const AIRDROP_CONTRACT_ABI = [
        {
            "type": "constructor",
            "inputs": [
                {
                    "name": "merkleRoot",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "airdropToken",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "claim",
            "inputs": [
                {
                    "name": "account",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "merkleProof",
                    "type": "bytes32[]",
                    "internalType": "bytes32[]"
                },
                {
                    "name": "v",
                    "type": "uint8",
                    "internalType": "uint8"
                },
                {
                    "name": "r",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "s",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "eip712Domain",
            "inputs": [],
            "outputs": [
                {
                    "name": "fields",
                    "type": "bytes1",
                    "internalType": "bytes1"
                },
                {
                    "name": "name",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "version",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "chainId",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "verifyingContract",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "salt",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "extensions",
                    "type": "uint256[]",
                    "internalType": "uint256[]"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getAirdropToken",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getMerkleRoot",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getMessageHash",
            "inputs": [
                {
                    "name": "account",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "event",
            "name": "Claimed",
            "inputs": [
                {
                    "name": "account",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "EIP712DomainChanged",
            "inputs": [],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "MerkleRootUpdated",
            "inputs": [
                {
                    "name": "newMerkleRoot",
                    "type": "bytes32",
                    "indexed": false,
                    "internalType": "bytes32"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "InvalidShortString",
            "inputs": []
        },
        {
            "type": "error",
            "name": "MerkleAirdrop__AlreadyClaimed",
            "inputs": []
        },
        {
            "type": "error",
            "name": "MerkleAirdrop__InvalidProof",
            "inputs": []
        },
        {
            "type": "error",
            "name": "MerkleAirdrop__InvalidSignature",
            "inputs": []
        },
        {
            "type": "error",
            "name": "SafeERC20FailedOperation",
            "inputs": [
                {
                    "name": "token",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "StringTooLong",
            "inputs": [
                {
                    "name": "str",
                    "type": "string",
                    "internalType": "string"
                }
            ]
        }
    ]