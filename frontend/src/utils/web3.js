import { ethers } from 'ethers';
import AgriTradeChainABI from '../contracts/AgriTradeChainABI.json';
import { CONTRACT_ADDRESS, CHAIN_ID, EXPLORER_BASE, SUPPORTED_NETWORKS } from '../config';

/**
 * Checks if MetaMask or an injected Ethereum provider is available
 */
export const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
};

/**
 * Requests wallet connection and returns signer and active address
 */
export const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use Web3 features.');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return {
        provider,
        signer,
        address,
        chainId: network.chainId,
        networkName: SUPPORTED_NETWORKS[network.chainId]?.name || `Chain ID ${network.chainId}`
    };
};

/**
 * Formats a blockchain address or transaction hash to shortened string
 * e.g. 0x1234...abcd
 */
export const shortenHash = (hash, lead = 6, tail = 4) => {
    if (!hash || typeof hash !== 'string') return '';
    if (hash.length <= lead + tail) return hash;
    return `${hash.slice(0, lead)}...${hash.slice(-tail)}`;
};

/**
 * Generates the correct block explorer URL for a given transaction hash
 */
export const getExplorerTxUrl = (txHash, chainId = CHAIN_ID) => {
    if (!txHash) return '#';
    const baseUrl = SUPPORTED_NETWORKS[chainId]?.explorer || EXPLORER_BASE;
    return `${baseUrl.replace(/\/$/, '')}/tx/${txHash}`;
};

/**
 * Generates the correct block explorer URL for a wallet address
 */
export const getExplorerAddressUrl = (address, chainId = CHAIN_ID) => {
    if (!address) return '#';
    const baseUrl = SUPPORTED_NETWORKS[chainId]?.explorer || EXPLORER_BASE;
    return `${baseUrl.replace(/\/$/, '')}/address/${address}`;
};

/**
 * Returns an instance of the AgriTradeChain smart contract attached to signer
 */
export const getAgriContract = (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, AgriTradeChainABI, signerOrProvider);
};
