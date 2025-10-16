// Elementos principais
const searchInput = document.getElementById("searchInput");
const characterList = document.getElementById("characterList");
const filterButton = document.getElementById("filterButton");
const filterMenu = document.getElementById("filterMenu");
const tagList = document.getElementById("tagList");
const closeFilters = document.getElementById("closeFilters");

// Estado atual dos filtros
let selectedTags = new Set();

// Inicializa
window.onload = () => {
  renderTags();
  renderCharacters(personagens);
};

// Exibe/oculta menu de filtros
filterButton.onclick = () => filterMenu.classList.toggle("hidden");
closeFilters.onclick = () => filterMenu.classList.add("hidden");

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
  const allTags = [...new Set(personagens.flatMap(p => p.tags))];
  tagList.innerHTML = allTags.map(tag => `
    <label>
      <input type="checkbox" value="${tag}">
      ${tag}
    </label><br>
  `).join("");

  tagList.querySelectorAll("input").forEach(chk => {
    chk.onchange = () => {
      if (chk.checked) selectedTags.add(chk.value);
      else selectedTags.delete(chk.value);
      applyFilters();
    };
  });
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
