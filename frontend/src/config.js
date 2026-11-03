// Centralized application configuration
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CHAIN_ID = Number(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID || 31337);
export const EXPLORER_BASE = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || 'https://sepolia.etherscan.io';

export const SUPPORTED_NETWORKS = {
    1: { name: 'Ethereum Mainnet', explorer: 'https://etherscan.io' },
    11155111: { name: 'Sepolia Testnet', explorer: 'https://sepolia.etherscan.io' },
    31337: { name: 'Localhost / Hardhat', explorer: 'https://sepolia.etherscan.io' }
};
