// Elementos principais
const searchInput = document.getElementById("searchInput");
const characterList = document.getElementById("characterList");
const filterButton = document.getElementById("filterButton");
const filterMenu = document.getElementById("filterMenu");
const tagList = document.getElementById("tagList");
const closeFilters = document.getElementById("closeFilters");
const overlay = document.getElementById("overlay");

// Estado atual dos filtros
let selectedTags = new Set();

// Inicializa
window.onload = () => {
  renderTags();
  renderCharacters(personagens);
};

// Exibe menu de filtros com animação e desfoque
filterButton.onclick = () => {
  filterMenu.classList.add("active");
  overlay.classList.add("active");
  filterMenu.classList.remove("hidden");
};

// Fecha ao clicar no botão ✕
closeFilters.onclick = fecharMenu;

// Fecha ao clicar fora do menu
overlay.onclick = fecharMenu;

function fecharMenu() {
  filterMenu.classList.remove("active");
  overlay.classList.remove("active");
  // após a animação, recoloca o display:none
  setTimeout(() => {
    filterMenu.classList.add("hidden");
  }, 300); // mesmo tempo da transição no CSS
}

// Renderiza lista de personagens
function renderCharacters(lista) {
  characterList.innerHTML = "";
  lista.forEach(p => {
    const div = document.createElement("div");
    div.className = "character-card";

    div.innerHTML = `
      <img src="imagens/${p.imagens[0]}" alt="${p.nome}">
      <h2>${p.nome}</h2>
      <p>${p.resumo}</p>
      <div>${p.tags.map(t => `<span class='tag'>${t}</span>`).join(" ")}</div>
    `;

    characterList.appendChild(div);
  });
}

// Cria as opções de filtro por tag
function renderTags() {
  tagList.innerHTML = "";

  for (const categoria in TODAS_AS_TAGS) {
    const grupo = TODAS_AS_TAGS[categoria];

    const categoriaDiv = document.createElement("div");
    categoriaDiv.className = "categoria-tags";

    const titulo = document.createElement("h4");
    titulo.textContent = categoria;
    categoriaDiv.appendChild(titulo);

    for (const key in grupo) {
      const valor = grupo[key];

      const label = document.createElement("label");
      label.className = "tag-option";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = valor;

      checkbox.onchange = () => {
        if (checkbox.checked) selectedTags.add(valor);
        else selectedTags.delete(valor);
        applyFilters();
      };

      label.appendChild(checkbox);
      label.append(" " + valor);
      categoriaDiv.appendChild(label);
      categoriaDiv.appendChild(document.createElement("br"));
    }

    tagList.appendChild(categoriaDiv);
  }
}

// Aplica busca + filtros
searchInput.oninput = applyFilters;

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  let filtrados = personagens.filter(p =>
    p.nome.toLowerCase().includes(search) ||
    p.resumo.toLowerCase().includes(search) ||
    p.descricao.toLowerCase().includes(search)
  );

  if (selectedTags.size > 0) {
    filtrados = filtrados.filter(p =>
      p.tags.some(tag => selectedTags.has(tag))
    );
  }

  renderCharacters(filtrados);
}

// === MODAL DE DETALHES ===
const modal = document.getElementById("characterModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modalName");
const modalImage = document.getElementById("modalImage");
const modalDescription = document.getElementById("modalDescription");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

let currentCharacter = null;
let currentImageIndex = 0;

// Evento para abrir o modal ao clicar em um personagem
function renderCharacters(lista) {
  characterList.innerHTML = "";
  lista.forEach(p => {
    const div = document.createElement("div");
    div.className = "character-card";

    div.innerHTML = `
      <img src="imagens/${p.imagens[0]}" alt="${p.nome}">
      <h2>${p.nome}</h2>
      <p>${p.resumo}</p>
      <div>${p.tags.map(t => `<span class='tag'>${t}</span>`).join(" ")}</div>
    `;

    // 👉 Clique abre modal
    div.onclick = () => abrirModal(p);

    characterList.appendChild(div);
  });
}

function abrirModal(personagem) {
  currentCharacter = personagem;
  currentImageIndex = 0;

  modalName.textContent = personagem.nome;
  modalDescription.textContent = personagem.descricao;
  modalImage.src = `imagens/${personagem.imagens[currentImageIndex]}`;

  modal.classList.add("active");
  modalOverlay.classList.add("active");
}

function fecharModal() {
  modal.classList.remove("active");
  modalOverlay.classList.remove("active");
}

closeModal.onclick = fecharModal;
modalOverlay.onclick = fecharModal;

// Navegação do carrossel
prevImage.onclick = () => trocarImagem(-1);
nextImage.onclick = () => trocarImagem(1);

function trocarImagem(direcao) {
  if (!currentCharacter) return;

  const total = currentCharacter.imagens.length;
  currentImageIndex = (currentImageIndex + direcao + total) % total;

  modalImage.src = `imagens/${currentCharacter.imagens[currentImageIndex]}`;
}
