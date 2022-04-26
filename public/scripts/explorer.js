const botao = document.querySelector('#procurar-arquivo');
const inputFile = document.querySelector('#input-file');
const tbody = document.querySelector('tbody');
const modal = new bootstrap.Modal(document.getElementById('exampleModal'));

function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
}

function getKeysFiles() {
  let files = [];
  try {
    files = JSON.parse(localStorage.getItem('files'));
    if (files === null) {
      files = [];
    }
  } catch (e) {}
  return files;
}

function addKeyFile(key) {
  const files = getKeysFiles();

  files.push(key);

  localStorage.setItem('files', JSON.stringify(files));
}

function removeKeyFile(key) {
  localStorage.removeItem(key);
  const files = getKeysFiles();

  localStorage.setItem(
    'files',
    JSON.stringify(files.filter((file) => file !== key))
  );
}

function humanFileType(type) {
  switch (type) {
    case 'image/png':
      return 'Imagem PNG';
    case 'image/jpeg':
      return 'Foto';
  }
}

function renderRow(file) {
  const tr = document.createElement('tr');

  tr.dataset.name = file.name;
  tr.dataset.type = file.type;
  tr.dataset.size = file.size;

  tr.innerHTML = `
    <td>
      <div class="d-flex px-2">
        <div>
          <img
           
            src="./assets/img/small-logos/logo-asana.svg"
            class="avatar avatar-sm rounded-circle me-2"
            alt="spotify"
          />
        </div>
        <div class="my-auto">
          <h6 class="mb-0 text-sm">${file.name}</h6>
        </div>
      </div>
    </td>
    <td>
      <p class="text-sm font-weight-bold mb-0">${humanFileType(file.type)}</p>
    </td>
    <td>
      <span class="text-xs font-weight-bold">${humanFileSize(
        file.size,
        true
      )}</span>
    </td>
    <td class="align-middle text-center tr-progress">
      <div
        class="d-flex align-items-center justify-content-center"
      >
        <span class="me-2 text-xs font-weight-bold"
          >0%</span
        >
        <div>
          <div class="progress">
            <div
              class="progress-bar bg-gradient-info"
              role="progressbar"
              aria-valuenow="60"
              aria-valuemin="0"
              aria-valuemax="100"
              style="width: 0%"
            ></div>
          </div>
        </div>
      </div>
    </td>
    <td class="align-middle">
      <button class="btn btn-link text-secondary mb-0 btn-delete">
        <i class="fa fa-trash text-xs"></i>
      </button>
    </td>
    `;

  tr.querySelector('.btn-delete').addEventListener('click', () => {
    if (confirm('Deseja excluir o arquivo?')) {
      removeKeyFile(file.name);
      tr.remove();
    }
  });

  tr.querySelector('img').addEventListener('click', () => {
    //modal.show();

    const meuModal = document.querySelector('#exampleModal');

    meuModal.style.display = 'block';
    meuModal.classList.add('show');

    const backDrop = document.createElement('div');
    backDrop.classList.add('modal-backdrop', 'fade', 'show');

    document.body.appendChild(backDrop);

    meuModal.querySelector('.modal-inner').addEventListener('click', () => {
      meuModal.style.display = 'none';
      meuModal.classList.remove('show');

      backDrop.remove();
    });

    const img = document.createElement('img');

    img.src = file.url;
    img.style.width = '100%';

    document
      .querySelector('#exampleModal')
      .querySelector('.modal-body').innerHTML = img.outerHTML;
  });

  tbody.append(tr);

  tr.dataset.valor = '0';

  return tr;
}

botao.addEventListener('click', () => {
  inputFile.click();
});

inputFile.addEventListener('change', (evento) => {
  const { files } = evento.target;

  if (files.length) {
    const file = files[0];

    localStorage.setItem(
      `${file.name}`,
      JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
      })
    );

    addKeyFile(file.name);

    const tr = renderRow(file);
    const reader = new FileReader();
    const progress = tr.querySelector('.tr-progress');

    const interval = setInterval(() => {
      const valor = Number(tr.dataset.valor) + 1;

      if (valor > 100) {
        clearInterval(interval);
      }

      tr.dataset.valor = String(valor);

      progress.querySelector('span').innerHTML = valor + '%';
      progress.querySelector('.progress-bar').style.width = valor + '%';
    }, 100);

    reader.onload = () => {
      localStorage.setItem(
        `${file.name}`,
        JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          url: reader.result,
        })
      );

      clearInterval(interval);

      const img = tr.querySelector('img');

      if (img) {
        img.src = reader.result;
      }

      progress.dataset.valor = '100';
      progress.querySelector('span').innerHTML = '100%';
      progress.querySelector('.progress-bar').style.width = '100%';
    };

    reader.readAsDataURL(file);
  }
});

function loadStorageFiles() {
  document.querySelector('tbody').innerHTML = '';

  const files = getKeysFiles();

  files.forEach((key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      if (data !== null) {
        const tr = renderRow(data);

        tr.querySelector('img').src = data.url;

        const progress = tr.querySelector('.tr-progress');
        progress.dataset.valor = '100';
        progress.querySelector('span').innerHTML = '100%';
        progress.querySelector('.progress-bar').style.width = '100%';
      }
    } catch (e) {}
  });
}

loadStorageFiles();

const buttonRealod = document.querySelector('#btn-reload');

buttonRealod.addEventListener('click', () => {
  location.reload();
});

const inputUrl = document.getElementById('url');

inputUrl.addEventListener('change', (evento) => {
  location.href = evento.target.value;
});
