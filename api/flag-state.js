// Simple persistent state using a global variable that persists during function lifetime
// For true persistence across cold starts, you'd need a database like Vercel KV

// Global state that persists during the function's lifetime
global.flagState = global.flagState || {
  currentFlagIndex: 0,
  totalAttempts: 0,
  totalSolves: 0,
  lastUpdated: Date.now(),
  initialized: false
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

  // Use global state
  let currentState = global.flagState;

  if (req.method === 'GET') {
    // Return current flag state
    res.status(200).json({
      flagIndex: currentState.currentFlagIndex,
      attempts: currentState.totalAttempts,
      solves: currentState.totalSolves,
      lastUpdated: currentState.lastUpdated,
      serverTime: Date.now()
    });
  } else if (req.method === 'POST') {
    const { action, flagIndex, clientState } = req.body;

    // If client sends their state and server state seems behind, use client state
    if (clientState && !currentState.initialized && clientState.lastUpdated) {
      currentState = {
        currentFlagIndex: clientState.flagIndex || 0,
        totalAttempts: clientState.attempts || 0,
        totalSolves: clientState.solves || 0,
        lastUpdated: clientState.lastUpdated,
        initialized: true
      };
      global.flagState = currentState;
    }

    if (action === 'sync_client_state' && clientState) {
      // Sync client state to server if server is behind
      if (clientState.lastUpdated > currentState.lastUpdated) {
        currentState = {
          currentFlagIndex: clientState.flagIndex || 0,
          totalAttempts: clientState.attempts || 0,
          totalSolves: clientState.solves || 0,
          lastUpdated: clientState.lastUpdated,
          initialized: true
        };
        global.flagState = currentState;
      }
    } else if (action === 'increment_attempts') {
      currentState.totalAttempts++;
      currentState.lastUpdated = Date.now();
      currentState.initialized = true;
    } else if (action === 'correct_flag') {
      currentState.totalSolves++;
      currentState.currentFlagIndex = (currentState.currentFlagIndex + 1) % 72;
      currentState.lastUpdated = Date.now();
      currentState.initialized = true;
    } else if (action === 'set_flag_index' && typeof flagIndex === 'number') {
      currentState.currentFlagIndex = flagIndex % 72;
      currentState.lastUpdated = Date.now();
      currentState.initialized = true;
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