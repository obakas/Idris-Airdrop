# 🪂 IdrisAirdrop - Merkle Tree Airdrop Smart Contract

A secure and gas-efficient smart contract for distributing ERC-20 tokens to eligible recipients using Merkle proofs and EIP-712 signatures.  
Brought to you by [Obaka Idris George](https://github.com/obaka-idris) — where code meets cryptographic elegance.

---

## ✨ Features

- ✅ **Merkle Tree Verification** — Efficient on-chain eligibility checks using Merkle proofs.
- ✅ **EIP-712 Typed Data Signatures** — Gas-friendly and user-friendly signature verification.
- ✅ **Double-Claim Protection** — Each user can only claim once, no funny business.
- ✅ **Safe Transfers** — Uses OpenZeppelin’s `SafeERC20` for reliable token distribution.
- ✅ **Minimal Storage Usage** — Only stores a Merkle root and claimed addresses.

---

## 🧠 How It Works

1. **Off-Chain Setup**
   - Generate a Merkle tree from eligible user data (e.g., `address + amount`).
   - Sign the data off-chain using EIP-712 compliant wallets (like MetaMask).

2. **On-Chain Claim**
   - The user submits:
     - Their address
     - Their airdrop amount
     - A Merkle proof
     - A valid EIP-712 signature
   - If the proof and signature check out, the tokens are transferred.

---

## 📜 Contract Details

**Contract Name:** `IdrisAirdrop`  
**Compiler Version:** `^0.8.28`  
**License:** MIT  
**Dependencies:**
- `openzeppelin-contracts/utils/cryptography/MerkleProof.sol`
- `openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol`
- `openzeppelin-contracts/utils/cryptography/EIP712.sol`
- `openzeppelin-contracts/utils/cryptography/ECDSA.sol`

---

## 🛠️ Constructor

```solidity
constructor(bytes32 merkleRoot, IERC20 airdropToken)
```

- `merkleRoot`: The Merkle root of the eligible accounts and token amounts.
- `airdropToken`: The ERC-20 token being distributed.

---

## ⚙️ Claim Function

```solidity
function claim(
    address account,
    uint256 amount,
    bytes32[] calldata merkleProof,
    uint8 v,
    bytes32 r,
    bytes32 s
) external;
```

- Verifies:
  - The address has not claimed before.
  - The EIP-712 signature matches the expected message.
  - The Merkle proof validates against the stored root.
- If all checks pass, transfers `amount` of tokens to `account`.

---

## 🧾 Message Hash Format

```solidity
AirdropClaim(address account,uint256 amount)
```

- This structure is used to generate the EIP-712 message hash that must be signed off-chain.

---

## 🪵 Events

- `event Claimed(address account, uint256 amount);`
- `event MerkleRootUpdated(bytes32 newMerkleRoot);`

---

## 🔐 Security Features

- ✅ Prevents replay attacks using EIP-712 domain separation.
- ✅ Ensures one-time claims via `s_hasClaimed` mapping.
- ✅ Uses OpenZeppelin libraries for robust cryptography.

---

## 🧪 Example Use Case

Say you’ve got 10,000 wallets eligible for an airdrop. Instead of clogging up the blockchain with all that data, you:

1. Off-chain:
   - Create a Merkle tree.
   - Publish the Merkle root.
   - Distribute signed messages to users.

2. On-chain:
   - Users come in, prove their eligibility via a Merkle proof and signature.
   - Tokens are securely airdropped.

---

## 🚧 Future Improvements

- Admin function to update the Merkle root (currently not implemented).
- Optional: Add a deadline or expiration.
- Optional: Multi-token airdrop support.

---

## 🤝 Contributing

Got ideas or improvements? Fork it, branch it, PR it. Let's build something legendary.

---

## 📩 Contact

Questions, feedback, memes?  
Find me on [LinkedIn](https://linkedin.com/in/obaka-idris) or [Twitter](https://twitter.com/obaka_dev).

---

## 🧼 Final Thoughts

This ain’t just another airdrop contract — it’s trustless, efficient, and built with care.  
If Solidity had poetry, this would be haiku.