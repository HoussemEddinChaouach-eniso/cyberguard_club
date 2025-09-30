// Real persistent storage using in-memory state (for demo purposes)
// In production, you might want to use a database or file system

const DEFAULT_STATE = {
  Q: 0, // Start with flag index 0, increments only when someone submits correct flag
  totalAttempts: 0,
  lastUpdated: Date.now(),
  lastRotation: Date.now(), // Track when flag was last rotated
  usedFlags: {}, // Track which flags have been used and blocked
  rotationTrigger: 'submission-based', // Rotation happens on correct submissions only
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

// In-memory state storage
let currentState = { ...DEFAULT_STATE };

// Read state from memory
async function readStateFromStorage() {
  console.log('📡 Reading state from memory...');
  console.log('✅ Successfully read state from memory:', currentState);
  return currentState;
}

// Write state to memory
async function writeStateToStorage(state) {
  console.log('💾 Writing state to memory:', state);
  currentState = { ...state };
  console.log('✅ Successfully saved state to memory');
  return true;
}

async function handler(req, res) {
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
    
    // No automatic time-based rotation - only submission-based rotation
    console.log(`� Current state: Q=${currentState.Q}, usedFlags=${Object.keys(currentState.usedFlags || {}).length}`);

    if (req.method === 'GET') {
      // Get current flag content for verification
      const flagList = currentState.flagList || DEFAULT_STATE.flagList;
      const currentFlagContent = Buffer.from(flagList[currentState.Q] || '', 'base64').toString();
      
      console.log(`📊 GET Request - Q=${currentState.Q}, Flag="${currentFlagContent}", Mode=submission-based`);
      
      res.status(200).json({
        Q: currentState.Q,
        currentFlag: currentState.Q, // Current flag index is Q
        attempts: currentState.totalAttempts,
        lastUpdated: currentState.lastUpdated,
        lastRotation: currentState.lastRotation,
        rotationMode: 'submission-based',
        serverTime: Date.now(),
        usedFlagsCount: Object.keys(currentState.usedFlags || {}).length,
        currentFlagContent: currentFlagContent, // For debugging
        currentFlagEncrypted: flagList[currentState.Q] || '' // Provide current encrypted flag for dataencrypted
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

            // Check if this specific flag has already been used and blocked
            const flagKey = normalizedCurrent;
            if (newState.usedFlags[flagKey]) {
              // This flag has already been submitted and is blocked
              newState.totalAttempts++;
              newState.lastUpdated = Date.now();
              console.log(`❌ FLAG BLOCKED: "${normalizedSubmitted}" was already submitted and is now invalid`);
              
              const saved = await writeStateToStorage(newState);
              return res.status(200).json({
                success: false,
                Q: newState.Q,
                currentFlag: newState.Q,
                attempts: newState.totalAttempts,
                lastUpdated: newState.lastUpdated,
                serverTime: Date.now(),
                message: 'This flag has already been submitted and is now blocked. Try the current active flag.',
                flagBlocked: true,
                rotationTriggered: false,
                saved: saved
              });
            }

            if (normalizedSubmitted === normalizedCurrent || submittedFlag === `flag{${normalizedCurrent}}`) {
              // Flag is correct and hasn't been used yet - ROTATE TO NEXT FLAG
              newState.usedFlags[flagKey] = true; // Block this flag permanently
              newState.Q = (currentState.Q + 1) % 72; // Rotate to next flag
              newState.lastRotation = Date.now(); // Update rotation timestamp
              newState.totalAttempts++;
              newState.lastUpdated = Date.now();
              
              console.log(`🎯 FLAG ACCEPTED & ROTATED! "${normalizedCurrent}" blocked. Q incremented from ${currentState.Q} to ${newState.Q}.`);
              
              // Return success with rotation info
              const saved = await writeStateToStorage(newState);
              return res.status(200).json({
                success: true,
                Q: newState.Q,
                currentFlag: newState.Q,
                attempts: newState.totalAttempts,
                lastUpdated: newState.lastUpdated,
                serverTime: Date.now(),
                message: `Flag accepted! Rotating to next flag. This flag is now permanently blocked.`,
                rotationTriggered: true,
                previousQ: currentState.Q,
                newQ: newState.Q,
                globalRefresh: true, // Signal to refresh all clients
                currentFlagEncrypted: flagList[newState.Q] || '', // Provide new encrypted flag for dataencrypted
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

      // Save the updated state to memory
      const saved = await writeStateToStorage(newState);
      
      if (!saved) {
        console.error('⚠️ Failed to save to memory, this should not happen');
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

module.exports = handler;