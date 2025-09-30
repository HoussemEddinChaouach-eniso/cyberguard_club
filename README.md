# ENISO CyberGuards CTF Challenge

## 🎯 Challenge Description

This is a time-based CTF challenge where flags rotate automatically every 10 minutes. Multiple participants can submit the same flag during its active period.

## ⏰ How It Works

- **Automatic Rotation**: Flags change every 10 minutes automatically
- **Multiple Submissions**: Multiple people can submit the same flag
- **Real-time Sync**: All participants see the same flag and timer
- **Persistent State**: Flag state is maintained across all deployments

## 🚀 Public Deployment Instructions

### For Public Access (Recommended)

1. **Fork this repository** to your own GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your forked repository
   - Deploy automatically

3. **Share the public URL** with participants (no account access needed)

### Environment Setup

The challenge uses external storage (JSONBin.io) for state persistence, so no additional environment variables are needed for basic functionality.

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cyberguard_club.git

# Navigate to project
cd cyberguard_club

# For local development, you can use any static server
# Example with Python:
python -m http.server 8000

# Or with Node.js:
npx serve .
```

## 📋 Flag Format

Flags are base64 encoded and rotate through variations of:
- `C7B3R_GU4RD_En150`
- `Cyb3rGu4rdEn15o`
- `cyb3r_gu4rd_en15o`
- And many more variations...

## 🔧 Features

- ✅ Time-based flag rotation (10 minutes)
- ✅ Multiple concurrent submissions allowed
- ✅ Real-time synchronization across all clients
- ✅ Responsive design for mobile/desktop
- ✅ Automatic redirect to success form
- ✅ Detailed logging and statistics

## 🎨 Customization

You can customize:
- Rotation interval (currently 10 minutes)
- Flag list in `api/flag-state.js`
- Success redirect URL
- Styling and theme
- Challenge text and hints

## 📞 Support

For issues or questions, check the GitHub issues or contact the challenge organizers.