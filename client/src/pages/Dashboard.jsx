import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [scores, setScores] = useState([]);
  const [charities, setCharities] = useState([]);
  const [claims, setClaims] = useState([]);
  
  // Score Input State
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Proof Upload Modal State
  const [activeClaimId, setActiveClaimId] = useState(null);
  const [proofUrl, setProofUrl] = useState('');

  const loadData = () => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(d => setProfile(d.user))
      .catch(() => {});

    fetch('/api/scores')
      .then(res => res.json())
      .then(d => setScores(d.scores || []))
      .catch(() => {});

    fetch('/api/charities')
      .then(res => res.json())
      .then(d => setCharities(d.charities || []))
      .catch(() => {});

    fetch('/api/winners/my-claims')
      .then(res => res.json())
      .then(d => setClaims(d.claims || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddScore = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: parseInt(newScore, 10), date: newDate })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg('Score added! Latest 5 scores updated.');
      setNewScore('');
      loadData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteScore = async (id) => {
    try {
      await fetch(`/api/scores/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCharity = async (charityId, charityPercentage) => {
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId, charityPercentage })
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadProof = async (claimId) => {
    if (!proofUrl) return;
    try {
      const res = await fetch(`/api/winners/upload-proof/${claimId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofImageUrl: proofUrl })
      });
      if (res.ok) {
        setActiveClaimId(null);
        setProofUrl('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner: Subscriber Info */}
      <div className="p-8 rounded-2xl bg-[#131B2A] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{profile ? profile.name : 'Golfer'}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {profile ? profile.subscriptionStatus.toUpperCase() : 'ACTIVE'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Plan: <span className="text-white capitalize">{profile?.subscriptionPlan || 'Monthly'}</span> • 
            Renews on: <span className="text-white">{profile?.renewalDate || '2026-04-15'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0B0F17] p-4 rounded-xl border border-[#1E293B]">
          <div className="text-right">
            <p className="text-xs uppercase text-gray-400 font-semibold">Supporting</p>
            <p className="text-sm font-bold text-[#E0B589] max-w-[200px] truncate">
              {profile?.selectedCharity?.name || 'Youth Fairways & Dreams'}
            </p>
          </div>
          <span className="text-xl font-extrabold text-white px-3 py-1 rounded-lg bg-[#1E293B]">
            {profile?.charityPercentage || 10}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Score Entry & Rolling 5 Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <h2 className="text-lg font-bold text-white mb-2">Stableford Score Entry (§ 05)</h2>
            <p className="text-xs text-gray-400 mb-6">
              Enter your latest score (1–45 points). Only the latest 5 scores are kept and used in the monthly draw. One entry per calendar date.
            </p>

            <form onSubmit={handleAddScore} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Score (1–45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  placeholder="e.g. 36"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#E0B589]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#E0B589]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold bg-[#E0B589] hover:bg-[#C99E72] text-black transition-all"
                >
                  Record Score
                </button>
              </div>
            </form>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                {successMsg}
              </div>
            )}
          </div>

          {/* Rolling 5 Display */}
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Your Active Rolling Scores</h3>
              <span className="text-xs font-semibold text-[#E0B589] bg-[#E0B589]/10 px-2.5 py-1 rounded-full">
                {scores.length} / 5 Logged
              </span>
            </div>

            {scores.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No scores logged yet. Add your first score above.</p>
            ) : (
              <div className="space-y-3">
                {scores.map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-mono text-gray-500 w-6">#{idx + 1}</span>
                      <div className="w-10 h-10 rounded-lg bg-[#E0B589]/10 border border-[#E0B589]/20 flex items-center justify-center font-extrabold text-[#E0B589] text-lg">
                        {s.score}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Stableford Points</p>
                        <p className="text-xs text-gray-400">{s.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteScore(s.id)}
                      className="text-xs text-gray-400 hover:text-rose-400 transition-colors p-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Charity Settings & Winnings */}
        <div className="space-y-6">
          {/* Charity Contribution Slider */}
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <h3 className="text-base font-bold text-white mb-2">Charity Impact Allocation</h3>
            <p className="text-xs text-gray-400 mb-4">
              Direct a percentage of your subscription fee to a cause. Minimum is 10%.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Chosen Cause</label>
                <select
                  value={profile?.charityId || ''}
                  onChange={(e) => handleUpdateCharity(e.target.value, profile?.charityPercentage || 10)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E0B589]"
                >
                  {charities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-400">Contribution Rate:</span>
                  <span className="text-[#E0B589] font-bold">{profile?.charityPercentage || 10}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={profile?.charityPercentage || 10}
                  onChange={(e) => handleUpdateCharity(profile?.charityId, parseInt(e.target.value, 10))}
                  className="w-full accent-[#E0B589] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>10% (Min)</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>

          {/* My Winnings & Proof Verification */}
          <div className="p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B]">
            <h3 className="text-base font-bold text-white mb-2">My Winnings & Proofs</h3>
            <p className="text-xs text-gray-400 mb-4">
              If your scores match the draw, upload your golf scorecard screenshot to verify and claim payouts.
            </p>

            {claims.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No active claims yet. Keep playing!</p>
            ) : (
              <div className="space-y-3">
                {claims.map(claim => (
                  <div key={claim.id} className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E0B589]">
                        {claim.matchCount}-Number Match
                      </span>
                      <span className="text-sm font-extrabold text-white">${claim.prizeAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-semibold uppercase ${
                        claim.verificationStatus === 'paid' ? 'text-emerald-400' :
                        claim.verificationStatus === 'approved' ? 'text-blue-400' :
                        claim.verificationStatus === 'under_review' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {claim.verificationStatus.replace('_', ' ')}
                      </span>
                    </div>

                    {claim.verificationStatus === 'pending_proof' && (
                      <button
                        onClick={() => setActiveClaimId(claim.id)}
                        className="w-full mt-2 py-1.5 rounded-lg text-xs font-bold bg-[#E0B589] text-black"
                      >
                        Upload Scorecard Proof
                      </button>
                    )}

                    {claim.proofImageUrl && (
                      <a 
                        href={claim.proofImageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="block text-[11px] text-[#E0B589] hover:underline truncate"
                      >
                        View Submitted Proof ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof Upload Modal */}
      {activeClaimId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#131B2A] border border-[#1E293B] space-y-4">
            <h3 className="text-lg font-bold text-white">Upload Score Verification (§ 09)</h3>
            <p className="text-xs text-gray-400">
              Provide an image URL or screenshot of your verified score from your golf app or club platform.
            </p>
            <input
              type="url"
              placeholder="https://example.com/scorecard.jpg"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E0B589]"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActiveClaimId(null)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUploadProof(activeClaimId)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#E0B589] text-black"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
