// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title A confidential Private Number Guessing Game
/// @author fhevm-hardhat-template
/// @notice A game where players guess a secret number with encrypted hints using FHEVM.
/// The secret number is set by the contract owner and remains encrypted throughout the game.
contract PrivateGuessingGame is SepoliaConfig {
    euint32 private _secretNumber;
    address private _owner;
    bool private _gameActive;
    
    // Events
    event SecretSet(address indexed owner);
    event GuessMade(address indexed player, uint256 guessNumber);
    event GameActivated();
    event HintResult(bool isEqual, bool isGreater);
    
    // Errors
    error NotOwner();
    error GameNotActive();
    error GameAlreadyActive();
    error InvalidRange();
    
    /// @notice Constructor sets the contract owner
    constructor() {
        _owner = msg.sender;
    }
    
    /// @notice Modifier to ensure only the owner can call certain functions
    modifier onlyOwner() {
        if (msg.sender != _owner) revert NotOwner();
        _;
    }
    
    /// @notice Modifier to ensure the game is active
    modifier gameActive() {
        if (!_gameActive) revert GameNotActive();
        _;
    }
    
    /// @notice Sets the secret number for the guessing game (owner only)
    /// @param secretEuint32 the encrypted secret number
    /// @param secretProof the proof for the encrypted secret
    /// @dev The secret number should be between 1 and 100 inclusive
    function setSecret(externalEuint32 secretEuint32, bytes calldata secretProof) external onlyOwner {
        if (_gameActive) revert GameAlreadyActive();
        
        euint32 encryptedSecret = FHE.fromExternal(secretEuint32, secretProof);
        
        // Store the encrypted secret
        _secretNumber = encryptedSecret;
        
        // Allow the contract to use the secret for comparisons
        FHE.allowThis(_secretNumber);
        
        // Activate the game
        _gameActive = true;
        
        emit SecretSet(msg.sender);
        emit GameActivated();
    }
    
    /// @notice Makes a guess for the secret number
    /// @param guessEuint32 the encrypted guess
    /// @param guessProof the proof for the encrypted guess
    /// @dev The guess should be between 1 and 100 inclusive
    function makeGuess(externalEuint32 guessEuint32, bytes calldata guessProof) external gameActive {
        euint32 encryptedGuess = FHE.fromExternal(guessEuint32, guessProof);
        
        // Allow the contract to use the guess for comparisons
        FHE.allowThis(encryptedGuess);
        
        // Store the guess for potential future use (like tracking attempts)
        // Note: In a real implementation, you might want to store multiple guesses
        
        emit GuessMade(msg.sender, 0); // We can't decrypt to show the actual guess
    }
    
    /// @notice Gets a hint about the secret number (confidential comparison)
    /// @param guessEuint32 the encrypted guess to compare against the secret
    /// @param guessProof the proof for the encrypted guess
    /// @dev This function performs FHE comparisons and returns encrypted results
    function getHint(externalEuint32 guessEuint32, bytes calldata guessProof) 
        external 
        gameActive 
        returns (ebool isEqual, ebool isGreater)
    {
        euint32 encryptedGuess = FHE.fromExternal(guessEuint32, guessProof);
        
        // Perform encrypted comparisons
        isEqual = FHE.eq(_secretNumber, encryptedGuess);
        isGreater = FHE.gt(encryptedGuess, _secretNumber);
        
        // Allow the caller to decrypt the results
        FHE.allow(isEqual, msg.sender);
        FHE.allow(isGreater, msg.sender);
    }
    
    /// @notice Gets the current game status
    /// @return active true if the game is active, false otherwise
    function isGameActive() external view returns (bool active) {
        return _gameActive;
    }
    
    /// @notice Gets the contract owner
    /// @return owner the address of the contract owner
    function owner() external view returns (address) {
        return _owner;
    }
    
    /// @notice Resets the game (owner only)
    /// @dev This deactivates the game and clears the secret
    function resetGame() external onlyOwner {
        _gameActive = false;
        // Note: The secret number remains encrypted in storage but is effectively "cleared" for gameplay
    }
}
