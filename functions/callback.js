const https = require('https');

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  
  if (!code) {
    return {
      statusCode: 400,
      body: 'Missing code parameter'
    };
  }

  const client_id = process.env.OAUTH_CLIENT_ID;
  const client_secret = process.env.OAUTH_CLIENT_SECRET;

  try {
    const tokenResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        client_id,
        client_secret,
        code
      });

      const options = {
        hostname: 'github.com',
        port: 443,
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': postData.length
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    if (tokenResponse.error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: `<script>
          window.opener.postMessage('authorization:github:error:${JSON.stringify(tokenResponse)}', '*');
          window.close();
        </script>`
      };
    }

    const token = tokenResponse.access_token;
    const provider = 'github';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html>
<html>
<head><title>Authorization Complete</title></head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    console.log("receiveMessage %o", e);
    window.opener.postMessage(
      'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:${provider}", "*");
})();
</script>
</body>
</html>`
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};
