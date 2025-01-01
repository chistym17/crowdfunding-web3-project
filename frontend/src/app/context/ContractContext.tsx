'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import { Contract } from "ethers";
import { initContract } from "../utils/contract";
import toast from 'react-hot-toast';

interface ContractContextType {
  contract: Contract | null;
  isLoading: boolean;
}

const ContractContext = createContext<ContractContextType>({
  contract: null,
  isLoading: true
});

export const ContractProvider = ({ children }: { children: React.ReactNode }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        setIsLoading(true);
        const newContract = await initContract();
        setContract(newContract);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        toast.error("Please connect your wallet");
      } finally {
        setIsLoading(false);
      }
    };

    if (window.ethereum) {
      initializeContract();

      window.ethereum.on('accountsChanged', () => {
        initializeContract();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } else {
      toast.error("Please install MetaMask");
      setIsLoading(false);
    }
  }, []);

  return (
    <ContractContext.Provider value={{ contract, isLoading }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
