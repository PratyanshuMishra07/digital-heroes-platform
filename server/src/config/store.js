// Mock In-Memory Store preloaded with rich seed data matching PRD requirements

const store = {
  currentUser: {
    id: "usr_alex_turner",
    name: "Alex Turner",
    email: "alex.turner@example.com",
    role: "subscriber",
    subscriptionStatus: "active",
    subscriptionPlan: "monthly",
    renewalDate: "2026-04-15",
    charityId: "charity_youth_golf",
    charityPercentage: 15 // voluntarily bumped from 10%
  },

  charities: [
    {
      id: "charity_youth_golf",
      name: "Youth Fairways & Dreams",
      tagline: "Empowering next-gen youth through mentorship & community sport",
      description: "Providing golf equipment, educational coaching, and tournament access to young athletes from underserved communities.",
      imageUrl: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      upcomingEvents: [
        { title: "Junior Open Invitational", date: "2026-04-12", location: "Augusta Meadow" },
        { title: "Equipment Drive & Clinic", date: "2026-05-02", location: "Community Links" }
      ]
    },
    {
      id: "charity_wildlife",
      name: "Green Sanctuary Conservation",
      tagline: "Preserving biodiversity and native habitats on community parklands",
      description: "Dedicated to protecting wetland ecosystems, pollinator corridors, and native oak canopies located adjacent to public sports facilities.",
      imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      upcomingEvents: [
        { title: "Earth Day Scramble", date: "2026-04-22", location: "Pine Valley Links" }
      ]
    },
    {
      id: "charity_veterans",
      name: "Veterans Adaptive Golf Initiative",
      tagline: "Adaptive sport and therapeutic recovery for disabled veterans",
      description: "Using the discipline, focus, and outdoors of golf to rehabilitate wounded veterans suffering from severe physical trauma and combat PTSD.",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      upcomingEvents: [
        { title: "Honor & Drive Pro-Am", date: "2026-05-15", location: "Heritage Country Club" }
      ]
    }
  ],

  // Current user's 5 rolling scores
  scores: [
    { id: "sc_1", userId: "usr_alex_turner", score: 38, date: "2026-03-18" },
    { id: "sc_2", userId: "usr_alex_turner", score: 34, date: "2026-03-12" },
    { id: "sc_3", userId: "usr_alex_turner", score: 41, date: "2026-03-05" },
    { id: "sc_4", userId: "usr_alex_turner", score: 29, date: "2026-02-27" },
    { id: "sc_5", userId: "usr_alex_turner", score: 36, date: "2026-02-18" }
  ],

  // Other subscribers in the pool for realistic draw simulation
  subscribers: [
    {
      id: "usr_alex_turner",
      name: "Alex Turner",
      charityPercentage: 15,
      scores: [38, 34, 41, 29, 36]
    },
    {
      id: "usr_jordan_reed",
      name: "Jordan Reed",
      charityPercentage: 10,
      scores: [38, 22, 19, 36, 44]
    },
    {
      id: "usr_samantha_m",
      name: "Samantha Miller",
      charityPercentage: 20,
      scores: [41, 34, 15, 29, 42]
    },
    {
      id: "usr_david_choi",
      name: "David Choi",
      charityPercentage: 12,
      scores: [38, 34, 41, 12, 27]
    },
    {
      id: "usr_elena_rostova",
      name: "Elena Rostova",
      charityPercentage: 10,
      scores: [31, 28, 33, 37, 45]
    },
    {
      id: "usr_marcus_vance",
      name: "Marcus Vance",
      charityPercentage: 10,
      scores: [38, 34, 41, 29, 10]
    }
  ],

  currentJackpotRollover: 1250.00, // Carry-over from previous month

  pastDraws: [
    {
      id: "draw_feb_2026",
      drawDate: "2026-02-28",
      drawMode: "algorithmic",
      winningNumbers: [14, 22, 29, 36, 41],
      totalPool: 4850.00,
      tier5Jackpot: 3190.00,
      tier4Pool: 962.50,
      tier3Pool: 697.50,
      status: "published",
      winnersCount: 7,
      rolloverCarried: 1250.00
    }
  ],

  winnerClaims: [
    {
      id: "claim_001",
      drawId: "draw_feb_2026",
      userId: "usr_alex_turner",
      userName: "Alex Turner",
      tier: "tier4",
      matchCount: 4,
      matchedScores: [22, 29, 36, 41],
      prizeAmount: 481.25,
      proofImageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
      verificationStatus: "under_review",
      createdAt: "2026-03-01T10:00:00Z"
    }
  ]
};

module.exports = store;
