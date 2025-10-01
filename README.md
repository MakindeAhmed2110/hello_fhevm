# Hello FHEVM -Build your first confidential dApp

A fully homomorphic encryption (FHE) powered number guessing game built with Zama's FHEVM technology. Players can make encrypted guesses and receive encrypted hints without revealing the secret number or their guesses to anyone, including the blockchain.

<div align="center">
  <img src="/hello FHEVM.png" alt="hello FHEVM" width="800" height="800"/>
</div>

## Tutorial Video Link

Video Link: [https://youtu.be/X6TeMC3D4cQ](https://youtu.be/X6TeMC3D4cQ)

## Overview

This project demonstrates a practical application of Fully Homomorphic Encryption (FHE) on Ethereum using Zama's FHEVM. It includes:

- **PrivateGuessingGame.sol**: A smart contract where a secret number is encrypted and players receive encrypted hints
- **FHECounter.sol**: The original counter example demonstrating FHE operations
- **React Frontend**: Next.js application with MetaMask integration for interacting with both contracts

## Quick Start

### Prerequisites

- Node.js (v18+)
- MetaMask browser extension
- Sepolia testnet ETH (for deployment)

### Installation

```bash
# Clone the repository
cd fhevm-react-template

# Install dependencies (use Git Bash on Windows)
npm install

# Start local hardhat node (in one terminal)
npm run hardhat-node

# Deploy contracts to local node (in another terminal)
npm run deploy:hardhat-node

# Start the frontend
npm run dev
```

The app will be available at `http://localhost:3000`

### Deploy to Sepolia

```bash
# Deploy to Sepolia testnet
cd packages/fhevm-hardhat-template
npx hardhat deploy --network sepolia
```

## How to Play

1. **Connect Wallet**: Connect your MetaMask wallet (Sepolia network)
2. **Set Secret** (Owner only): Enter a number between 1-100 and click "Set Secret & Start Game"
3. **Make Guess**: Enter your guess (1-100) and click "Get Hint"
4. **Decrypt Hint**: Click "Decrypt Hint" to reveal if your guess was correct
5. **Interpret Results**:
   - If `isEqual = true`: You guessed correctly! 🎉
   - If `isGreater = true`: Your guess is too high
   - If `isGreater = false`: Your guess is too low

## Architecture

### Smart Contract (`PrivateGuessingGame.sol`)

```solidity
// Key functions:
setSecret(euint32, proof)      // Owner sets encrypted secret number
getHint(euint32, proof)        // Get encrypted comparison results
getLastHint()                  // Retrieve stored hint handles for decryption
isGameActive()                 // Check if game is active
owner()                        // Get contract owner
```

### Frontend

- **React Components**: 
  - `PrivateGuessingGameDemo.tsx` - Main game UI
  - `FHECounterDemo.tsx` - Counter example UI
  
- **Custom Hooks**:
  - `usePrivateGuessingGame.tsx` - Game logic and FHEVM operations
  - `useFHECounter.tsx` - Counter logic
  - `useMetaMaskEthersSigner.tsx` - MetaMask integration
  - `useFhevm.tsx` - FHEVM instance management

## Technical Details

### Encryption Flow

1. **Input Encryption**:
   ```typescript
   const input = instance.createEncryptedInput(contractAddress, userAddress);
   input.add32(secretNumber);
   const enc = await input.encrypt();
   ```

2. **Contract Call**:
   ```typescript
   await contract.setSecret(enc.handles[0], enc.inputProof);
   ```

3. **Hint Retrieval**:
   ```typescript
   const hint = await contract.getLastHint(); // Returns [isEqual, isGreater]
   ```

4. **Decryption**:
   ```typescript
   const sig = await FhevmDecryptionSignature.loadOrSign(...);
   const result = await instance.userDecrypt(handles, sig...);
   ```

### FHE Operations

The contract uses these FHE operations:
- `FHE.fromExternal()` - Convert external encrypted input to internal FHE type
- `FHE.eq()` - Encrypted equality comparison
- `FHE.gt()` - Encrypted greater-than comparison
- `FHE.allow()` - Grant decryption permission
- `FHE.allowThis()` - Allow contract to use encrypted value

## Project Structure

```
fhevm-react-template/
├── packages/
│   ├── fhevm-hardhat-template/
│   │   ├── contracts/
│   │   │   ├── PrivateGuessingGame.sol
│   │   │   └── FHECounter.sol
│   │   ├── deploy/
│   │   │   ├── 00_FHECounter.ts
│   │   │   └── 01_PrivateGuessingGame.ts
│   │   └── test/
│   ├── site/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── providers.tsx
│   │   ├── components/
│   │   │   ├── PrivateGuessingGameDemo.tsx
│   │   │   └── FHECounterDemo.tsx
│   │   ├── hooks/
│   │   │   ├── usePrivateGuessingGame.tsx
│   │   │   └── useFHECounter.tsx
│   │   └── abi/ (auto-generated)
│   └── postdeploy/
└── scripts/
```

## Security Considerations

- **Privacy**: All guesses and comparisons are encrypted end-to-end
- **Verifiability**: All operations are on-chain and verifiable
- **Decryption**: Only authorized users can decrypt their hint results
- **Owner Control**: Only the contract owner can set the secret number

## Network Support

- **Local Development**: Hardhat node (chainId: 31337)
- **Testnet**: Sepolia (chainId: 11155111)
- **Production**: Contact Zama for mainnet access

## Development

### Running Tests

```bash
cd packages/fhevm-hardhat-template
npx hardhat test
```

### Compiling Contracts

```bash
cd packages/fhevm-hardhat-template
npx hardhat compile
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### FHEVM SDK Not Loading

- Ensure you're on Sepolia network (chainId: 11155111)
- Check that MetaMask is connected
- Refresh the page after connecting

### Cannot Set Secret

- Verify you're the contract owner
- Ensure game is not already active
- Check that FHEVM instance is loaded

### Transaction Failures

- Ensure you have sufficient Sepolia ETH
- Check network connection
- Verify contract is deployed on current network

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: [Report a bug](https://github.com/zama-ai/fhevm-react-template/issues)
- Documentation: [Zama Docs](https://docs.zama.ai)
- Community: [Zama Discord](https://discord.fhevm.io)
