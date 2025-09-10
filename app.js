function normalizeServer(url) {
  return url.replace(/\/+$/, '');
}

document.getElementById('loginButton').addEventListener('click', () => {
  let server = document.getElementById('server').value.trim();
  const apiKey = document.getElementById('apikey').value.trim();
  if (!server || !apiKey) {
    alert('Please enter server and API key');
    return;
  }
  server = normalizeServer(server);
  window.jellyfinConfig = { server, apiKey };
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
});

document.getElementById('fetchButton').addEventListener('click', async () => {
  const { server, apiKey } = window.jellyfinConfig || {};
  const url = `${server}/Items?api_key=${encodeURIComponent(apiKey)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    const list = document.getElementById('libraryList');
    list.innerHTML = '';
    (data.Items || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.Name;
      list.appendChild(li);
    });
  } catch (err) {
    alert('Could not fetch library');
  }
});
