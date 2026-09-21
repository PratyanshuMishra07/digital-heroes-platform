import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('draws'); // draws, winners, charities, users, stats
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [charities, setCharities] = useState([]);
  const [drawMode, setDrawMode] = useState('algorithmic'); // random vs algorithmic
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  // New charity form state
  const [newCharityName, setNewCharityName] = useState('');
  const [newCharityTagline, setNewCharityTagline] = useState('');
  const [newCharityDesc, setNewCharityDesc] = useState('');

  const loadAdminData = () => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(d => setStats(d))
      .catch(() => {});

    fetch('/api/winners/all')
      .then(res => res.json())
      .then(d => setClaims(d.claims || []))
      .catch(() => {});

    fetch('/api/charities')
      .then(res => res.json())
      .then(d => setCharities(d.charities || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setPublishMessage('');
    try {
      const res = await fetch('/api/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: drawMode })
      });
      const data = await res.json();
      setSimulationResult(data.evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublishDraw = async () => {
    try {
      const res = await fetch('/api/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: drawMode })
      });
      const data = await res.json();
      setPublishMessage('Official Draw successfully published! Winners tickets dispatched.');
      setSimulationResult(null);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyClaim = async (claimId, status) => {
    try {
      await fetch(`/api/winners/verify/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCharity = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCharityName,
          tagline: newCharityTagline,
          description: newCharityDesc,
          isFeatured: true
        })
      });
      setNewCharityName('');
      setNewCharityTagline('');
      setNewCharityDesc('');
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#E0B589]">Section § 11</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Full Platform Control Surface</h1>
          <p className="text-xs text-gray-400 mt-1">Manage users, configure draw engines, review proof submissions & monitor KPIs.</p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#131B2A] border border-[#1E293B] text-center flex-1 min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-gray-400">Total Prize Pool</p>
            <p className="text-lg font-extrabold text-[#E0B589]">${stats?.totalPrizePool.toLocaleString() || '0'}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#131B2A] border border-[#1E293B] text-center flex-1 min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-gray-400">Charity Raised</p>
            <p className="text-lg font-extrabold text-white">${stats?.totalCharityRaised.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      {/* Surface Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E293B] pb-4">
        {[
          { id: 'draws', label: 'Draw Mgmt', fullLabel: '02. Draw Management' },
          { id: 'winners', label: 'Winners', fullLabel: '04. Winners & Proofs' },
          { id: 'charities', label: 'Charities', fullLabel: '03. Charity Management' },
          { id: 'stats', label: 'Analytics', fullLabel: '05. Reports & Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[#E0B589] text-black shadow-lg shadow-[#E0B589]/20' 
                : 'bg-[#131B2A] text-gray-400 hover:text-white border border-[#1E293B]'
            }`}
          >
            <span className="sm:hidden">{tab.label}</span>
            <span className="hidden sm:inline">{tab.fullLabel}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DRAW MANAGEMENT */}
      {activeTab === 'draws' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B] space-y-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Monthly Draw Operations (§ 06 & § 07)</h3>
                <p className="text-xs text-gray-400 mt-1">Configure draw logic, run live simulations, and publish verified results.</p>
              </div>

              {/* Draw Logic Toggle */}
              <div className="flex items-center gap-2 bg-[#0B0F17] p-1.5 rounded-xl border border-[#1E293B] w-full sm:w-auto">
                <button
                  onClick={() => setDrawMode('algorithmic')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${drawMode === 'algorithmic' ? 'bg-[#E0B589] text-black' : 'text-gray-400'}`}
                >
                  Algorithmic
                </button>
                <button
                  onClick={() => setDrawMode('random')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${drawMode === 'random' ? 'bg-[#E0B589] text-black' : 'text-gray-400'}`}
                >
                  Random
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-[#1E293B] hover:bg-[#334155] text-white text-xs tracking-wider uppercase transition-all"
              >
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </button>
              <button
                onClick={handlePublishDraw}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-[#E0B589] hover:bg-[#C99E72] text-black text-xs tracking-wider uppercase transition-all shadow-md shadow-[#E0B589]/20"
              >
                Publish Official Draw
              </button>
            </div>

            {publishMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {publishMessage}
              </div>
            )}
          </div>

          {/* Simulation Output Area */}
          {simulationResult && (
            <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#E0B589]/30 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#E0B589]">Simulation Results</span>
                <span className="text-xs text-gray-400">Mode: {drawMode.toUpperCase()}</span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">Simulated Drawn Numbers (Stableford Range 1–45):</p>
                <div className="flex gap-3">
                  {simulationResult.winningNumbers.map((num, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl bg-[#E0B589] text-black font-extrabold text-xl flex items-center justify-center shadow-lg">
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiers Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <p className="text-xs uppercase font-bold text-gray-400">5-Match Jackpot (40%)</p>
                  <p className="text-xl font-bold text-white mt-1">${simulationResult.summary.tier5.totalAllocated.toLocaleString()}</p>
                  <p className="text-xs text-[#E0B589] mt-2">
                    Winners: {simulationResult.summary.tier5.winnerCount} • Payout: ${simulationResult.summary.tier5.payoutPerWinner.toFixed(2)}
                  </p>
                  {simulationResult.summary.tier5.winnerCount === 0 && (
                    <p className="text-[10px] text-amber-400 mt-1">Rollover to next month: ${simulationResult.summary.tier5.rolloverToNextMonth.toLocaleString()}</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <p className="text-xs uppercase font-bold text-gray-400">4-Match Tier (35%)</p>
                  <p className="text-xl font-bold text-white mt-1">${simulationResult.summary.tier4.totalAllocated.toLocaleString()}</p>
                  <p className="text-xs text-gray-300 mt-2">
                    Winners: {simulationResult.summary.tier4.winnerCount} • Payout: ${simulationResult.summary.tier4.payoutPerWinner.toFixed(2)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                  <p className="text-xs uppercase font-bold text-gray-400">3-Match Tier (25%)</p>
                  <p className="text-xl font-bold text-white mt-1">${simulationResult.summary.tier3.totalAllocated.toLocaleString()}</p>
                  <p className="text-xs text-gray-300 mt-2">
                    Winners: {simulationResult.summary.tier3.winnerCount} • Payout: ${simulationResult.summary.tier3.payoutPerWinner.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WINNERS & PROOF VERIFICATION */}
      {activeTab === 'winners' && (
        <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B] space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Winner Verification Pipeline (§ 09)</h3>
            <p className="text-xs text-gray-400 mt-1">Review uploaded golf platform scorecards and authorize prize disbursements.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1E293B] text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Winner</th>
                  <th className="py-3 px-4">Tier / Match</th>
                  <th className="py-3 px-4">Prize Amount</th>
                  <th className="py-3 px-4">Scorecard Proof</th>
                  <th className="py-3 px-4">Verification State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {claims.map(claim => (
                  <tr key={claim.id} className="hover:bg-[#0B0F17]/50">
                    <td className="py-4 px-4 font-bold text-white">{claim.userName}</td>
                    <td className="py-4 px-4 text-[#E0B589] font-semibold">{claim.matchCount}-Number Match</td>
                    <td className="py-4 px-4 font-extrabold text-white">${claim.prizeAmount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      {claim.proofImageUrl ? (
                        <a href={claim.proofImageUrl} target="_blank" rel="noreferrer" className="text-[#E0B589] hover:underline flex items-center gap-1 font-semibold">
                          View Proof ↗
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">No proof uploaded</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        claim.verificationStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        claim.verificationStatus === 'approved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        claim.verificationStatus === 'under_review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {claim.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleVerifyClaim(claim.id, 'approved')}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyClaim(claim.id, 'paid')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => handleVerifyClaim(claim.id, 'rejected')}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHARITY MANAGEMENT */}
      {activeTab === 'charities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <h3 className="text-base font-bold text-white mb-4">Add New Charity Partner</h3>
            <form onSubmit={handleAddCharity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Charity Name</label>
                <input
                  type="text"
                  required
                  value={newCharityName}
                  onChange={(e) => setNewCharityName(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E0B589]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={newCharityTagline}
                  onChange={(e) => setNewCharityTagline(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E0B589]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={newCharityDesc}
                  onChange={(e) => setNewCharityDesc(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E0B589]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-[#E0B589] hover:bg-[#C99E72] text-black text-xs uppercase"
              >
                Add to Directory
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B] space-y-4">
            <h3 className="text-base font-bold text-white mb-4">Current Directory Listings</h3>
            <div className="space-y-3">
              {charities.map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">{c.name}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">{c.tagline || c.description}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${c.isFeatured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                    {c.isFeatured ? 'Spotlight Active' : 'Standard'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS & ANALYTICS */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <p className="text-xs uppercase font-bold text-gray-400">Total Active Subscribers</p>
            <p className="text-3xl font-extrabold text-white mt-2">{stats?.activeSubscribers || 0}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <p className="text-xs uppercase font-bold text-gray-400">Cumulative Charity Fund</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">${stats?.totalCharityRaised.toLocaleString() || '0'}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <p className="text-xs uppercase font-bold text-gray-400">Current Jackpot Rollover</p>
            <p className="text-3xl font-extrabold text-[#E0B589] mt-2">${stats?.currentRollover.toLocaleString() || '0'}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <p className="text-xs uppercase font-bold text-gray-400">Completed Draws</p>
            <p className="text-3xl font-extrabold text-white mt-2">{stats?.drawStatistics?.pastDrawsCount || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
