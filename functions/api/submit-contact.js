// Adapted from https://github.com/WalshyDev/contact-form-with-workers/blob/main/worker/index.mjs
// Credit: @WalshyDev

export async function onRequestPost(ctx) {
    // dirty CORS response
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
    }

    let obj;
    try {
        obj = await ctx.request.json();
    } catch(e) {
        return new Response('Invalid JSON body!', { status: 400, headers: corsHeaders });
    }

    // Validate the JSON
    if (!obj.name || !obj.message || !obj.captcha) {
        return new Response('Invalid body', { status: 400, headers: corsHeaders });
    }

    // Validate the captcha
    const captchaVerified = await verifyHcaptcha(
        obj.captcha,
        ctx.request.headers.get('cf-connecting-ip'),
        ctx.env.HCAPTCHA_SECRET,
        ctx.env.HCAPTCHA_SITE_KEY
    );
    if (!captchaVerified) {
        return new Response('Invalid captcha', { status: 400, headers: corsHeaders });
    }

    // Send message :)
    // Just remove the comment from whichever one you want
    await sendDiscordMessage(obj, ctx.env.DISCORD_WEBHOOK_URL);
    // await sendEmailWithSendGrid();

    // Success
    return new Response(null, { status: 200, headers: corsHeaders });
}

async function verifyHcaptcha(response, ip, secret, siteKey) {
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
}

async function sendDiscordMessage(details, webhookUrl) {
    // Make sure to set the "DISCORD_WEBHOOK_URL" variable
    // wrangler secret put DISCORD_WEBHOOK_URL
    console.log('sending to ' + webhookUrl)
    await fetch(webhookUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        content: "<@228574821590499329>",
        embeds: [{
        title: 'New Message',
        type: 'rich',
        fields: [
            {
            name: 'Name/Email',
            value: details.name,
            }
            // {
            //   name: 'Message',
            //   value: details.message,
            // }
        ]
        },
        {
        description: details.message
        }],
    }),
    });
}
