import React, { useState, useEffect } from 'react';

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`/api/charities?search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(d => setCharities(d.charities || []))
      .catch(() => {});
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E0B589]">Section § 08</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Charity Directory & Causes</h1>
        <p className="text-sm text-gray-300">
          Discover certified grassroots initiatives supported by golfers worldwide. Direct a portion of your subscription or give independently.
        </p>

        <div className="pt-4">
          <input
            type="text"
            placeholder="Search by cause, keyword, or community initiative..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-[#131B2A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E0B589]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map(c => (
          <div key={c.id} className="rounded-2xl overflow-hidden bg-[#131B2A] border border-[#1E293B] flex flex-col justify-between hover:border-[#E0B589]/40 transition-all">
            <div>
              <img src={c.imageUrl} alt={c.name} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#E0B589]/10 text-[#E0B589]">
                  Verified Cause
                </span>
                <h3 className="text-xl font-bold text-white">{c.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-3">{c.description}</p>

                {c.upcomingEvents && c.upcomingEvents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#1E293B]">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Upcoming Charity Event:</p>
                    <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-[#1E293B] text-xs">
                      <p className="font-bold text-white">{c.upcomingEvents[0].title}</p>
                      <p className="text-[11px] text-[#E0B589]">{c.upcomingEvents[0].date} • {c.upcomingEvents[0].location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0">
              <button className="w-full py-2.5 rounded-xl font-bold bg-[#1E293B] hover:bg-[#E0B589] hover:text-black text-white text-xs uppercase tracking-wider transition-all">
                Select as Recipient
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
