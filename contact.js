turnstileId = turnstile.render("#turnstile", {sitekey: "0x4AAAAAAAAllJbp7rCcksvJ"})

if (turnstileId.startsWith("cf-chl-widget-")) {
  turnstileId = turnstileId.substring(14)
}

async function onSubmit() {
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  console.log(turnstileId);
  const captcha = turnstile.getResponse(turnstileId);

  const res = await fetch('/api/submit-contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      message,
      captcha,
    }),
  });

  // It was sent successfully :)
  if (res.status === 200) {
    // Reset fields
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    turnstile.reset('#turnstile');
    document.getElementById('error').innerText = 'Sent!';
  }
  else if (res.status === 500){
    document.getElementById('error').innerText = " An error ocurred while sending the message.";
    turnstile.reset('#turnstile');
  } else {
    const response = await res.text();
    turnstile.reset('#turnstile');
    document.getElementById('error').innerText = response;
  }
}

function validate() {
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  if (name.trim() === '' || message.trim() === '') {
    document.getElementById('error').innerText = 'Please enter your name and message!'
    return;
  } else {
    onSubmit();
  }
}

