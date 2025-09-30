"use client";

import { useFhevm } from "@fhevm/react";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { usePrivateGuessingGame } from "../hooks/usePrivateGuessingGame";
import { errorNotDeployed } from "./ErrorNotDeployed";
import { useState } from "react";

/*
 * Main PrivateGuessingGame React component
 * Features:
 *  - Set a secret number (owner only)
 *  - Make encrypted guesses
 *  - Get encrypted hints
 *  - Decrypt hint results
 */
export const PrivateGuessingGameDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  // Local state for user input
  const [secretNumberInput, setSecretNumberInput] = useState<string>("");
  const [guessInput, setGuessInput] = useState<string>("");

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // usePrivateGuessingGame hook containing all the game logic
  //////////////////////////////////////////////////////////////////////////////

  const privateGuessingGame = usePrivateGuessingGame({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI Components
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl bg-black px-4 py-4 font-semibold text-white shadow-sm " +
    "transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const titleClass = "font-semibold text-black text-lg mt-4";

  if (!isConnected) {
    return (
      <div className="mx-auto">
        <button
          className={buttonClass}
          disabled={isConnected}
          onClick={connect}
        >
          <span className="text-4xl p-6">Connect to MetaMask</span>
        </button>
      </div>
    );
  }

  if (privateGuessingGame.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Connect Wallet Button - Top Right */}
      {!isConnected && (
        <div className="absolute top-8 right-8 z-20">
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 text-lg backdrop-blur-sm"
            onClick={connect}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05c-3.124-3.124-8.19-3.124-11.314 0a1 1 0 01-1.414-1.414c4.01-4.01 10.522-4.01 14.532 0a1 1 0 010 1.414zM12.12 13.88c-1.171-1.171-3.073-1.171-4.244 0a1 1 0 01-1.415-1.415c2.051-2.051 5.378-2.051 7.429 0a1 1 0 010 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </button>
        </div>
      )}

      {/* Main Game Container - Centered and Cohesive */}
      <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12 relative z-20">
        
        {/* Game Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6" style={{
            textShadow: '4px 4px 0px #ff69b4, 8px 8px 0px #ff1493, 12px 12px 20px rgba(0,0,0,0.5)',
            fontFamily: 'Arial Black, sans-serif'
          }}>
            GUESS THE NUMBER
          </h1>
          <div className="text-xl text-white font-semibold backdrop-blur-sm bg-black/20 rounded-xl px-6 py-3 inline-block">
            Private & Encrypted Guessing Game
          </div>
        </div>

        {/* Active Address Display - Top of game area */}
        {isConnected && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-green-400">
              <div className="text-sm font-semibold text-green-600 mb-1 text-center">Active Address</div>
              <div className="text-xs font-mono text-gray-700 break-all max-w-64 text-center">
                {ethersSigner?.address || 'Not connected'}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Cards - Grouped together */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {/* Secret Number Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-4xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border-4 border-white/30">
            <div className="text-6xl font-bold text-white text-center">
              {privateGuessingGame.gameActive ? "?" : "🎯"}
            </div>
            <div className="text-white text-center mt-3 font-semibold text-lg">
              {privateGuessingGame.gameActive ? "Secret" : "Ready"}
            </div>
          </div>

          {/* Your Guess Card */}
          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-4xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border-4 border-white/30">
            <div className="text-6xl font-bold text-white text-center">
              {guessInput || "?"}
            </div>
            <div className="text-white text-center mt-3 font-semibold text-lg">
              Your Guess
            </div>
          </div>

          {/* Hint Card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-4xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border-4 border-white/30">
            <div className="text-6xl font-bold text-white text-center">
              {privateGuessingGame.clearIsEqual !== undefined ? 
                (privateGuessingGame.clearIsEqual ? "🎯" : "📈") : "?"}
            </div>
            <div className="text-white text-center mt-3 font-semibold text-lg">
              Hint
            </div>
          </div>
        </div>

        {/* Game Controls - Grouped together */}
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Game Master Controls */}
          {privateGuessingGame.owner === ethersSigner?.address && !privateGuessingGame.gameActive && (
            <div className="bg-white/95 backdrop-blur-sm rounded-4xl p-8 shadow-2xl border-4 border-purple-200">
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">🎮 Game Master</h3>
              <div className="space-y-8">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={secretNumberInput}
                  onChange={(e) => setSecretNumberInput(e.target.value)}
                  className="w-full px-8 py-6 text-3xl text-center border-4 border-gray-300 rounded-3xl focus:border-purple-500 focus:outline-none shadow-lg"
                  placeholder="Enter secret number (1-100)"
                />
                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-12 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-200 text-2xl"
                  disabled={!privateGuessingGame.canSetSecret || !secretNumberInput}
                  onClick={() => {
                    const secretNumber = parseInt(secretNumberInput);
                    if (secretNumber >= 1 && secretNumber <= 100) {
                      privateGuessingGame.setSecret(secretNumber);
                      setSecretNumberInput("");
                    }
                  }}
                >
                  {privateGuessingGame.canSetSecret
                    ? "🎯 Set Secret & Start Game"
                    : privateGuessingGame.isSettingSecret
                      ? "⏳ Setting Secret..."
                      : "❌ Cannot set secret"}
                </button>
              </div>
            </div>
          )}

          {/* Game Active Status */}
          {privateGuessingGame.gameActive && (
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-4xl p-8 shadow-2xl text-center border-4 border-green-300 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white mb-3">🎉 Game is Active!</div>
              <div className="text-white text-xl">Players can now make guesses and get hints</div>
            </div>
          )}

          {/* Player Controls */}
          {privateGuessingGame.gameActive && (
            <div className="bg-white/95 backdrop-blur-sm rounded-4xl p-8 shadow-2xl border-4 border-blue-200">
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">🎯 Make Your Guess</h3>
              <div className="space-y-8">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  className="w-full px-8 py-6 text-3xl text-center border-4 border-gray-300 rounded-3xl focus:border-blue-500 focus:outline-none shadow-lg"
                  placeholder="Enter your guess (1-100)"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-8 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-200 text-2xl"
                    disabled={!privateGuessingGame.canMakeGuess || !guessInput}
                    onClick={() => {
                      const guess = parseInt(guessInput);
                      if (guess >= 1 && guess <= 100) {
                        privateGuessingGame.makeGuess(guess);
                      }
                    }}
                  >
                    {privateGuessingGame.canMakeGuess
                      ? "🎯 Make Guess"
                      : privateGuessingGame.isMakingGuess
                        ? "⏳ Making Guess..."
                        : "❌ Cannot make guess"}
                  </button>
                  
                  <button
                    className="bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-8 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-200 text-2xl"
                    disabled={!privateGuessingGame.canGetHint || !guessInput}
                    onClick={() => {
                      const guess = parseInt(guessInput);
                      if (guess >= 1 && guess <= 100) {
                        privateGuessingGame.getHint(guess);
                      }
                    }}
                  >
                    {privateGuessingGame.canGetHint
                      ? "💡 Get Hint"
                      : privateGuessingGame.isGettingHint
                        ? "⏳ Getting Hint..."
                        : "❌ Cannot get hint"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hint Results */}
          {(privateGuessingGame.isEqualHandle || privateGuessingGame.isGreaterHandle) && (
            <div className="bg-white/95 backdrop-blur-sm rounded-4xl p-8 shadow-2xl border-4 border-purple-200">
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">🔍 Hint Results</h3>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-blue-100 rounded-3xl p-8 border-4 border-blue-200">
                    <div className="text-2xl font-semibold text-blue-800 mb-3">Is Equal</div>
                    <div className="text-4xl font-bold text-blue-600">
                      {privateGuessingGame.clearIsEqual !== undefined ? 
                        (privateGuessingGame.clearIsEqual ? "✅ Yes" : "❌ No") : "🔒 Encrypted"}
                    </div>
                  </div>
                  <div className="bg-orange-100 rounded-3xl p-8 border-4 border-orange-200">
                    <div className="text-2xl font-semibold text-orange-800 mb-3">Is Greater</div>
                    <div className="text-4xl font-bold text-orange-600">
                      {privateGuessingGame.clearIsGreater !== undefined ? 
                        (privateGuessingGame.clearIsGreater ? "✅ Yes" : "❌ No") : "🔒 Encrypted"}
                    </div>
                  </div>
                </div>
                
                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-12 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-200 text-2xl"
                  disabled={!privateGuessingGame.canDecrypt}
                  onClick={privateGuessingGame.decryptHint}
                >
                  {privateGuessingGame.canDecrypt
                    ? "🔓 Decrypt Hint"
                    : privateGuessingGame.isDecrypted
                      ? "✅ Hint Decrypted"
                      : privateGuessingGame.isDecrypting
                        ? "⏳ Decrypting..."
                        : "❌ Nothing to decrypt"}
                </button>
              </div>
            </div>
          )}

          {/* Status Message */}
          {privateGuessingGame.message && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-gray-200">
              <div className="text-center text-gray-700 font-medium text-xl">
                {privateGuessingGame.message}
              </div>
            </div>
          )}
        </div>

        {/* Fun Interactive Elements */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-300 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-blue-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-60" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 z-10">
          <div className="text-4xl animate-spin" style={{animationDuration: '3s'}}>🌟</div>
        </div>
        <div className="absolute bottom-20 right-20 z-10">
          <div className="text-3xl animate-bounce">🎈</div>
        </div>
        <div className="absolute top-1/2 left-8 z-10">
          <div className="text-2xl animate-pulse">✨</div>
        </div>
        <div className="absolute top-1/2 right-8 z-10">
          <div className="text-2xl animate-pulse" style={{animationDelay: '1s'}}>✨</div>
        </div>
      </div>
    </div>
  );
};

function printProperty(name: string, value: unknown) {
  let displayValue: string;

  if (typeof value === "boolean") {
    return printBooleanProperty(name, value);
  } else if (typeof value === "string" || typeof value === "number") {
    displayValue = String(value);
  } else if (typeof value === "bigint") {
    displayValue = String(value);
  } else if (value === null) {
    displayValue = "null";
  } else if (value === undefined) {
    displayValue = "undefined";
  } else if (value instanceof Error) {
    displayValue = value.message;
  } else {
    displayValue = JSON.stringify(value);
  }
  return (
    <p className="text-black">
      {name}:{" "}
      <span className="font-mono font-semibold text-black">{displayValue}</span>
    </p>
  );
}

function printBooleanProperty(name: string, value: boolean) {
  if (value) {
    return (
      <p className="text-black">
        {name}:{" "}
        <span className="font-mono font-semibold text-green-500">true</span>
      </p>
    );
  }

  return (
    <p className="text-black">
      {name}:{" "}
      <span className="font-mono font-semibold text-red-500">false</span>
    </p>
  );
}