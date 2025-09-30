// Real persistent storage using JSONBin.io (free service)
// This ensures state persists across ALL serverless function instances

const DEFAULT_STATE = {
  Q: Math.floor(Math.random() * 72), // Start with random flag index
  totalAttempts: 0,
  lastUpdated: Date.now(),
  lastRotation: Date.now(), // Track when flag was last rotated
  usedFlags: {}, // Track which flags have been used: { "flagContent": true }
  rotationInterval: 15 * 60 * 1000, // 15 minutes in milliseconds
  flagList: [
    'QzdCM1JfR1U0UkRfRW4xNTA=',
    'Q3liM3JHdTRyZEVuMTVv',
    'Y3liM3JfZ3U0cmRfZW4xNW8=',
    'Y3liZXJfZ3U0cmRfZW5pNW8=',
    'Y3liM3JfZ3U0cmRfM24xc28=',
    'Q3liM3JHdWFyZEVuMTVv',
    'Y3liZXJfZ3U0cmRfM24xc28=',
    'Q3liM3JfZ3VhcmRfZW5pNW8=',
    'VV9EMWRFMVQ=',
    'QzBuZ3I0dDVfdV9kMWRfMXQ=',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q1lCM1ItZ3U0cmQuRU5JU08=',
    'Q3liZXItR1U0UkRfRU4xU08=',
    'Q3liZXIuR1U0UkQuRW4xNTA=',
    'Y3liM3JfR1VBUkQtRU4xNU8=',
    'Q1lCM1JfR1VBUkQuRW5pc28=',
    'Q1lCM1IuR3U0cmRlbmk1bw==',
    'Q3liZXJHdTRyZC1FTjFTTw==',
    'Q1lCM1JHdTRyZF9lbmk1bw==',
    'Y1liM3IuZ3U0cmRfRW4xc28=',
    'Q1lCM1ItR1VBUkQuRW4xc28=',
    'Q3liZXJfR3U0cmRFTklTTw==',
    'Y3liM3ItR3U0cmQuZW4xNTA=',
    'Q3liM3IuR3U0cmRfM24xc28=',
    'Q1lCRVJHdTRyZC1Fbmlzbw==',
    'Y3liM3JfR3U0cmQuZW4xc28=',
    'Y3liZXItR1VBUkQuRW4xNTA=',
    'Q3liM3IuR3U0cmQuZW4xNTA=',
    'Q1lCM1JfR1VBUkQuRW5pc28=',
    'Q1lCM1IuR3U0cmRlbmk1bw==',
    'Q3liZXJHdTRyZC1FTjFTTw==',
    'Y3liM3JfR3U0cmQuZW4xc28=',
    'Y3liM3JfR3U0cmQuZW4xc28=',
    'Q3liM3JfZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28=',
    'Y3liZXJHdTRyZEVOMVNP',
    'Q3liM3ItZ3VhcmRfRW5pc28=',
    'Q3liM3IuR1VBUkRFbjE1MA==',
    'Y3liM3JfR1VBUkQtM24xc28=',
    'Q3liM3JfR3U0cmQuRW5pc28='
  ]
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

// Check if flag needs automatic rotation based on time
function checkTimeBasedRotation(currentState) {
  const now = Date.now();
  const timeSinceLastRotation = now - (currentState.lastRotation || now);
  const rotationInterval = currentState.rotationInterval || (15 * 60 * 1000); // 15 minutes default
  
  if (timeSinceLastRotation >= rotationInterval) {
    console.log(`⏰ AUTO-ROTATION: ${Math.floor(timeSinceLastRotation / 60000)} minutes elapsed, rotating flag`);
    
    // Calculate how many rotations we've missed
    const missedRotations = Math.floor(timeSinceLastRotation / rotationInterval);
    const newQ = (currentState.Q + missedRotations) % 72;
    
    return {
      ...currentState,
      Q: newQ,
      lastRotation: now - (timeSinceLastRotation % rotationInterval), // Align to rotation schedule
      lastUpdated: now,
      autoRotated: true,
      missedRotations: missedRotations
    };
  }
  
  return currentState;
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
    
    // Check if flag needs automatic time-based rotation
    const rotatedState = checkTimeBasedRotation(currentState);
    if (rotatedState.autoRotated) {
      console.log(`🔄 AUTO-ROTATION: Flag rotated from ${currentState.Q} to ${rotatedState.Q} due to time (${rotatedState.missedRotations} rotations)`);
      currentState = rotatedState;
      // Save the auto-rotated state
      await writeStateToStorage(currentState);
    }

    if (req.method === 'GET') {
      // Get current flag content for verification
      const flagList = currentState.flagList || DEFAULT_STATE.flagList;
      const currentFlagContent = Buffer.from(flagList[currentState.Q] || '', 'base64').toString();
      
      // Calculate time until next rotation
      const now = Date.now();
      const timeSinceLastRotation = now - (currentState.lastRotation || now);
      const rotationInterval = currentState.rotationInterval || (15 * 60 * 1000);
      const timeUntilNextRotation = rotationInterval - (timeSinceLastRotation % rotationInterval);
      
      res.status(200).json({
        Q: currentState.Q,
        currentFlag: currentState.Q, // Current flag index is Q
        attempts: currentState.totalAttempts,
        lastUpdated: currentState.lastUpdated,
        lastRotation: currentState.lastRotation,
        timeUntilNextRotation: Math.max(0, timeUntilNextRotation),
        nextRotationAt: now + timeUntilNextRotation,
        rotationIntervalMinutes: rotationInterval / 60000,
        serverTime: Date.now(),
        usedFlagsCount: Object.keys(currentState.usedFlags || {}).length,
        currentFlagContent: currentFlagContent // For debugging only
      });
    } else if (req.method === 'POST') {
      const { action, flagIndex, submittedFlag } = req.body;
      const newState = { ...currentState };

      switch (action) {
        case 'increment_attempts':
          newState.totalAttempts++;
          newState.lastUpdated = Date.now();
          break;

        case 'validate_and_submit_flag':
          // Check if the submitted flag matches the current active flag
          if (typeof submittedFlag === 'string') {
            // Get current flag (decode from base64) - current flag is at index Q
            const flagList = currentState.flagList || DEFAULT_STATE.flagList;
            const currentActiveFlag = Buffer.from(flagList[currentState.Q] || '', 'base64').toString();
            const normalizedSubmitted = submittedFlag.replace(/^flag\{|\}$/g, '');
            const normalizedCurrent = currentActiveFlag;

            console.log(`🔍 Validating flag: "${normalizedSubmitted}" against current: "${normalizedCurrent}" (Q=${currentState.Q})`);

            // Initialize usedFlags if it doesn't exist
            if (!newState.usedFlags) {
              newState.usedFlags = {};
            }

            // Check if this specific flag has already been used
            const flagKey = normalizedCurrent; // Use the actual flag content as key
            if (newState.usedFlags[flagKey]) {
              // This flag has already been submitted by someone else
              newState.totalAttempts++;
              newState.lastUpdated = Date.now();
              console.log(`❌ FLAG ALREADY USED: "${normalizedSubmitted}" was already submitted by someone else`);
              
              const saved = await writeStateToStorage(newState);
              return res.status(200).json({
                success: false,
                Q: newState.Q,
                currentFlag: newState.Q,
                attempts: newState.totalAttempts,
                lastUpdated: newState.lastUpdated,
                serverTime: Date.now(),
                message: 'This flag has already been submitted by someone else. Try the current active flag.',
                flagExpired: true,
                saved: saved
              });
            }

            if (normalizedSubmitted === normalizedCurrent || submittedFlag === `flag{${normalizedCurrent}}`) {
              // Flag is correct and hasn't been used yet - mark it as used and increment Q
              newState.usedFlags[flagKey] = true; // Mark this flag as used
              newState.Q = (currentState.Q + 1) % 72; // Manual rotation on correct submission
              newState.lastRotation = Date.now(); // Reset rotation timer on manual rotation
              newState.lastUpdated = Date.now();
              
              console.log(`🎯 FLAG ACCEPTED! "${normalizedCurrent}" marked as used. Q incremented from ${currentState.Q} to ${newState.Q}. Rotation timer reset.`);
              
              // Return success with new flag info
              const saved = await writeStateToStorage(newState);
              return res.status(200).json({
                success: true,
                Q: newState.Q,
                currentFlag: newState.Q,
                attempts: newState.totalAttempts,
                lastUpdated: newState.lastUpdated,
                timeUntilNextRotation: newState.rotationInterval || (15 * 60 * 1000),
                serverTime: Date.now(),
                message: `Flag accepted! You are person #${currentState.Q + 1} to solve this. This flag is now permanently invalid. Timer reset!`,
                solverNumber: currentState.Q + 1,
                timerReset: true,
                saved: saved
              });
            } else {
              // Flag is incorrect
              newState.totalAttempts++;
              newState.lastUpdated = Date.now();
              console.log(`❌ FLAG REJECTED: "${normalizedSubmitted}" is not the current flag (Q=${currentState.Q})`);
              
              const saved = await writeStateToStorage(newState);
              return res.status(200).json({
                success: false,
                Q: newState.Q,
                currentFlag: newState.Q,
                attempts: newState.totalAttempts,
                lastUpdated: newState.lastUpdated,
                serverTime: Date.now(),
                message: 'Invalid flag.',
                saved: saved
              });
            }
          }
          break;
          
        case 'reset':
          Object.assign(newState, DEFAULT_STATE);
          newState.lastUpdated = Date.now();
          console.log('🔄 State reset to defaults - Q=0');
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
        Q: newState.Q,
        currentFlag: newState.Q,
        attempts: newState.totalAttempts,
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