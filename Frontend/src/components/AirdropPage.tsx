"use client";

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData, useChainId, useConfig } from 'wagmi';
// import { useNetwork } from 'wagmi/react';
// import { ethers } from 'ethers';
import { formatUnits, createWalletClient, custom, parseAbi } from 'viem';
// import AirdropContract from '../artifacts/contracts/IdrisAirdrop.sol/IdrisAirdrop.json';
import { AIRDROP_CONTRACT_ADDRESS, AIRDROP_CONTRACT_ABI } from '../constants';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { config } from 'process';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import toast from "react-hot-toast";


const CHAIN_ID = 1; // Mainnet (change for testnets)

interface AirdropData {
    eligible: boolean;
    amount: string;
    proof: string[];
    tokenDecimals: number;
}

export default function AirdropPage() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const config = useConfig();
    const [airdropData, setAirdropData] = useState<AirdropData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isClaimed, setIsClaimed] = useState(false);
    const [txHash, setTxHash] = useState('');

    const { signTypedDataAsync } = useSignTypedData();

    // Check eligibility
    useEffect(() => {
        const checkEligibility = async () => {
            if (!isConnected || !address) return;

            setIsLoading(true);
            setError('');

            try {
                const response = await fetch(`/api/eligibility?address=${address}`);
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setAirdropData(data);
            } catch (err) {
                setError(
                    err && typeof err === 'object' && 'message' in err
                        ? (err as { message: string }).message
                        : 'Failed to check eligibility'
                );
            } finally {
                setIsLoading(false);
            }
        };

        checkEligibility();
    }, [address, isConnected]);

    // Create wallet client
    const client = createWalletClient({
        chain: undefined, // You can specify the chain if needed
        transport: custom((window as any).ethereum),
    });

    // Handle claim
    const handleClaim = async () => {
        if (!airdropData || !address) return;

        const toastId = toast.loading("Claiming airdrop...");
        setIsLoading(true);
        setError("");

        try {
            // 1. Get EIP-712 signature
            const signature = await signTypedDataAsync({
                domain: {
                    name: "Merkle Airdrop",
                    version: "1.0.0",
                    chainId,
                    verifyingContract: AIRDROP_CONTRACT_ADDRESS,
                },
                types: {
                    AirdropClaim: [
                        { name: "account", type: "address" },
                        { name: "amount", type: "uint256" },
                    ],
                },
                primaryType: "AirdropClaim",
                message: {
                    account: address,
                    amount: BigInt(airdropData.amount),
                },
            });

            // 2. Split signature manually (no ethers)
            const r = `0x${signature.slice(2, 66)}` as `0x${string}`;
            const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
            const v = parseInt(signature.slice(130, 132), 16);

            // 3. Write contract
            const tx = await writeContract(config, {
                address: AIRDROP_CONTRACT_ADDRESS,
                abi: parseAbi([
                    "function claim(uint256 amount, bytes32 r, bytes32 s, uint8 v)",
                ]),
                functionName: "claim",
                args: [BigInt(airdropData.amount), r, s, v],
                chainId,
            });

            await waitForTransactionReceipt(config, { hash: tx });

            toast.success("Airdrop claimed! 🎉", { id: toastId });
            setIsClaimed(true);
            setTxHash(tx);
        } catch (err: any) {
            const message = err?.shortMessage || err?.message || "Claim failed";
            toast.error(`Airdrop claim failed: ${message}`, { id: toastId });
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleClaim = async () => {
    //     if (!airdropData || !address) return;

    //     setIsLoading(true);
    //     setError('');

    //     try {
    //         // 1. Get EIP-712 signature
    //         const signature = await signTypedDataAsync({
    //             domain: {
    //                 name: 'Merkle Airdrop',
    //                 version: '1.0.0',
    //                 chainId: chainId,
    //                 verifyingContract: AIRDROP_CONTRACT_ADDRESS,
    //             },
    //             types: {
    //                 AirdropClaim: [
    //                     { name: 'account', type: 'address' },
    //                     { name: 'amount', type: 'uint256' },
    //                 ],
    //             },
    //             primaryType: 'AirdropClaim',
    //             message: {
    //                 account: address,
    //                 amount: BigInt(airdropData.amount),
    //             },
    //         });

    //         // 2. Split signature
    //         // const { r, s, v } = ethers.utils.splitSignature(signature);
    //         const r = `0x${signature.slice(2, 66)}` as `0x${string}`;
    //         const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
    //         const v = parseInt(signature.slice(130, 132), 16);

    //         // 3. Execute claim
    //         // const provider = new ethers.providers.Web3Provider(window.ethereum);
    //         // const signer = provider.getSigner();
    //         // const contract = new ethers.Contract(
    //         //     AIRDROP_CONTRACT_ADDRESS,
    //         //     AIRDROP_CONTRACT_ABI,
    //         //     signer
    //         // );
    //         await client.writeContract(config, {
    //             address: AIRDROP_CONTRACT_ADDRESS,
    //             abi: parseAbi(['function claim(uint256 amount, bytes32 r, bytes32 s, uint8 v)']),
    //             functionName: 'claim',
    //             args: [BigInt(airdropData.amount), r, s, v],
    //         });

    //         const tx = await client.writeContract({
    //             address: AIRDROP_CONTRACT_ADDRESS,
    //             abi: parseAbi(['function claim(uint256 amount, bytes32 r, bytes32 s, uint8 v)']),
    //             functionName: 'claim',
    //             args: [BigInt(airdropData.amount), r, s, v],
    //         });

    //         setTxHash(tx.hash);
    //         await tx.wait();
    //         setIsClaimed(true);
    //     } catch (err) {
    //         setError(
    //             err && typeof err === 'object' && 'message' in err
    //                 ? (err as { message: string }).message
    //                 : 'Claim failed'
    //         );
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // Render UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Token Airdrop
                    </h1>

                    {!isConnected ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600 mb-6">
                                Connect your wallet to check eligibility
                            </p>
                            <ConnectButton
                                showBalance={true}
                                accountStatus="address"
                                chainStatus="icon"
                            />
                        </div>
                    ) : chainId !== CHAIN_ID ? (
                        <div className="bg-yellow-50 p-4 rounded-md text-center">
                            <p className="text-yellow-800">
                                Please switch to {CHAIN_ID === 1 ? 'Ethereum Mainnet' : 'Goerli Testnet'}
                            </p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-4 rounded-md">
                            <p className="text-red-800">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-3 text-blue-600 hover:text-blue-800"
                            >
                                Try again
                            </button>
                        </div>
                    ) : isClaimed ? (
                        <div className="text-center py-6">
                            <div className="text-green-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Airdrop Claimed Successfully!
                            </h2>
                            {txHash && (
                                <a
                                    href={`https://etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    View on Etherscan
                                </a>
                            )}
                        </div>
                    ) : airdropData?.eligible ? (
                        <div className="space-y-6">
                            <div className="bg-green-50 p-4 rounded-md">
                                <h2 className="text-xl font-semibold text-green-800 text-center">
                                    You're eligible for the airdrop!
                                </h2>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                                <span className="text-gray-600">Amount:</span>
                                <span className="text-xl font-bold text-gray-800">
                                    {formatUnits(
                                        BigInt(airdropData.amount),
                                        airdropData.tokenDecimals || 18
                                    )}
                                </span>
                            </div>

                            <button
                                onClick={handleClaim}
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-md shadow-md transition duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Processing...' : 'Claim Airdrop'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Not Eligible
                            </h2>
                            <p className="text-gray-600">
                                This wallet address is not eligible for the current airdrop.
                            </p>
                        </div>
                    )}

                    {isConnected && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Contract Information
                            </h3>
                            <div className="text-sm space-y-1">
                                <p className="truncate">
                                    <span className="text-gray-500">Token:</span>{' '}
                                    <a
                                        href={`https://etherscan.io/address/${AIRDROP_CONTRACT_ADDRESS}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {AIRDROP_CONTRACT_ADDRESS}
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}