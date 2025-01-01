'use client';
import { useState } from "react";
import { useContract } from "./context/ContractContext";
import { ethers } from "ethers";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const { contract } = useContract();
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [contribution, setContribution] = useState("");

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating campaign...');
    try {
      if (!contract) return;
      const tx = await contract.create_campaign(
        ethers.parseEther(goal),
        BigInt(new Date(deadline).getTime() / 1000),
        { gasLimit: 500000 }
      );
      await tx.wait();

      try {
        const campaign = await contract.campaigns(0);
        toast.success(`Campaign created successfully! Try contributing to ID: 0`, { id: loadingToast });
      } catch {
        toast.success('Campaign created successfully! Try contributing with ID: 0', { id: loadingToast });
      }

      setGoal("");
      setDeadline("");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error('Failed to create campaign', { id: loadingToast });
    }
  };

  const contributeToCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Processing contribution...');
    try {
      if (!contract) return;
      const tx = await contract.contribute(Number(campaignId), {
        value: ethers.parseEther(contribution),
      });
      await tx.wait();
      toast.success('Contribution successful!', { id: loadingToast });
      setCampaignId("");
      setContribution("");
    } catch (error) {
      console.error("Error contributing to campaign:", error);
      toast.error('Failed to contribute', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto p-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Crowdfunding Platform
          </h1>
          <p className="text-gray-400">Create or support campaigns with blockchain technology</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Create Campaign</h2>
            </div>
            <form onSubmit={createCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Goal (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  required
                  placeholder="0.00 ETH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Launch Campaign
              </button>
            </form>
          </div>

          <div className="flex-1 backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-green-500/20 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Contribute</h2>
            </div>
            <form onSubmit={contributeToCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign ID</label>
                <input
                  type="number"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all duration-300"
                  required
                  placeholder="Enter campaign ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all duration-300"
                  required
                  placeholder="0.00 ETH"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02]"
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
