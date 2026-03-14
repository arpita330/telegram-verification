export default function handler(req, res) {
  // Get the full URL from the request
  const fullUrl = `https://${req.headers.host}${req.url}`;
  
  // Parse the query parameters from the original link
  const webhookUrl = req.query.webhookUrl;
  const botId = req.query.botId;
  const tgWebAppData = req.query.tgWebAppData;
  
  // Extract user data from the query parameters
  let userId = null;
  let userData = null;
  
  // The user data is URL encoded in the tgWebAppData parameter
  // In your actual link, it's in the main URL path, so we need to reconstruct
  // For demo purposes, we'll redirect with the parameters
  
  // Determine which page to show based on verification status
  // This is where you'd add your actual verification logic
  // For demo, we'll randomly show success (you should implement real logic)
  
  // Example verification logic:
  const verificationStatus = 'success'; // Change this based on your actual verification
  
  // Redirect to appropriate page with user data
  let redirectUrl;
  const baseUrl = `https://${req.headers.host}`;
  
  if (verificationStatus === 'success') {
    redirectUrl = `${baseUrl}/success`;
  } else if (verificationStatus === 'already') {
    redirectUrl = `${baseUrl}/already`;
  } else if (verificationStatus === 'failed') {
    redirectUrl = `${baseUrl}/failed`;
  } else {
    redirectUrl = `${baseUrl}/`;
  }
  
  // Add the original tgWebAppData to maintain user session
  if (req.url.includes('tgWebAppData')) {
    const params = new URLSearchParams(req.url.split('?')[1]);
    redirectUrl += `?${params.toString()}`;
  }
  
  res.redirect(302, redirectUrl);
      }
