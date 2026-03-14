// api/verify.js
export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Get ALL parameters from the URL
    const { 
      botHash,      // Random hash you generated in bot code
      bot,          // Your bot's username
      webhook_url,  // Webhook URL for callbacks
      ...otherParams 
    } = req.query;
    
    // Extract Telegram user data from the URL
    const fullUrl = req.url;
    const tgWebAppData = fullUrl.split('tgWebAppData=')[1]?.split('&')[0];
    
    // 🔐 YOUR VERIFICATION LOGIC GOES HERE
    // This is where you decide which page to show
    // Examples:
    // - Check database if user exists
    // - Validate the botHash
    // - Check if user is banned
    // - etc.
    
    let verificationStatus = 'success'; // Change based on your logic
    
    // Simple example logic:
    const isFromTelegram = req.headers['user-agent']?.includes('Telegram') || tgWebAppData;
    
    if (!isFromTelegram) {
      verificationStatus = 'failed';  // Not opened from Telegram
    } else if (botHash === 'some_special_value') {
      verificationStatus = 'already'; // Already verified
    } else {
      verificationStatus = 'success';  // New verification
    }
    
    // Call the webhook URL if provided (asynchronous)
    if (webhook_url) {
      fetch(decodeURIComponent(webhook_url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified: verificationStatus === 'success',
          status: verificationStatus,
          user: tgWebAppData,
          botHash,
          timestamp: Date.now()
        })
      }).catch(console.error);
    }
    
    // Build redirect URL based on status
    const baseUrl = `https://${req.headers.host}`;
    let redirectPath;
    
    switch(verificationStatus) {
      case 'success': redirectPath = '/success'; break;
      case 'already': redirectPath = '/already'; break;
      case 'failed': redirectPath = '/failed'; break;
      default: redirectPath = '/';
    }
    
    // Preserve all original parameters
    const redirectUrl = new URL(redirectPath, baseUrl);
    Object.entries(req.query).forEach(([key, value]) => {
      redirectUrl.searchParams.append(key, value);
    });
    
    // Send user to the appropriate page
    res.redirect(302, redirectUrl.toString());
    
  } catch (error) {
    console.error('Error:', error);
    res.redirect(302, `https://${req.headers.host}/failed`);
  }
  }
