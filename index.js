let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editingId = null;

const entryForm = document.getElementById("entryForm");
const entryList = document.getElementById("entryList");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const netBalance = document.getElementById("netBalance");
const resetBtn = document.getElementById("resetBtn");

function updateTotals() {
  const income = entries.filter(e => e.type === "income")
                        .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense")
                         .reduce((sum, e) => sum + e.amount, 0);
  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  netBalance.textContent = income - expense;
}

function renderEntries(filter = "all") {
  entryList.innerHTML = "";

  let filteredEntries = entries;
  if (filter !== "all") {
    filteredEntries = entries.filter(e => e.type === filter);
  }

  filteredEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.classList.add(entry.type);

    li.innerHTML = `
      <span>${entry.description}</span>
      <span>₹${entry.amount}</span>
      <div>
        <button class="edit" onclick="editEntry('${entry.id}')">Edit</button>
        <button class="delete" onclick="deleteEntry('${entry.id}')">Delete</button>
      </div>
    `;

    entryList.appendChild(li);
  });

  updateTotals();
}

function addOrUpdateEntry(e) {
  e.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!description || isNaN(amount)) return;

  if (editingId) {
    // Update
    entries = entries.map(entry =>
      entry.id === editingId ? { id: editingId, description, amount, type } : entry
    );
    editingId = null;
  } else {
    // Create
    const entry = {
      id: Date.now().toString(),
      description,
      amount,
      type
    };
    entries.push(entry);
  }

  saveAndRender();
  entryForm.reset();
}

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  document.getElementById("description").value = entry.description;
  document.getElementById("amount").value = entry.amount;
  document.getElementById("type").value = entry.type;
  editingId = id;
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("entries", JSON.stringify(entries));
  const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
  renderEntries(selectedFilter);
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener("change", () => {
    renderEntries(radio.value);
  });
});

resetBtn.addEventListener("click", () => {
  entryForm.reset();
  editingId = null;
});

entryForm.addEventListener("submit", addOrUpdateEntry);

// Initial render
renderEntries();
