
// ✅ Backend API URL (Render – production)
// 🔥 IMPORTANT: correct hyphen -> back-end
const BASE_URL = "https://protein-calculator-back-end.onrender.com/api/protein";

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  document
    .getElementById("userForm")
    .addEventListener("submit", handleAddUser);

  document
    .getElementById("editForm")
    .addEventListener("submit", handleEditUser);
}

// Load all users
async function loadUsers() {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = '<div class="loading">Loading users...</div>';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch users");

    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error("Error loading users:", error);
    showErrorAlert("Error loading users", error);
    usersList.innerHTML = `
      <div class="loading" style="color:red;">
        ❌ Backend not reachable. Check Render service.
      </div>`;
  }
}

// Display users
function displayUsers(users) {
  const usersList = document.getElementById("usersList");

  if (!users || users.length === 0) {
    usersList.innerHTML =
      '<div class="loading">📝 No users found. Add your first user!</div>';
    return;
  }

  usersList.innerHTML = users
    .map(
      (user) => `
      <div class="user-card">
        <div class="user-info">
          <h3>${user.name}</h3>
          <div class="user-details">
            <div class="detail-item">
              <span class="detail-label">Weight:</span>
              <span class="detail-value">${user.weight} kg</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Height:</span>
              <span class="detail-value">${user.height} cm</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Goal:</span>
              <span class="detail-value">${capitalizeGoal(user.goal)}</span>
            </div>
          </div>
        </div>

        <div class="user-actions">
          <div class="protein-badge">
            <div class="protein-amount">
              ${user.proteinRequired.toFixed(1)} g
            </div>
            <div class="protein-label">Daily Protein</div>
          </div>

          <button onclick="openEditModal(${user.id})" class="btn btn-edit">
            ✏️ Edit
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

// Handle add user
async function handleAddUser(e) {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    weight: Number(document.getElementById("weight").value),
    height: Number(document.getElementById("height").value),
    goal: document.getElementById("goal").value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Failed to add user");

    e.target.reset();
    await loadUsers(); // 🔥 POST apram GET
    showNotification("✅ User added successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
    showErrorAlert("Error adding user", error);
    showNotification("❌ Failed to add user");
  }
}

// Open edit modal
async function openEditModal(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");

    const user = await response.json();

    document.getElementById("editId").value = user.id;
    document.getElementById("editWeight").value = user.weight;
    document.getElementById("editHeight").value = user.height;
    document.getElementById("editGoal").value = user.goal;

    document.getElementById("editModal").style.display = "block";
  } catch (error) {
    console.error("Error loading user:", error);
    showErrorAlert("Error loading user details", error);
    showNotification("❌ Failed to load user details");
  }
}

// Handle edit user
async function handleEditUser(e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;

  const user = {
    weight: Number(document.getElementById("editWeight").value),
    height: Number(document.getElementById("editHeight").value),
    goal: document.getElementById("editGoal").value,
  };

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Failed to update user");

    closeModal();
    await loadUsers();
    showNotification("✅ User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    showErrorAlert("Error updating user", error);
    showNotification("❌ Failed to update user");
  }
}

// Close modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Helpers
function capitalizeGoal(goal) {
  if (!goal) return "";
  return goal.charAt(0).toUpperCase() + goal.slice(1);
}

// Centralized error alert helper
function showErrorAlert(context, error) {
  const message = `${context}: ${error && error.message ? error.message : error}`;
  alert(message);
}

function showNotification(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Global error handlers for unexpected frontend errors
window.addEventListener("error", (event) => {
  alert(`Frontend error: ${event.message}`);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason && event.reason.message ? event.reason.message : event.reason;
  alert(`Frontend async error: ${reason}`);
});
