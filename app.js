function normalizeServer(url) {
  return url.replace(/\/+$/, '');
}

async function apiFetch(path) {
  const { server, apiKey } = window.jellyfinConfig || {};
  const url = `${server}${path}${path.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
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

document.getElementById('fetchButton').addEventListener('click', loadLibraries);

async function loadLibraries() {
  try {
    const me = await apiFetch('/Users/Me');
    window.jellyfinConfig.userId = me.Id;
    const views = await apiFetch(`/Users/${me.Id}/Views`);
    const list = document.getElementById('libraryList');
    list.innerHTML = '';
    (views.Items || []).forEach(lib => {
      const li = document.createElement('li');
      li.textContent = lib.Name;
      li.dataset.id = lib.Id;
      li.addEventListener('click', () => loadItems(lib.Id));
      list.appendChild(li);
    });
  } catch (err) {
    alert('Could not fetch libraries');
  }
}

async function loadItems(parentId) {
  try {
    const data = await apiFetch(`/Items?ParentId=${parentId}`);
    const list = document.getElementById('itemList');
    list.innerHTML = '';
    (data.Items || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.Name;
      li.addEventListener('click', () => playItem(item));
      list.appendChild(li);
    });
    document.getElementById('libraryList').classList.add('hidden');
    list.classList.remove('hidden');
    document.getElementById('backButton').classList.remove('hidden');
  } catch (err) {
    alert('Could not fetch items');
  }
}

document.getElementById('backButton').addEventListener('click', () => {
  document.getElementById('itemList').classList.add('hidden');
  document.getElementById('libraryList').classList.remove('hidden');
  document.getElementById('backButton').classList.add('hidden');
  document.getElementById('player').classList.add('hidden');
});

function playItem(item) {
  const { server, apiKey } = window.jellyfinConfig || {};
  const player = document.getElementById('player');
  player.innerHTML = '';
  let tag = 'video';
  let path = `/Videos/${item.Id}/stream`;
  if (item.MediaType === 'Audio') {
    tag = 'audio';
    path = `/Audio/${item.Id}/stream`;
  }
  const media = document.createElement(tag);
  media.controls = true;
  media.src = `${server}${path}?api_key=${encodeURIComponent(apiKey)}`;
  player.appendChild(media);
  player.classList.remove('hidden');
  media.play();
}

