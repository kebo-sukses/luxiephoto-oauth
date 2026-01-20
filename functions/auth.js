exports.handler = async (event) => {
  const client_id = process.env.OAUTH_CLIENT_ID;
  // Use luxiephoto.com callback which is registered in GitHub OAuth
  const redirect_uri = 'https://luxiephoto.com/api/auth/callback';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  };
};
