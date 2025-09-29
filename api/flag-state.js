// Simple in-memory storage for the current flag index
// In production, you'd want to use a database like Vercel KV or Redis
let currentFlagIndex = 0;
let totalAttempts = 0;
let totalSolves = 0;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return current flag state
    res.status(200).json({
      flagIndex: currentFlagIndex,
      attempts: totalAttempts,
      solves: totalSolves
    });
  } else if (req.method === 'POST') {
    const { action, flagIndex } = req.body;

    if (action === 'increment_attempts') {
      totalAttempts++;
    } else if (action === 'correct_flag') {
      totalSolves++;
      currentFlagIndex = (currentFlagIndex + 1) % 72; // 72 is the total number of flags
    } else if (action === 'set_flag_index' && typeof flagIndex === 'number') {
      currentFlagIndex = flagIndex % 72;
    }

    res.status(200).json({
      flagIndex: currentFlagIndex,
      attempts: totalAttempts,
      solves: totalSolves
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}