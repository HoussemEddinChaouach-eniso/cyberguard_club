// Test script for 10-minute time-based flag rotation
console.log('⏰ Testing 10-Minute Time-Based Flag Rotation...\n');

// Test flags from the flag list
const testFlags = [
    'QzdCM1JfR1U0UkRfRW4xNTA=', // C7B3R_GU4RD_En150
    'Q3liM3JHdTRyZEVuMTVv',     // Cyb3rGu4rdEn15o
    'Y3liM3JfZ3U0cmRfZW4xNW8=', // cyb3r_gu4rd_en15o
    'Y3liZXJfZ3U0cmRfZW5pNW8=', // cyber_gu4rd_eni5o
    'Y3liM3JfZ3U0cmRfM24xc28='  // cyb3r_gu4rd_3n1so
];

console.log('🎯 Time-Based Rotation Schedule:');
console.log('Flag rotates every 10 minutes automatically');
testFlags.forEach((flag, index) => {
    const decoded = Buffer.from(flag, 'base64').toString();
    const timeSlot = `${index * 10}-${(index + 1) * 10} min`;
    console.log(`  Minutes ${timeSlot}: ${decoded}`);
});

console.log('\n✅ New Mechanism Features:');
console.log('1. 🕒 Automatic rotation every 10 minutes (not submission-based)');
console.log('2. 🔄 Multiple people can submit the same flag');
console.log('3. 📊 Tracks submission count per flag for statistics');
console.log('4. ⏰ Real-time countdown timer shows next rotation');
console.log('5. 🌐 Perfect synchronization across all computers');

console.log('\n🔄 Expected Behavior:');
console.log('Time 0-10 min: C7B3R_GU4RD_En150 active');
console.log('  → User A submits: ✅ Success (submission #1)');
console.log('  → User B submits: ✅ Success (submission #2)');
console.log('  → User C submits: ✅ Success (submission #3)');

console.log('\nTime 10-20 min: Cyb3rGu4rdEn15o active');
console.log('  → Auto-rotation occurs, Q = 0 → 1');
console.log('  → All users see new flag and timer reset');
console.log('  → Multiple submissions allowed again');

console.log('\n🌐 Public Deployment:');
console.log('✅ No Vercel account sharing needed');
console.log('✅ Deploy to your own Vercel account');
console.log('✅ Share public URL with all participants');
console.log('✅ External state storage ensures consistency');

console.log('\n🧪 Testing Checklist:');
console.log('□ Deploy to Vercel from your GitHub');
console.log('□ Verify timer shows correct countdown');
console.log('□ Test multiple submissions of same flag');
console.log('□ Wait for 10-minute rotation and verify auto-change');
console.log('□ Test with multiple browser tabs/devices');
console.log('□ Verify successful submissions redirect properly');

console.log('\n⏰ System ready for 10-minute rotation deployment!');