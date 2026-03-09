const cardsContainer = document.getElementById("cards-container");

const labelStyles = {
  "bug":              { class: "bg-red-50 text-red-500 border-red-200" },
  "help wanted":      { class: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  "enhancement":      { class: "bg-green-50 text-green-600 border-green-200" },
};
function showSpinner() {
  cardsContainer.innerHTML = `
    <div class="col-span-4 flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>`
};

//CREATE CARD
function createCard(card) {
  const borderColor = card.status === 'open' ? 'border-t-green-500' : 'border-t-purple-600'
  const statusIcon  = card.status === 'open'
    ? `<i class="fa-regular fa-circle-dot" style="color: rgb(99,230,190);"></i>`
    : `<i class="fa-regular fa-circle-check" style="color: rgb(177,151,252);"></i>`
  const labelsHTML = card.labels.map(label => {
    const l = labelStyles[label] || { class: "bg-blue-50 text-blue-500 border-blue-200" }
    return `<span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${l.class}">
              ${label}
            </span>`
  }).join('')

  return `
    <div onclick="openModal(${card.id})"
         class="bg-white border-t-4 ${borderColor} border border-gray-200
                rounded-xl p-4 flex flex-col gap-3 shadow-sm cursor-pointer">

                <div class="flex items-center justify-between">
        <span class="text-base">${statusIcon}</span>
        <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          ${card.priority}
        </span>
      </div>

      <h3 class="text-sm font-semibold leading-snug">${card.title}</h3>
      <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">${card.description}</p>

      <div class="flex flex-wrap gap-1.5">${labelsHTML}</div>

      <div class="flex flex-col gap-0.5 pt-2 border-t border-gray-100
                  text-[11px] text-gray-400 font-mono">
        <span>#${card.id} by ${card.author}</span>
        <span>${new Date(card.createdAt).toLocaleDateString()}</span>
      </div>
    </div>`
};
//  CARDS RENDER 
function renderCards(cards) {
  document.getElementById("issue-count").textContent = `${cards.length} Issues`

  if (cards.length === 0) {
    cardsContainer.innerHTML = `
      <div class="col-span-4 items-center justify-center py-20 text-gray-400">
        <p class="text-sm">No issue found</p>
      </div>`
    return;
  };

  cardsContainer.innerHTML = cards.map(createCard).join('');
};

// =====step 10. MODAL =====
function openModal(id) {
  const card = allCards.find(c => c.id === id)
  if (!card) return;

  // title
  document.getElementById("modal-title").textContent = card.title

  // status badge
  const isOpen = card.status === 'open'
  document.getElementById("modal-status-badge").innerHTML = `
    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full
                 ${isOpen ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}">
      ${isOpen ? 'Opened' : 'Closed'}
    </span>`

  // meta
  document.getElementById("modal-meta").textContent =
    `Opened by ${card.author} • ${new Date(card.createdAt).toLocaleDateString()}`

  // labels
  document.getElementById("modal-labels").innerHTML = card.labels.map(label => {
    const l = labelStyles[label] || { class: "bg-gray-50 text-gray-500 border-gray-200" }
    return `<span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${l.class}">${label}</span>`
  }).join('')

  // description
  document.getElementById("modal-desc").textContent = card.description

  // assignee
  document.getElementById("modal-assignee").textContent = card.assignee || card.author

  // priority
  const p = document.getElementById("modal-priority")
  p.textContent = card.priority?.toUpperCase()
  p.className = `text-xs font-bold px-3 py-1 ${card.priority}`

  // show modal
  const modal = document.getElementById("card-modal")
  modal.classList.remove("hidden")
  modal.classList.add("flex")
}

function closeModal() {
  const modal = document.getElementById("card-modal")
  modal.classList.add("hidden")
  modal.classList.remove("flex")
}

//  LOAD ALL 
let allCards = [];

async function loadCards() {
  showSpinner()
  const res  = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  const data = await res.json()
  allCards = data.data;
  renderCards(allCards);
};

//  ACTIVE BUTTON 
function setActiveButton(status) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("btn-primary")
    btn.classList.add("btn-ghost")
  })
  document.getElementById(`btn-${status}`).classList.remove("btn-ghost")
  document.getElementById(`btn-${status}`).classList.add("btn-primary")
};

//  FILTER 
function filterCards(status) {
  setActiveButton(status)
  showSpinner()
    if (status === "all") {
      renderCards(allCards)
    } else {
      const filtered = allCards.filter(card => card.status === status)
      renderCards(filtered)
    }
};



//  SEARCH 
async function handleSearch(searchText) {
  if (!searchText) {
    renderCards(allCards)
    return
  }

  showSpinner()
  const res  = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
  const data = await res.json()
  renderCards(data.data)
};

// Search clear 
document.getElementById("search-input").addEventListener("input", function () {
  if (this.value === "") {
    renderCards(allCards)
  }
});


loadCards();