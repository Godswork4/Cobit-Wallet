import { Connection, clusterApiUrl } from "@solana/web3.js";

// Initialize connection to Solana devnet
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");