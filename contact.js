async function onSubmit(token) {
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const captcha = token;

  const res = await fetch('https://erisa.uk/api/submit-contact', {
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
    //hcaptcha.reset();

    document.getElementById('error').innerText = 'Sent!';
  } else {
    const response = await res.text();
    document.getElementById('error').innerText = response;
  }
}

function validate(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  if (name.trim() === '' || message.trim() === '') {
    document.getElementById('error').innerText = 'Please enter your name and message!'
    return;
  } else {
    hcaptcha.execute();
  }
}

