# Private Number Guessing Game with FHEVM

A fully homomorphic encryption (FHE) based number guessing game built with Zama's FHEVM, allowing players to guess a secret number while keeping all data encrypted throughout the game.

## 🎮 Game Overview

This project demonstrates how to build privacy-preserving applications using Zama's FHEVM technology. The game allows:

- **Game Master**: Sets a secret number (1-100) and activates the game
- **Players**: Make encrypted guesses and receive encrypted hints
- **Privacy**: All operations (guessing, hint generation, comparisons) happen on encrypted data
- **Decryption**: Players can decrypt their hint results to see if their guess was correct

## 🏗️ Architecture

### Smart Contracts
- **`PrivateGuessingGame.sol`**: Main game contract with FHE operations
- **`FHECounter.sol`**: Reference implementation for FHEVM patterns

### Frontend
- **React + TypeScript**: Modern web interface
- **FHEVM React SDK**: Integration with Zama's FHEVM
- **MetaMask Integration**: Wallet connection and transaction signing

### Key Features
- ✅ **Encrypted Secret Storage**: Secret number remains encrypted on-chain
- ✅ **Private Comparisons**: FHE-based equality and greater-than comparisons
- ✅ **Encrypted Hints**: Players receive encrypted hints about their guesses
- ✅ **Decryption Interface**: User-friendly decryption of hint results
- ✅ **Owner Controls**: Game master can set secrets and manage game state

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- MetaMask wallet
- Sepolia ETH for gas fees

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fhevm-react-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy contracts to Sepolia**
   ```bash
   cd packages/fhevm-hardhat-template
   npx hardhat deploy --network sepolia
   ```

4. **Start the development server**
   ```bash
   npm run dev-webpack:mock
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Connect MetaMask to Sepolia network
   - Ensure you have Sepolia ETH for gas fees

## 🎯 How to Play

### For Game Masters (Contract Owner)

1. **Connect Wallet**: Ensure MetaMask is connected to Sepolia
2. **Set Secret**: Enter a number between 1-100 in the "Secret Number" field
3. **Start Game**: Click "Set Secret & Start Game" to activate
4. **Game Active**: Players can now make guesses and get hints

### For Players

1. **Make a Guess**: Enter your guess (1-100) in the input field
2. **Get Hint**: Click "Get Hint" to receive encrypted comparison results
3. **Decrypt Hint**: Click "Decrypt Hint" to reveal if your guess was:
   - **Equal** to the secret number
   - **Greater** than the secret number
4. **Keep Guessing**: Use the hints to narrow down your next guess

## 🔧 Technical Details

### FHEVM Operations

The game uses several FHEVM operations:

```solidity
// Encrypted equality comparison
ebool isEqual = FHE.eq(_secretNumber, encryptedGuess);

// Encrypted greater-than comparison  
ebool isGreater = FHE.gt(encryptedGuess, _secretNumber);

// Allow decryption by the caller
FHE.allow(isEqual, msg.sender);
FHE.allow(isGreater, msg.sender);
```

### Contract Functions

- **`setSecret(secretNumber, proof)`**: Sets encrypted secret and activates game
- **`makeGuess(guess, proof)`**: Records an encrypted guess
- **`getHint(guess, proof)`**: Returns encrypted comparison results
- **`isGameActive()`**: Returns current game status
- **`owner()`**: Returns contract owner address

### Frontend Integration

The React frontend handles:
- **Wallet Connection**: MetaMask integration
- **FHEVM Instance**: SDK initialization and management
- **Encryption**: Client-side encryption of user inputs
- **Decryption**: User-friendly decryption of results
- **Transaction Management**: Gas estimation and transaction handling

## 📁 Project Structure

```
fhevm-react-template/
├── packages/
│   ├── fhevm-hardhat-template/     # Smart contracts
│   │   ├── contracts/
│   │   │   ├── PrivateGuessingGame.sol
│   │   │   └── FHECounter.sol
│   │   ├── deploy/
│   │   │   └── 01_PrivateGuessingGame.ts
│   │   └── hardhat.config.ts
│   ├── site/                       # React frontend
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx
│   │   ├── components/
│   │   │   ├── PrivateGuessingGameDemo.tsx
│   │   │   └── FHECounterDemo.tsx
│   │   ├── hooks/
│   │   │   ├── usePrivateGuessingGame.tsx
│   │   │   └── useFHECounter.tsx
│   │   └── abi/                    # Auto-generated contract ABIs
│   └── fhevm-react/                # FHEVM React SDK
└── scripts/                        # Deployment scripts
```

## 🔐 Security Features

- **Encrypted Storage**: Secret numbers are never stored in plaintext
- **Private Comparisons**: All comparisons happen on encrypted data
- **Access Control**: Only contract owner can set secrets
- **Input Validation**: Range checking for valid numbers (1-100)
- **Transaction Security**: Proper gas estimation and error handling

## 🌐 Network Support

### Sepolia Testnet (Recommended)
- **Chain ID**: 11155111
- **FHEVM Support**: Full FHEVM relayer integration
- **Gas Fees**: Requires Sepolia ETH

### Local Development
- **Chain ID**: 31337
- **FHEVM Support**: Mock FHEVM for testing
- **Gas Fees**: Free (local network)

## 🛠️ Development

### Adding New Features

1. **Smart Contract**: Modify `PrivateGuessingGame.sol`
2. **Deploy**: Run `npx hardhat deploy --network sepolia`
3. **Frontend**: Update React hooks and components
4. **Test**: Verify functionality on Sepolia

### Debugging

- **Console Logs**: Check browser console for FHEVM operations
- **MetaMask**: Verify network and account connection
- **Contract**: Use Hardhat tasks for direct contract interaction

## 📚 Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM React SDK](https://github.com/zama-ai/fhevm-react)
- [Sepolia Testnet](https://sepolia.etherscan.io/)
- [MetaMask Setup](https://metamask.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on Sepolia testnet
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Notes

- **Testnet Only**: This is for demonstration purposes on Sepolia testnet
- **Gas Fees**: Ensure you have sufficient Sepolia ETH for transactions
- **Network**: Always verify you're connected to Sepolia network
- **Security**: This is a demo - do not use for production without proper security audits

## 🎉 Acknowledgments

- **Zama**: For the FHEVM technology and SDK
- **FHEVM Community**: For documentation and examples
- **Ethereum Foundation**: For Sepolia testnet infrastructure

---

**Happy Guessing! 🎯🔐**