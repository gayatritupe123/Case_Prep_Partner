// Run this ONCE to add sample cases to your database.
// Usage: node seedCases.js

require("dotenv").config();
const mongoose = require("mongoose");
const Case = require("./models/Case");

const sampleCases = [
  {
    title: "Coffee Shop Profitability Decline",
    difficulty: "easy",
    topic: "profitability",
    statement: "Our client owns a chain of coffee shops. Profits have declined 20% over the last year despite stable revenue. They want to know why and what to do about it.",
    relevantData: "Revenue: $5M/year (flat). Costs: rent +15%, labor +10%, raw materials +5%. 10 stores, all urban locations.",
    hints: [
      "Start by breaking down Profit = Revenue - Costs, then dig into cost buckets.",
      "Rent increased the most - check if this is company-wide or a few specific stores.",
      "Consider if any stores are consistently underperforming and dragging down the average.",
    ],
    solution: "The decline is driven primarily by 3 stores where rent renegotiations increased costs by 40%, disproportionate to the other 7 stores. Recommendation: renegotiate leases, consider relocating or closing the 2 least profitable stores, and evaluate a price increase of 3-5% given low price elasticity in this category.",
  },
  {
    title: "EV Company Market Entry - India",
    difficulty: "medium",
    topic: "market-entry",
    statement: "A European EV manufacturer wants to enter the Indian market. Should they enter, and if so, how?",
    relevantData: "India EV market growing 25% YoY. Government subsidies for local manufacturing. Strong local competitors (Tata, Mahindra) with price advantage. Charging infrastructure still developing in tier-2/3 cities.",
    hints: [
      "Structure this as: Market attractiveness, Competitive landscape, Entry mode, Risks.",
      "Think about whether to enter via JV, local manufacturing, or import/export.",
      "Consider government policy - PLI (production linked incentive) scheme matters here.",
    ],
    solution: "Recommend entry via joint venture with a local manufacturer to access PLI subsidies and reduce import duties, initially targeting premium urban segment where charging infra exists and brand differentiation matters more than price. Phase 2: expand to tier-2 cities as infrastructure matures.",
  },
  {
    title: "Airline Losing Market Share",
    difficulty: "hard",
    topic: "profitability",
    statement: "A regional airline has lost 15% market share to a low-cost carrier over 2 years. CEO wants a turnaround plan.",
    relevantData: "Average fare: $180 vs competitor's $120. On-time performance similar. Customer satisfaction scores declining. Fleet is older (avg 12 years vs competitor's 5 years).",
    hints: [
      "Separate this into price competitiveness, cost structure, and customer experience.",
      "Older fleet likely means higher maintenance and fuel costs - quantify this if possible.",
      "Think about segmentation - are all customer segments equally price-sensitive?",
    ],
    solution: "Root cause is a cost structure problem (older, less fuel-efficient fleet) forcing higher fares to maintain margins, while the low-cost carrier operates leaner. Recommend phased fleet renewal funded by leaseback arrangements, introduction of a basic 'no-frills' fare tier to compete directly on price-sensitive routes, while preserving premium service on business routes.",
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB, seeding cases...");
    await Case.deleteMany({}); // clears existing cases before reseeding
    await Case.insertMany(sampleCases);
    console.log("Cases seeded successfully!");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));