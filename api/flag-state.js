// Real persistent storage using JSONBin.io (free service)
// This ensures state persists across ALL serverless function instances

const DEFAULT_STATE = {
  currentFlagIndex: 0,
  totalAttempts: 0,
  totalSolves: 0,
  lastUpdated: Date.now()
};

// Using JSONBin.io as external persistent storage
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/6751a2b2ad19ca34f8c39a1e';
const JSONBIN_MASTER_KEY = '$2a$10$VvS1FKjV5Z6WJzN4YP7P1OYYrE8xKzGp3M5D1Q9R6pX8VwF2L4N7C6';

// Read state from external storage
async function readStateFromStorage() {
  try {
    console.log('📡 Reading state from external storage...');
    const response = await fetch(`${JSONBIN_URL}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_MASTER_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully read state from storage:', data.record);
      return data.record;
    } else {
      console.warn('⚠️ Failed to read from storage, status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error reading from external storage:', error.message);
  }
  
  console.log('🔄 Using default state');
  return DEFAULT_STATE;
}

// Write state to external storage
async function writeStateToStorage(state) {
  try {
    console.log('💾 Writing state to external storage:', state);
    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_MASTER_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    
    if (response.ok) {
      console.log('✅ Successfully saved state to storage');
      return true;
    } else {
      console.error('❌ Failed to save state, status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error writing to external storage:', error.message);
  }
  
  return false;
}

export default async function handler(req, res) {
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
    // Always read current state from external storage
    let currentState = await readStateFromStorage();

    if (req.method === 'GET') {
      res.status(200).json({
        flagIndex: currentState.currentFlagIndex,
        attempts: currentState.totalAttempts,
        solves: currentState.totalSolves,
        lastUpdated: currentState.lastUpdated,
        serverTime: Date.now()
      });
    } else if (req.method === 'POST') {
      const { action, flagIndex } = req.body;
      const newState = { ...currentState };

      switch (action) {
        case 'increment_attempts':
          newState.totalAttempts++;
          newState.lastUpdated = Date.now();
          break;
          
        case 'correct_flag':
          newState.totalSolves++;
          const oldIndex = newState.currentFlagIndex;
          newState.currentFlagIndex = (newState.currentFlagIndex + 1) % 72;
          newState.lastUpdated = Date.now();
          console.log(`🎯 FLAG SOLVED! Rotating from ${oldIndex} to ${newState.currentFlagIndex}`);
          break;
          
        case 'set_flag_index':
          if (typeof flagIndex === 'number') {
            newState.currentFlagIndex = flagIndex % 72;
            newState.lastUpdated = Date.now();
          }
          break;
          
        case 'reset':
          Object.assign(newState, DEFAULT_STATE);
          newState.lastUpdated = Date.now();
          console.log('🔄 State reset to defaults');
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }

      // Save the updated state to external storage
      const saved = await writeStateToStorage(newState);
      
      if (!saved) {
        console.error('⚠️ Failed to save to external storage, returning old state');
        newState = currentState; // Revert if save failed
      }

      res.status(200).json({
        flagIndex: newState.currentFlagIndex,
        attempts: newState.totalAttempts,
        solves: newState.totalSolves,
        lastUpdated: newState.lastUpdated,
        serverTime: Date.now(),
        saved: saved
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