document.getElementById('loginButton').addEventListener('click', () => {
  const server = document.getElementById('server').value;
  const apiKey = document.getElementById('apikey').value;
  if (!server || !apiKey) {
    alert('Please enter server and API key');
    return;
  }
  window.jellyfinConfig = { server, apiKey };
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
});

document.getElementById('fetchButton').addEventListener('click', () => {
  const { server, apiKey } = window.jellyfinConfig;
  fetch(`${server}/Items`, {
    headers: {
      'X-Emby-Token': apiKey
    }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('libraryList');
      list.innerHTML = '';
      (data.Items || []).forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.Name;
        list.appendChild(li);
      });
    })
    .catch(() => alert('Could not fetch library'));
});
