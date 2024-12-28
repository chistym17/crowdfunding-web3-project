'use client';
import { useState, useEffect } from "react";
import { useContract } from "./context/ContractContext";
import { ethers } from "ethers";

export default function Home() {
  const { contract } = useContract();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [contribution, setContribution] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");

  const checkConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!contract) return;
      const tx = await contract.createCampaign(
        title,
        description,
        ethers.parseEther(goal)
      );
      await tx.wait();
      alert("Campaign created successfully!");
      setTitle("");
      setDescription("");
      setGoal("");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign");
    }
  };

  const contributeToCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!contract) return;
      const tx = await contract.contribute(campaignId, {
        value: ethers.parseEther(contribution),
      });
      await tx.wait();
      alert("Contribution successful!");
      setCampaignId("");
      setContribution("");
    } catch (error) {
      console.error("Error contributing to campaign:", error);
      alert("Error contributing to campaign");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {isConnected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
          </span>
        </div>
        <header className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Decentralized Crowdfunding
          </h1>
          <p className="text-gray-400 text-lg">
            Create or support campaigns with blockchain technology
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-blue-500 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Create Campaign
            </h2>
            <form onSubmit={createCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                  placeholder="Enter campaign title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition h-32"
                  required
                  placeholder="Describe your campaign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Funding Goal (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                  placeholder="0.00 ETH"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-[1.02]"
              >
                Launch Campaign
              </button>
            </form>
          </div>

          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-green-500 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Contribute
            </h2>
            <form onSubmit={contributeToCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign ID</label>
                <input
                  type="number"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  required
                  placeholder="Enter campaign ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contribution Amount (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  required
                  placeholder="0.00 ETH"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-800 transition duration-300 transform hover:scale-[1.02]"
              >
                Send Contribution
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
