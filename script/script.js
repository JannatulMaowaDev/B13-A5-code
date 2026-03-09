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

// =====LOAD ALL =====
let allCards = [];

async function loadCards() {
  showSpinner()
  const res  = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  const data = await res.json()
  allCards = data.data;
  console.log(allCards);
};