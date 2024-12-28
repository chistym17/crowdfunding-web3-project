'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import { Contract } from "ethers";
import { getContract } from "../utils/contract";

interface ContractContextType {
  contract: Contract | null;
}

const ContractContext = createContext<ContractContextType>({ contract: null });

export const ContractProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedContract, setConnectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setConnectedContract(getContract());
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };
    initializeContract();
  }, []);

  return (
    <ContractContext.Provider value={{ contract: connectedContract }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = (): ContractContextType => useContext(ContractContext);
