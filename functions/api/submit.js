export default {
    async fetch(request, env) {
      // Make sure it's a POST request
      if (request.method !== 'POST') {
        return new Response('Not a POST', { status: 400 });
      }
  
      let obj;
      try {
        obj = await request.json();
      } catch(e) {
        return new Response('Invalid JSON body!');
      }
  
      // Validate the JSON
      if (!obj.name || !obj.message || !obj.captcha) {
        return new Response('Invalid body', { status: 400 });
      }
  
      // Validate the captcha
      const captchaVerified = await this.verifyHcaptcha(
        obj.captcha,
        request.headers.get('cf-connecting-ip'),
        env.HCAPTCHA_SECRET,
        env.HCAPTCHA_SITE_KEY
      );
      if (!captchaVerified) {
        return new Response('Invalid captcha', { status: 400 });
      }
  
      // Send message :)
      // Just remove the comment from whichever one you want
      await this.sendDiscordMessage(obj, env.DISCORD_WEBHOOK_URL);
      // await this.sendEmailWithSendGrid();
  
      // Success
      return new Response();
    },
  
    async verifyHcaptcha(response, ip, secret, siteKey) {
      // Make sure to set the "HCAPTCHA_SECRET" & "HCAPTCHA_SITE_KEY" variable
      // wrangler secret put HCAPTCHA_SECRET & wrangler secret put HCAPTCHA_SITE_KEY
      const res = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `response=${response}&remoteip=${ip}&secret=${secret}&sitekey=${siteKey}`
      });
  
      const json = await res.json();
      return json.success;
    },
  
    async sendDiscordMessage(details, webhookUrl) {
      // Make sure to set the "DISCORD_WEBHOOK_URL" variable
      // wrangler secret put DISCORD_WEBHOOK_URL
      console.log('sending to ' + webhookUrl)
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Website Contact Form',
          embeds: [{
            title: 'New Message',
            type: 'rich',
            fields: [
              {
                name: 'Name',
                value: details.name,
              },
              {
                name: 'Message',
                value: details.message,
              }
            ]
          }]
        }),
      });
    },
  
    async sendEmailWithSendGrid(details) {
      // TODO
    }
  }
