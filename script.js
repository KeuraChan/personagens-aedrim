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
};

// Fecha ao clicar no botão ✕
closeFilters.onclick = fecharMenu;

// Fecha ao clicar fora do menu
overlay.onclick = fecharMenu;

function fecharMenu() {
  filterMenu.classList.remove("active");
  overlay.classList.remove("active");
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
