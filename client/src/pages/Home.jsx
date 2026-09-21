import React, { useState, useEffect } from 'react';

export default function Home({ setActiveTab }) {
  const [poolData, setPoolData] = useState(null);
  const [featuredCharities, setFeaturedCharities] = useState([]);

  useEffect(() => {
    fetch('/api/draws/pool')
      .then(res => res.json())
      .then(data => setPoolData(data))
      .catch(() => {});

    fetch('/api/charities?featured=true')
      .then(res => res.json())
      .then(data => setFeaturedCharities(data.charities || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center pt-8 pb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#131B2A] border border-[#1E293B] text-xs font-semibold text-[#E0B589] mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
          <span>March 2026 Monthly Charity Draw Active</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight px-2">
          Where Every Score{' '}
          <span className="font-serif italic font-normal text-[#E0B589]">Powers a Cause.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed px-2">
          Not another traditional golf leaderboard. Digital Heroes links your real weekend golf scores to direct philanthropic impact and life-changing monthly prize pools.
        </p>

        {/* Live Pool Banner */}
        <div className="mt-8 max-w-3xl mx-auto divide-y sm:divide-y-0 sm:divide-x divide-[#1E293B] flex flex-col sm:flex-row p-0 rounded-2xl bg-[#131B2A]/90 border border-[#1E293B] shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="p-5 flex-1 text-left sm:text-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Prize Pool</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#E0B589] mt-1">
              ${poolData ? poolData.pool.totalPrizePool.toLocaleString() : '4,850'}
            </p>
            <p className="text-xs text-emerald-400 mt-1">Includes Rollover Jackpot</p>
          </div>
          <div className="p-5 flex-1 text-left sm:text-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">5-Match Jackpot</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ${poolData ? poolData.pool.tiers.tier5.poolShare.toLocaleString() : '3,190'}
            </p>
            <p className="text-xs text-[#E0B589] mt-1">40% Share + Rollover</p>
          </div>
          <div className="p-5 flex-1 text-left sm:text-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Charity Raised</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ${poolData ? poolData.pool.totalCharityRaised.toLocaleString() : '1,820'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Min 10% from every fee</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 px-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-[#E0B589] hover:bg-[#C99E72] text-black transition-all shadow-xl shadow-[#E0B589]/20"
          >
            Enter Scores & Join Draw
          </button>
          <button 
            onClick={() => setActiveTab('charities')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-[#131B2A] hover:bg-[#1E293B] border border-[#1E293B] text-white transition-all"
          >
            Explore Charities
          </button>
        </div>
      </section>

      {/* The 3 Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#131B2A] border border-[#1E293B] hover:border-[#E0B589]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#E0B589]/10 text-[#E0B589] flex items-center justify-center font-bold text-xl mb-6">
            01
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Log 5 Rolling Scores</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Record your latest Stableford scores (1–45 points). Only your latest 5 rounds are kept, creating a fresh, active set for every month's draw.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#131B2A] border border-[#1E293B] hover:border-[#E0B589]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#E0B589]/10 text-[#E0B589] flex items-center justify-center font-bold text-xl mb-6">
            02
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Direct Charitable Impact</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every subscription allocates at least 10% directly to your chosen grassroots charity. Increase your contribution voluntarily anytime.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#131B2A] border border-[#1E293B] hover:border-[#E0B589]/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#E0B589]/10 text-[#E0B589] flex items-center justify-center font-bold text-xl mb-6">
            03
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Win with Match Tiers</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Match 3, 4, or 5 numbers in the monthly draw. The 5-match jackpot rolls over if unclaimed, growing larger every round.
          </p>
        </div>
      </section>

      {/* Featured Charity Spotlight */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Featured Causes in the Spotlight</h2>
          <p className="text-gray-400 mt-2">Empowering communities through purposeful sports giving.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredCharities.map(charity => (
            <div key={charity.id} className="rounded-2xl overflow-hidden bg-[#131B2A] border border-[#1E293B] flex flex-col sm:flex-row">
              <img src={charity.imageUrl} alt={charity.name} className="w-full sm:w-48 h-48 sm:h-auto object-cover" />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[#E0B589]/10 text-[#E0B589]">
                    Spotlight Cause
                  </span>
                  <h4 className="text-xl font-bold text-white mt-2">{charity.name}</h4>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3">{charity.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#1E293B] flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">Eligible Recipient</span>
                  <button 
                    onClick={() => setActiveTab('charities')}
                    className="text-xs font-semibold text-[#E0B589] hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
