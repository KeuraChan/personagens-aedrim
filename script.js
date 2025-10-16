// === ELEMENTOS PRINCIPAIS ===
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

// Exibe menu de filtros
filterButton.onclick = () => {
  filterMenu.classList.add("active");
  overlay.classList.add("active");
  filterMenu.classList.remove("hidden");
};

// Fecha o menu
closeFilters.onclick = fecharMenu;
overlay.onclick = fecharMenu;

function fecharMenu() {
  filterMenu.classList.remove("active");
  overlay.classList.remove("active");
  setTimeout(() => filterMenu.classList.add("hidden"), 300);
}

// === RENDERIZAÇÃO DE PERSONAGENS ===
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

    div.onclick = () => abrirModal(p);
    characterList.appendChild(div);
  });
}

// === FILTROS ===
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

// === MODAL COM CARROSSEL ===
const modal = document.getElementById("characterModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

// Elementos dinâmicos do carrossel
let carouselTrack, indicator;
let currentCharacter = null;
let currentImageIndex = 0;
let startX = 0;
let isDragging = false;

function abrirModal(personagem) {
  currentCharacter = personagem;
  currentImageIndex = 0;

  modalName.textContent = personagem.nome;
  modalDescription.textContent = personagem.descricao;

  // Cria o carrossel dinamicamente
  const container = document.getElementById("carouselContainer");
  container.innerHTML = `
    <button id="prevImage" class="carousel-btn">‹</button>
    <div id="carouselTrack"></div>
    <button id="nextImage" class="carousel-btn">›</button>
    <div id="indicator"></div>
  `;

  carouselTrack = document.getElementById("carouselTrack");
  indicator = document.getElementById("indicator");

  personagem.imagens.forEach(img => {
    const el = document.createElement("img");
    el.src = `imagens/${img}`;
    el.className = "carousel-image fade-in";
    carouselTrack.appendChild(el);
  });

  atualizarCarrossel();

  // Eventos
  document.getElementById("prevImage").onclick = () => mudarImagem(-1);
  document.getElementById("nextImage").onclick = () => mudarImagem(1);

  const container = document.getElementById("carouselContainer");
  container.addEventListener("mousedown", iniciarArraste);
  container.addEventListener("touchstart", iniciarArraste);
  container.addEventListener("mousemove", moverArraste);
  container.addEventListener("touchmove", moverArraste);
  container.addEventListener("mouseup", terminarArraste);
  container.addEventListener("mouseleave", terminarArraste);
  container.addEventListener("touchend", terminarArraste);


  modal.classList.add("active");
  modalOverlay.classList.add("active");
}

function fecharModal() {
  modal.classList.remove("active");
  modalOverlay.classList.remove("active");
}

closeModal.onclick = fecharModal;
modalOverlay.onclick = fecharModal;

function mudarImagem(direcao) {
  const total = currentCharacter.imagens.length;
  currentImageIndex = (currentImageIndex + direcao + total) % total;
  atualizarCarrossel();
}

function atualizarCarrossel() {
  const total = currentCharacter.imagens.length;
  carouselTrack.style.transition = "transform 0.4s ease";
  carouselTrack.style.transform = `translateX(-${currentImageIndex * 100}%)`;

  // Fade effect
  carouselTrack.querySelectorAll("img").forEach((img, i) => {
    img.classList.toggle("fade-in", i === currentImageIndex);
  });

  indicator.textContent = `${currentImageIndex + 1} / ${total}`;
}

// === Funções de arrasto ===
function iniciarArraste(e) {
  isDragging = true;
  startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  carouselTrack.style.transition = "none";
}

function moverArraste(e) {
  if (!isDragging) return;
  const currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const deltaX = currentX - startX;
  carouselTrack.style.transform = `translateX(calc(-${currentImageIndex * 100}% + ${deltaX}px))`;
}

function terminarArraste(e) {
  if (!isDragging) return;
  isDragging = false;
  const endX = e.type.includes("touch") ? e.changedTouches[0].clientX : e.clientX;
  const deltaX = endX - startX;

  if (deltaX > 80) mudarImagem(-1);
  else if (deltaX < -80) mudarImagem(1);
  else atualizarCarrossel();
}

