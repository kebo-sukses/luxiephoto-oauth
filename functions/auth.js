exports.handler = async (event) => {
  const client_id = process.env.OAUTH_CLIENT_ID;
  const redirect_uri = process.env.OAUTH_REDIRECT_URI || `https://${event.headers.host}/.netlify/functions/callback`;
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Cache-Control': 'no-cache'
    },
    body: ''
  };
};
