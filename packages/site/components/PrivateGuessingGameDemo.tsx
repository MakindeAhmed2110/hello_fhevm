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
    <div className="grid w-full gap-4">
      <div className="col-span-full mx-20 bg-black text-white">
        <p className="font-semibold text-3xl m-5">
          Private Number Guessing Game -{" "}
          <span className="font-mono font-normal text-gray-400">
            PrivateGuessingGame.sol
          </span>
        </p>
      </div>

      {/* Game Info */}
      <div className="col-span-full mx-20 mt-4 px-5 pb-4 rounded-lg bg-white border-2 border-black">
        <p className={titleClass}>Game Information</p>
        {printProperty("Contract Address", privateGuessingGame.contractAddress)}
        {printProperty("Game Active", privateGuessingGame.gameActive)}
        {printProperty("Owner", privateGuessingGame.owner)}
        {printProperty("Your Address", ethersSigner?.address)}
        {printProperty("Is Owner", privateGuessingGame.owner === ethersSigner?.address)}
      </div>

      {/* Game Master Section */}
      {privateGuessingGame.owner === ethersSigner?.address && (
        <div className="col-span-full mx-20 px-5 pb-4 rounded-lg bg-white border-2 border-black">
          <p className={titleClass}>Game Master Controls</p>
          
          <div className="mt-4 space-y-4">
            {!privateGuessingGame.gameActive ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Number (1-100):
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={secretNumberInput}
                  onChange={(e) => setSecretNumberInput(e.target.value)}
                  className={inputClass}
                  placeholder="Enter secret number (1-100)"
                />
                <button
                  className={`${buttonClass} mt-2`}
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
                    ? "Set Secret & Start Game"
                    : privateGuessingGame.isSettingSecret
                      ? "Setting Secret..."
                      : "Cannot set secret"}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-green-600 font-semibold mb-4">Game is Active!</p>
                <p className="text-sm text-gray-600">Players can now make guesses and get hints.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Section */}
      {privateGuessingGame.gameActive && (
        <div className="col-span-full mx-20 px-5 pb-4 rounded-lg bg-white border-2 border-black">
          <p className={titleClass}>Make Your Guess</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Guess (1-100):
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                className={inputClass}
                placeholder="Enter your guess (1-100)"
              />
              <div className="flex gap-2 mt-2">
                <button
                  className={`${buttonClass} flex-1`}
                  disabled={!privateGuessingGame.canMakeGuess || !guessInput}
                  onClick={() => {
                    const guess = parseInt(guessInput);
                    if (guess >= 1 && guess <= 100) {
                      privateGuessingGame.makeGuess(guess);
                    }
                  }}
                >
                  {privateGuessingGame.canMakeGuess
                    ? "Make Guess"
                    : privateGuessingGame.isMakingGuess
                      ? "Making Guess..."
                      : "Cannot make guess"}
                </button>
                <button
                  className={`${buttonClass} flex-1`}
                  disabled={!privateGuessingGame.canGetHint || !guessInput}
                  onClick={() => {
                    const guess = parseInt(guessInput);
                    if (guess >= 1 && guess <= 100) {
                      privateGuessingGame.getHint(guess);
                    }
                  }}
                >
                  {privateGuessingGame.canGetHint
                    ? "Get Hint"
                    : privateGuessingGame.isGettingHint
                      ? "Getting Hint..."
                      : "Cannot get hint"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint Results */}
      <div className="col-span-full mx-20 px-5 pb-4 rounded-lg bg-white border-2 border-black">
        <p className={titleClass}>Hint Results</p>
        {printProperty("Is Equal Handle", privateGuessingGame.isEqualHandle)}
        {printProperty("Is Greater Handle", privateGuessingGame.isGreaterHandle)}
        {printProperty("Clear Is Equal", privateGuessingGame.clearIsEqual)}
        {printProperty("Clear Is Greater", privateGuessingGame.clearIsGreater)}
        
        <button
          className={buttonClass}
          disabled={!privateGuessingGame.canDecrypt}
          onClick={privateGuessingGame.decryptHint}
        >
          {privateGuessingGame.canDecrypt
            ? "Decrypt Hint"
            : privateGuessingGame.isDecrypted
              ? `Hint decrypted: Equal=${privateGuessingGame.clearIsEqual}, Greater=${privateGuessingGame.clearIsGreater}`
              : privateGuessingGame.isDecrypting
                ? "Decrypting..."
                : "Nothing to decrypt"}
        </button>
      </div>

      {/* Debug Information */}
      <div className="col-span-full mx-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white border-2 border-black pb-4 px-4">
            <p className={titleClass}>FHEVM instance</p>
            {printProperty(
              "Fhevm Instance",
              fhevmInstance ? "OK" : "undefined"
            )}
            {printProperty("Fhevm Status", fhevmStatus)}
            {printProperty("Fhevm Error", fhevmError ?? "No Error")}
          </div>
          <div className="rounded-lg bg-white border-2 border-black pb-4 px-4">
            <p className={titleClass}>Status</p>
            {printProperty("isRefreshing", privateGuessingGame.isRefreshing)}
            {printProperty("isDecrypting", privateGuessingGame.isDecrypting)}
            {printProperty("isSettingSecret", privateGuessingGame.isSettingSecret)}
            {printProperty("isMakingGuess", privateGuessingGame.isMakingGuess)}
            {printProperty("isGettingHint", privateGuessingGame.isGettingHint)}
            {printProperty("canGetGameStatus", privateGuessingGame.canGetGameStatus)}
            {printProperty("canDecrypt", privateGuessingGame.canDecrypt)}
          </div>
        </div>
      </div>

      <div className="col-span-full mx-20 p-4 rounded-lg bg-white border-2 border-black">
        {printProperty("Message", privateGuessingGame.message)}
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
