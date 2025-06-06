import type { NextApiRequest, NextApiResponse } from 'next';
import  MerkleTree  from 'merkletreejs';
import keccak256 from 'keccak256';
import { encodeAbiParameters, parseUnits } from 'viem';

const AIRDROP_DATA: Record<`0x${string}`, { amount: string; decimals: number }> = {
  "0x1234567890abcdef1234567890abcdef12345678": {
    amount: parseUnits("100", 18).toString(),
    decimals: 18,
  },
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": {
    amount: parseUnits("50", 18).toString(),
    decimals: 18,
  },
};

// Generate Merkle tree
const leaves = Object.entries(AIRDROP_DATA).map(([address, data]) =>
  keccak256(
    encodeAbiParameters(
      [
        { name: "account", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      [address as `0x${string}`, BigInt(data.amount)]
    )
  )
);

const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
const merkleRoot = merkleTree.getRoot(); // optional if you need root

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== "string") {
    return res.status(400).json({ error: "Invalid address parameter" });
  }

  const normalizedAddress = address.toLowerCase() as `0x${string}`;
  const userData = AIRDROP_DATA[normalizedAddress];

  if (!userData) {
    return res.json({ eligible: false });
  }

  const leaf = keccak256(
    encodeAbiParameters(
      [
        { name: "account", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      [normalizedAddress, BigInt(userData.amount)]
    )
  );

  const proof = merkleTree.getProof(leaf).map((p: { data: { toString: (arg0: string) => any; }; }) => `0x${p.data.toString('hex')}`);

  res.json({
    eligible: true,
    amount: userData.amount,
    proof,
    tokenDecimals: userData.decimals,
  });
}
