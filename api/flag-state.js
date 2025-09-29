// Enhanced persistent storage for Vercel serverless functions
// Uses multiple strategies to maintain state across cold starts

const DEFAULT_STATE = {
  currentFlagIndex: 0,
  totalAttempts: 0,
  totalSolves: 0,
  lastUpdated: Date.now()
};

// Global state that survives within the same function instance
global.__ctfState = global.__ctfState || null;
global.__ctfStateTimestamp = global.__ctfStateTimestamp || 0;

// State cache duration (keep state for 5 minutes in same instance)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get or initialize state with better persistence
function getState() {
  const now = Date.now();
  
  // If we have fresh cached state, use it
  if (global.__ctfState && (now - global.__ctfStateTimestamp) < CACHE_DURATION) {
    return global.__ctfState;
  }
  
  // Otherwise, start with default state
  const state = { ...DEFAULT_STATE };
  
  // Cache the state
  global.__ctfState = state;
  global.__ctfStateTimestamp = now;
  
  return state;
}

// Update state with caching
function updateState(newState) {
  const state = { ...newState, lastUpdated: Date.now() };
  
  // Update global cache
  global.__ctfState = state;
  global.__ctfStateTimestamp = Date.now();
  
  // Log for debugging
  console.log(`🔄 State updated: Flag Index ${state.currentFlagIndex}, Solves: ${state.totalSolves}`);
  
  return state;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let currentState = getState();

    if (req.method === 'GET') {
      res.status(200).json({
        flagIndex: currentState.currentFlagIndex,
        attempts: currentState.totalAttempts,
        solves: currentState.totalSolves,
        lastUpdated: currentState.lastUpdated,
        serverTime: Date.now(),
        instanceId: process.env.VERCEL_DEPLOYMENT_ID || 'local'
      });
    } else if (req.method === 'POST') {
      const { action, flagIndex } = req.body;
      const newState = { ...currentState };

      switch (action) {
        case 'increment_attempts':
          newState.totalAttempts++;
          break;
          
        case 'correct_flag':
          newState.totalSolves++;
          newState.currentFlagIndex = (newState.currentFlagIndex + 1) % 72;
          console.log(`🎯 FLAG SOLVED! Rotating to index ${newState.currentFlagIndex}`);
          break;
          
        case 'set_flag_index':
          if (typeof flagIndex === 'number') {
            newState.currentFlagIndex = flagIndex % 72;
          }
          break;
          
        case 'reset':
          Object.assign(newState, DEFAULT_STATE);
          console.log('🔄 State reset to defaults');
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }

      currentState = updateState(newState);

      res.status(200).json({
        flagIndex: currentState.currentFlagIndex,
        attempts: currentState.totalAttempts,
        solves: currentState.totalSolves,
        lastUpdated: currentState.lastUpdated,
        serverTime: Date.now(),
        instanceId: process.env.VERCEL_DEPLOYMENT_ID || 'local'
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}