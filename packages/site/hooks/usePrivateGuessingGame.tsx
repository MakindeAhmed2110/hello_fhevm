"use client";

import { ethers } from "ethers";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FhevmDecryptionSignature,
  type FhevmInstance,
  type GenericStringStorage,
} from "@fhevm/react";

/*
  The following two files are automatically generated when `npx hardhat deploy` is called
  The <root>/packages/<contracts package dir>/deployments directory is parsed to retrieve 
  deployment information for PrivateGuessingGame.sol and the following files are generated:
  
  - <root>/packages/site/abi/PrivateGuessingGameABI.ts
  - <root>/packages/site/abi/PrivateGuessingGameAddresses.ts
*/
import { PrivateGuessingGameAddresses } from "@/abi/PrivateGuessingGameAddresses";
import { PrivateGuessingGameABI } from "@/abi/PrivateGuessingGameABI";

export type ClearValueType = {
  handle: string;
  clear: string | bigint | boolean;
};

type PrivateGuessingGameInfoType = {
  abi: typeof PrivateGuessingGameABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

/**
 * Resolves PrivateGuessingGame contract metadata for the given EVM `chainId`.
 */
function getPrivateGuessingGameByChainId(
  chainId: number | undefined
): PrivateGuessingGameInfoType {
  if (!chainId) {
    return { abi: PrivateGuessingGameABI.abi };
  }

  const entry =
    PrivateGuessingGameAddresses[chainId.toString() as keyof typeof PrivateGuessingGameAddresses];

  if (!("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: PrivateGuessingGameABI.abi, chainId };
  }

  return {
    address: entry?.address as `0x${string}` | undefined,
    chainId: entry?.chainId ?? chainId,
    chainName: entry?.chainName,
    abi: PrivateGuessingGameABI.abi,
  };
}

export const usePrivateGuessingGame = (parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: RefObject<
    (ethersSigner: ethers.JsonRpcSigner | undefined) => boolean
  >;
}) => {
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  //////////////////////////////////////////////////////////////////////////////
  // States + Refs
  //////////////////////////////////////////////////////////////////////////////

  const [gameActive, setGameActive] = useState<boolean | undefined>(undefined);
  const [owner, setOwner] = useState<string | undefined>(undefined);
  const [isEqualHandle, setIsEqualHandle] = useState<string | undefined>(undefined);
  const [isGreaterHandle, setIsGreaterHandle] = useState<string | undefined>(undefined);
  const [clearIsEqual, setClearIsEqual] = useState<ClearValueType | undefined>(undefined);
  const [clearIsGreater, setClearIsGreater] = useState<ClearValueType | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [isSettingSecret, setIsSettingSecret] = useState<boolean>(false);
  const [isMakingGuess, setIsMakingGuess] = useState<boolean>(false);
  const [isGettingHint, setIsGettingHint] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const privateGuessingGameRef = useRef<PrivateGuessingGameInfoType | undefined>(undefined);
  const isRefreshingRef = useRef<boolean>(isRefreshing);
  const isDecryptingRef = useRef<boolean>(isDecrypting);
  const isSettingSecretRef = useRef<boolean>(isSettingSecret);
  const isMakingGuessRef = useRef<boolean>(isMakingGuess);
  const isGettingHintRef = useRef<boolean>(isGettingHint);

  const isDecrypted = isEqualHandle && isEqualHandle === clearIsEqual?.handle;

  //////////////////////////////////////////////////////////////////////////////
  // PrivateGuessingGame
  //////////////////////////////////////////////////////////////////////////////

  const privateGuessingGame = useMemo(() => {
    const c = getPrivateGuessingGameByChainId(chainId);

    privateGuessingGameRef.current = c;

    if (!c.address) {
      setMessage(`PrivateGuessingGame deployment not found for chainId=${chainId}.`);
    }

    return c;
  }, [chainId]);

  //////////////////////////////////////////////////////////////////////////////
  // Game Status
  //////////////////////////////////////////////////////////////////////////////

  const isDeployed = useMemo(() => {
    if (!privateGuessingGame) {
      return undefined;
    }
    return (
      Boolean(privateGuessingGame.address) && privateGuessingGame.address !== ethers.ZeroAddress
    );
  }, [privateGuessingGame]);

  const canGetGameStatus = useMemo(() => {
    return privateGuessingGame.address && ethersReadonlyProvider && !isRefreshing;
  }, [privateGuessingGame.address, ethersReadonlyProvider, isRefreshing]);

  const refreshGameStatus = useCallback(() => {
    console.log("[usePrivateGuessingGame] call refreshGameStatus()");
    if (isRefreshingRef.current) {
      return;
    }

    if (
      !privateGuessingGameRef.current ||
      !privateGuessingGameRef.current?.chainId ||
      !privateGuessingGameRef.current?.address ||
      !ethersReadonlyProvider
    ) {
      setGameActive(undefined);
      setOwner(undefined);
      return;
    }

    isRefreshingRef.current = true;
    setIsRefreshing(true);

    const thisChainId = privateGuessingGameRef.current.chainId;
    const thisContractAddress = privateGuessingGameRef.current.address;

    const thisContract = new ethers.Contract(
      thisContractAddress,
      privateGuessingGameRef.current.abi,
      ethersReadonlyProvider
    );

    // Get game status first
    thisContract.isGameActive()
      .then((active) => {
        console.log("[usePrivateGuessingGame] isGameActive()=" + active);
        
        if (
          sameChain.current(thisChainId) &&
          thisContractAddress === privateGuessingGameRef.current?.address
        ) {
          setGameActive(active);
        }

        // Get owner
        return thisContract.owner();
      })
      .then((ownerAddress) => {
        console.log("[usePrivateGuessingGame] owner()=" + ownerAddress);
        
        if (
          sameChain.current(thisChainId) &&
          thisContractAddress === privateGuessingGameRef.current?.address
        ) {
          setOwner(ownerAddress);
        }

        isRefreshingRef.current = false;
        setIsRefreshing(false);
      })
      .catch((e) => {
        setMessage("PrivateGuessingGame status call failed! error=" + e);

        isRefreshingRef.current = false;
        setIsRefreshing(false);
      });
  }, [ethersReadonlyProvider, sameChain]);

  // Auto refresh the game status
  useEffect(() => {
    refreshGameStatus();
  }, [refreshGameStatus]);

  //////////////////////////////////////////////////////////////////////////////
  // Hint Decryption
  //////////////////////////////////////////////////////////////////////////////

  const canDecrypt = useMemo(() => {
    return (
      privateGuessingGame.address &&
      ethersSigner &&
      !isRefreshing &&
      !isDecrypting &&
      (isEqualHandle || isGreaterHandle) &&
      (isEqualHandle !== clearIsEqual?.handle || isGreaterHandle !== clearIsGreater?.handle)
    );
  }, [
    privateGuessingGame.address,
    ethersSigner,
    isRefreshing,
    isDecrypting,
    isEqualHandle,
    isGreaterHandle,
    clearIsEqual,
    clearIsGreater,
  ]);

  const decryptHint = useCallback(() => {
    if (isRefreshingRef.current || isDecryptingRef.current) {
      return;
    }

    if (!privateGuessingGame.address || !ethersSigner) {
      return;
    }

    if (!instance) {
      setMessage("FHEVM instance not available. Please wait for initialization.");
      return;
    }

    // Already computed (following FHECounter pattern)
    if (isEqualHandle === clearIsEqual?.handle && isGreaterHandle === clearIsGreater?.handle) {
      return;
    }

    if (!isEqualHandle && !isGreaterHandle) {
      setClearIsEqual(undefined);
      setClearIsGreater(undefined);
      return;
    }

    const thisChainId = chainId;
    const thisContractAddress = privateGuessingGame.address;
    const thisEthersSigner = ethersSigner;

    isDecryptingRef.current = true;
    setIsDecrypting(true);
    setMessage("Start decrypt hint...");

    const run = async () => {
      const isStale = () =>
        thisContractAddress !== privateGuessingGameRef.current?.address ||
        !sameChain.current(thisChainId) ||
        !sameSigner.current(thisEthersSigner);

      try {
        const sig: FhevmDecryptionSignature | null =
          await FhevmDecryptionSignature.loadOrSign(
            instance,
            [privateGuessingGame.address as `0x${string}`],
            ethersSigner,
            fhevmDecryptionSignatureStorage
          );

        if (!sig) {
          setMessage("Unable to build FHEVM decryption signature");
          return;
        }

        if (isStale()) {
          setMessage("Ignore FHEVM decryption");
          return;
        }

        setMessage("Call FHEVM userDecrypt...");

        // Build handles array (following FHECounter pattern exactly)
        const handles = [];
        if (isEqualHandle) handles.push({ handle: isEqualHandle, contractAddress: thisContractAddress });
        if (isGreaterHandle) handles.push({ handle: isGreaterHandle, contractAddress: thisContractAddress });

        const res = await instance.userDecrypt(
          handles,
          sig.privateKey,
          sig.publicKey,
          sig.signature,
          sig.contractAddresses,
          sig.userAddress,
          sig.startTimestamp,
          sig.durationDays
        );

        setMessage("FHEVM userDecrypt completed!");

        if (isStale()) {
          setMessage("Ignore FHEVM decryption");
          return;
        }

        // Store decrypted values (following FHECounter pattern exactly)
        if (isEqualHandle && res[isEqualHandle] !== undefined) {
          setClearIsEqual({ handle: isEqualHandle, clear: res[isEqualHandle] });
        }
        if (isGreaterHandle && res[isGreaterHandle] !== undefined) {
          setClearIsGreater({ handle: isGreaterHandle, clear: res[isGreaterHandle] });
        }

        const isEqualValue = isEqualHandle && res[isEqualHandle] !== undefined ? res[isEqualHandle] : 'N/A';
        const isGreaterValue = isGreaterHandle && res[isGreaterHandle] !== undefined ? res[isGreaterHandle] : 'N/A';
        setMessage(`Hint decrypted: isEqual=${isEqualValue}, isGreater=${isGreaterValue}`);
      } finally {
        isDecryptingRef.current = false;
        setIsDecrypting(false);
      }
    };

    run();
  }, [
    fhevmDecryptionSignatureStorage,
    ethersSigner,
    privateGuessingGame.address,
    instance,
    isEqualHandle,
    isGreaterHandle,
    clearIsEqual,
    clearIsGreater,
    chainId,
    sameChain,
    sameSigner,
  ]);

  //////////////////////////////////////////////////////////////////////////////
  // Set Secret
  //////////////////////////////////////////////////////////////////////////////

  const canSetSecret = useMemo(() => {
    return (
      privateGuessingGame.address &&
      instance &&
      ethersSigner &&
      !isRefreshing &&
      !isSettingSecret
    );
  }, [privateGuessingGame.address, instance, ethersSigner, isRefreshing, isSettingSecret]);

  const setSecret = useCallback(
    (secretNumber: number) => {
      if (isRefreshingRef.current || isSettingSecretRef.current) {
        return;
      }

      if (!privateGuessingGame.address || !instance || !ethersSigner || secretNumber < 1 || secretNumber > 100) {
        return;
      }

      const thisChainId = chainId;
      const thisContractAddress = privateGuessingGame.address;
      const thisEthersSigner = ethersSigner;
      const thisContract = new ethers.Contract(
        thisContractAddress,
        privateGuessingGame.abi,
        thisEthersSigner
      );

      isSettingSecretRef.current = true;
      setIsSettingSecret(true);
      setMessage(`Start setSecret(${secretNumber})...`);

      const run = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const isStale = () =>
          thisContractAddress !== privateGuessingGameRef.current?.address ||
          !sameChain.current(thisChainId) ||
          !sameSigner.current(thisEthersSigner);

        try {
          const input = instance.createEncryptedInput(
            thisContractAddress,
            thisEthersSigner.address
          );
          input.add32(secretNumber);

          // is CPU-intensive (browser may freeze a little when FHE-WASM modules are loading)
          const enc = await input.encrypt();

          if (isStale()) {
            setMessage(`Ignore setSecret(${secretNumber})`);
            return;
          }

          setMessage(`Call setSecret(${secretNumber})...`);

          // Call contract setSecret
          const tx: ethers.TransactionResponse = await thisContract.setSecret(
            enc.handles[0],
            enc.inputProof
          );

          setMessage(`Wait for tx:${tx.hash}...`);

          const receipt = await tx.wait();

          setMessage(`Call setSecret(${secretNumber}) completed status=${receipt?.status}`);

          if (isStale()) {
            setMessage(`Ignore setSecret(${secretNumber})`);
            return;
          }

          refreshGameStatus();
        } catch (e) {
          setMessage(`setSecret(${secretNumber}) Failed! error=${e}`);
        } finally {
          isSettingSecretRef.current = false;
          setIsSettingSecret(false);
        }
      };

      run();
    },
    [
      ethersSigner,
      privateGuessingGame.address,
      privateGuessingGame.abi,
      instance,
      chainId,
      refreshGameStatus,
      sameChain,
      sameSigner,
    ]
  );

  //////////////////////////////////////////////////////////////////////////////
  // Make Guess
  //////////////////////////////////////////////////////////////////////////////

  const canMakeGuess = useMemo(() => {
    return (
      privateGuessingGame.address &&
      ethersSigner &&
      !isRefreshing &&
      !isMakingGuess
    );
  }, [privateGuessingGame.address, ethersSigner, isRefreshing, isMakingGuess]);

  const makeGuess = useCallback(
    (guessNumber: number) => {
      if (isRefreshingRef.current || isMakingGuessRef.current) {
        return;
      }

      if (!privateGuessingGame.address || !ethersSigner || guessNumber < 1 || guessNumber > 100) {
        return;
      }

      if (!instance) {
        setMessage("FHEVM instance not available. Please wait for initialization.");
        return;
      }

      const thisChainId = chainId;
      const thisContractAddress = privateGuessingGame.address;
      const thisEthersSigner = ethersSigner;
      const thisContract = new ethers.Contract(
        thisContractAddress,
        privateGuessingGame.abi,
        thisEthersSigner
      );

      isMakingGuessRef.current = true;
      setIsMakingGuess(true);
      setMessage(`Start makeGuess(${guessNumber})...`);

      const run = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const isStale = () =>
          thisContractAddress !== privateGuessingGameRef.current?.address ||
          !sameChain.current(thisChainId) ||
          !sameSigner.current(thisEthersSigner);

        try {
          const input = instance.createEncryptedInput(
            thisContractAddress,
            thisEthersSigner.address
          );
          input.add32(guessNumber);

          // is CPU-intensive (browser may freeze a little when FHE-WASM modules are loading)
          const enc = await input.encrypt();

          if (isStale()) {
            setMessage(`Ignore makeGuess(${guessNumber})`);
            return;
          }

          setMessage(`Call makeGuess(${guessNumber})...`);

          // Call contract makeGuess
          const tx: ethers.TransactionResponse = await thisContract.makeGuess(
            enc.handles[0],
            enc.inputProof
          );

          setMessage(`Wait for tx:${tx.hash}...`);

          const receipt = await tx.wait();

          setMessage(`Call makeGuess(${guessNumber}) completed status=${receipt?.status}`);

          if (isStale()) {
            setMessage(`Ignore makeGuess(${guessNumber})`);
            return;
          }

          refreshGameStatus();
        } catch (e) {
          setMessage(`makeGuess(${guessNumber}) Failed! error=${e}`);
        } finally {
          isMakingGuessRef.current = false;
          setIsMakingGuess(false);
        }
      };

      run();
    },
    [
      ethersSigner,
      privateGuessingGame.address,
      privateGuessingGame.abi,
      instance,
      chainId,
      refreshGameStatus,
      sameChain,
      sameSigner,
    ]
  );

  //////////////////////////////////////////////////////////////////////////////
  // Get Hint
  //////////////////////////////////////////////////////////////////////////////

  const canGetHint = useMemo(() => {
    return (
      privateGuessingGame.address &&
      ethersSigner &&
      !isRefreshing &&
      !isGettingHint
    );
  }, [privateGuessingGame.address, ethersSigner, isRefreshing, isGettingHint]);

  const getHint = useCallback(
    (guessNumber: number) => {
      if (isRefreshingRef.current || isGettingHintRef.current) {
        return;
      }

      if (!privateGuessingGame.address || !ethersSigner || guessNumber < 1 || guessNumber > 100) {
        return;
      }

      if (!instance) {
        setMessage("FHEVM instance not available. Please wait for initialization.");
        return;
      }

      const thisChainId = chainId;
      const thisContractAddress = privateGuessingGame.address;
      const thisEthersSigner = ethersSigner;
      const thisContract = new ethers.Contract(
        thisContractAddress,
        privateGuessingGame.abi,
        thisEthersSigner
      );

      isGettingHintRef.current = true;
      setIsGettingHint(true);
      setMessage(`Start getHint(${guessNumber})...`);

      const run = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const isStale = () =>
          thisContractAddress !== privateGuessingGameRef.current?.address ||
          !sameChain.current(thisChainId) ||
          !sameSigner.current(thisEthersSigner);

        try {
          const input = instance.createEncryptedInput(
            thisContractAddress,
            thisEthersSigner.address
          );
          input.add32(guessNumber);

          // is CPU-intensive (browser may freeze a little when FHE-WASM modules are loading)
          const enc = await input.encrypt();

          if (isStale()) {
            setMessage(`Ignore getHint(${guessNumber})`);
            return;
          }

          setMessage(`Call getHint(${guessNumber})...`);

          // Call contract getHint
          const result = await thisContract.getHint(
            enc.handles[0],
            enc.inputProof
          );

          setMessage(`Call getHint(${guessNumber}) completed`);

          if (isStale()) {
            setMessage(`Ignore getHint(${guessNumber})`);
            return;
          }

          // Store the returned handles (following FHECounter pattern)
          setIsEqualHandle(result[0]);
          setIsGreaterHandle(result[1]);
          
          setMessage(`Hint handles stored: isEqual=${result[0]}, isGreater=${result[1]}`);

        } catch (e) {
          setMessage(`getHint(${guessNumber}) Failed! error=${e}`);
        } finally {
          isGettingHintRef.current = false;
          setIsGettingHint(false);
        }
      };

      run();
    },
    [
      ethersSigner,
      privateGuessingGame.address,
      privateGuessingGame.abi,
      instance,
      chainId,
      sameChain,
      sameSigner,
    ]
  );

  return {
    contractAddress: privateGuessingGame.address,
    canDecrypt,
    canGetGameStatus,
    canSetSecret,
    canMakeGuess,
    canGetHint,
    setSecret,
    makeGuess,
    getHint,
    decryptHint,
    refreshGameStatus,
    isDecrypted,
    message,
    gameActive,
    owner,
    isEqualHandle,
    isGreaterHandle,
    clearIsEqual: clearIsEqual?.clear,
    clearIsGreater: clearIsGreater?.clear,
    isDecrypting,
    isRefreshing,
    isSettingSecret,
    isMakingGuess,
    isGettingHint,
    isDeployed,
  };
};