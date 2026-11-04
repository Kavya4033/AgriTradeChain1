import "dotenv/config";
import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const blockchainDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDirectory = resolve(blockchainDirectory, "..");
const artifactPath = resolve(
  blockchainDirectory,
  "artifacts/contracts/AgriEscrow.sol/AgriEscrow.json",
);

async function deploy() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("Set SEPOLIA_RPC_URL and SEPOLIA_PRIVATE_KEY in blockchain/.env before deploying.");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error(`Expected Sepolia (11155111), received chain ${network.chainId}.`);
  }

  const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
  const wallet = new Wallet(privateKey, provider);
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const deploymentTransaction = contract.deploymentTransaction();
  const deployment = {
    contract: "AgriEscrow",
    address,
    chainId: Number(network.chainId),
    deployer: wallet.address,
    transactionHash: deploymentTransaction?.hash ?? null,
  };
  const targets = [
    resolve(repositoryDirectory, "frontend/src/contracts"),
    resolve(repositoryDirectory, "backend/contracts"),
  ];

  for (const target of targets) {
    await mkdir(target, { recursive: true });
    await writeFile(resolve(target, "AgriEscrowABI.json"), `${JSON.stringify(artifact.abi, null, 2)}\n`);
    await writeFile(
      resolve(target, "AgriEscrowDeployment.json"),
      `${JSON.stringify(deployment, null, 2)}\n`,
    );
  }

  console.log(`AgriEscrow deployed to ${address}`);
  console.log(`Transaction: ${deployment.transactionHash}`);
  console.log("ABI and deployment metadata copied to frontend/src/contracts and backend/contracts.");
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});