
const STORAGE_KEY = "lampStudioTickets";

// Get saved tickets from the browser
function getTickets() {
  try {
    const savedTickets = localStorage.getItem(STORAGE_KEY);
    return savedTickets ? JSON.parse(savedTickets) : [];
  } catch (error) {
    console.error("Could not load tickets:", error);
    return [];
  }
}

// Save tickets in the browser
function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

// Safely display text entered by the user
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return characters[character];
  });
}

// Ticket form
const ticketForm = document.getElementById("ticket-form");

if (ticketForm) {
  ticketForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formMessage = document.getElementById("form-message");

    const ticket = {
      id: "LAMP-" + Date.now().toString().slice(-6),
      name: document.getElementById("employee-name").value.trim(),
      email: document.getElementById("employee-email").value.trim(),
      category: document.getElementById("category").value,
      priority: document.getElementById("priority").value,
      description: document.getElementById("description").value.trim(),
      date: new Date().toLocaleString(),
      status: "Submitted"
    };

    if (
      !ticket.name ||
      !ticket.email ||
      !ticket.category ||
      !ticket.priority ||
      !ticket.description
    ) {
      formMessage.textContent = "Please complete all required fields.";
      formMessage.className = "form-message error";
      return;
    }

    const tickets = getTickets();
    tickets.unshift(ticket);
    saveTickets(tickets);

    formMessage.textContent =
      "Your demo ticket was submitted successfully! Ticket ID: " + ticket.id;

    formMessage.className = "form-message success";

    ticketForm.reset();
    renderTickets();
  });
}

// Display saved tickets
function renderTickets() {
  const container = document.getElementById("tickets-container");

  if (!container) {
    return;
  }

  const tickets = getTickets();

  if (tickets.length === 0) {
    container.innerHTML =
      '<p class="empty-state">You haven\'t submitted any tickets yet.</p>';
    return;
  }

  container.innerHTML = tickets.map(function (ticket) {
    return `
      <article class="ticket-card">
        <div class="ticket-card-top">
          <span class="ticket-id">${escapeHTML(ticket.id)}</span>
          <span class="ticket-priority">
            ${escapeHTML(ticket.priority)} Priority
          </span>
        </div>

        <h3>${escapeHTML(ticket.category)}</h3>

        <p>${escapeHTML(ticket.description)}</p>

        <p class="ticket-meta">
          Submitted by ${escapeHTML(ticket.name)} ·
          ${escapeHTML(ticket.date)} ·
          Status: ${escapeHTML(ticket.status)}
        </p>
      </article>
    `;
  }).join("");
}

// Clear saved tickets
const clearButton = document.getElementById("clear-tickets");

if (clearButton) {
  clearButton.addEventListener("click", function () {
    const confirmed = window.confirm(
      "Are you sure you want to clear all saved demo tickets?"
    );

    if (confirmed) {
      saveTickets([]);
      renderTickets();
    }
  });
}

// Help center search
const helpSearch = document.getElementById("help-search");

if (helpSearch) {
  helpSearch.addEventListener("input", function () {
    const searchText = helpSearch.value.toLowerCase().trim();
    const articles = document.querySelectorAll(".help-article");
    const noResults = document.getElementById("no-help-results");

    let visibleArticles = 0;

    articles.forEach(function (article) {
      const articleText = article.textContent.toLowerCase();
      const matches = articleText.includes(searchText);

      article.hidden = !matches;

      if (matches) {
        visibleArticles++;
      }
    });

    noResults.hidden = visibleArticles !== 0;
  });
}

// Load saved tickets when the page opens
renderTickets();
