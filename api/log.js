// api/log.js
export default function handler(req, res) {
  const { hash, bot, webhook } = req.query;
  
  // Log to Vercel console (you can see this in Vercel dashboard)
  console.log({
    time: new Date().toISOString(),
    hash: hash,
    bot: bot,
    webhook: decodeURIComponent(webhook || '')
  });
  
  // You can also store in a database here
  
  res.status(200).json({ 
    status: 'logged',
    hash,
    bot,
    time: Date.now()
  });
}