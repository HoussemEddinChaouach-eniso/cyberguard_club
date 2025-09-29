// Persistent state using global variable with better initialization
global.flagState = global.flagState || {
  currentFlagIndex: 0,
  totalAttempts: 0,
  totalSolves: 0,
  lastUpdated: Date.now(),
  initialized: true // Always consider server initialized
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Use global state - server is always authoritative
  let currentState = global.flagState;

  if (req.method === 'GET') {
    // Return current flag state (server is authoritative)
    res.status(200).json({
      flagIndex: currentState.currentFlagIndex,
      attempts: currentState.totalAttempts,
      solves: currentState.totalSolves,
      lastUpdated: currentState.lastUpdated,
      serverTime: Date.now()
    });
  } else if (req.method === 'POST') {
    const { action, flagIndex } = req.body;

    // Server state is always authoritative - don't sync from client
    if (action === 'increment_attempts') {
      currentState.totalAttempts++;
      currentState.lastUpdated = Date.now();
    } else if (action === 'correct_flag') {
      currentState.totalSolves++;
      currentState.currentFlagIndex = (currentState.currentFlagIndex + 1) % 72;
      currentState.lastUpdated = Date.now();
      console.log(`Flag rotated to index: ${currentState.currentFlagIndex}`);
    } else if (action === 'set_flag_index' && typeof flagIndex === 'number') {
      currentState.currentFlagIndex = flagIndex % 72;
      currentState.lastUpdated = Date.now();
    } else if (action === 'reset') {
      currentState = {
        currentFlagIndex: 0,
        totalAttempts: 0,
        totalSolves: 0,
        lastUpdated: Date.now(),
        initialized: true
      };
      global.flagState = currentState;
    }

    res.status(200).json({
      flagIndex: currentState.currentFlagIndex,
      attempts: currentState.totalAttempts,
      solves: currentState.totalSolves,
      lastUpdated: currentState.lastUpdated,
      serverTime: Date.now()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}