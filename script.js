const trainers = [
  {
    id: 1,
    name: "Arif Rahman",
    initials: "AR",
    specialization: "Strength Training",
    skills: ["Muscle Gain", "Mobility", "Home Training"],
    price: 700,
    rating: 4.9,
    experience: "5 years",
    availability: ["09:00 AM", "11:30 AM", "06:00 PM"],
    verified: true,
    description: "Certified strength coach focused on safe muscle building, posture correction, and home-based workout plans."
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    initials: "NJ",
    specialization: "Weight Loss",
    skills: ["Fat Loss", "Nutrition", "Cardio"],
    price: 600,
    rating: 4.8,
    experience: "4 years",
    availability: ["08:00 AM", "04:00 PM", "08:00 PM"],
    verified: true,
    description: "Weight-loss trainer offering personalized routines and progress tracking for busy working professionals."
  },
  {
    id: 3,
    name: "Mehedi Hasan",
    initials: "MH",
    specialization: "Elderly Fitness",
    skills: ["Low Impact", "Balance", "Mobility"],
    price: 500,
    rating: 4.7,
    experience: "3 years",
    availability: ["10:00 AM", "12:00 PM", "05:00 PM"],
    verified: true,
    description: "Specializes in elderly-friendly fitness, mobility improvement, and simple home exercise routines."
  },
  {
    id: 4,
    name: "Farhana Karim",
    initials: "FK",
    specialization: "Yoga",
    skills: ["Flexibility", "Stress Relief", "Online Training"],
    price: 550,
    rating: 4.6,
    experience: "6 years",
    availability: ["07:00 AM", "03:00 PM", "07:30 PM"],
    verified: false,
    description: "Yoga instructor providing online and home sessions for flexibility, breathing, and stress management."
  },
  {
    id: 5,
    name: "Sakib Hossain",
    initials: "SH",
    specialization: "Cardio",
    skills: ["Endurance", "HIIT", "Weight Loss"],
    price: 800,
    rating: 4.9,
    experience: "7 years",
    availability: ["06:30 AM", "01:00 PM", "09:00 PM"],
    verified: true,
    description: "Cardio and HIIT trainer helping users improve endurance, stamina, and body composition."
  },
  {
    id: 6,
    name: "Tanjila Akter",
    initials: "TA",
    specialization: "Strength Training",
    skills: ["Women Fitness", "Beginner Plan", "Gym Training"],
    price: 650,
    rating: 4.5,
    experience: "3 years",
    availability: ["09:30 AM", "02:30 PM", "06:30 PM"],
    verified: false,
    description: "Beginner-friendly trainer offering guided strength training for female users and first-time gym clients."
  }
];

let selectedTrainer = null;
let toastTimeout;

const trainerGrid = document.getElementById("trainerGrid");
const searchInput = document.getElementById("searchInput");
const specializationFilter = document.getElementById("specializationFilter");
const priceFilter = document.getElementById("priceFilter");
const ratingFilter = document.getElementById("ratingFilter");
const resetFilters = document.getElementById("resetFilters");
const modal = document.getElementById("bookingModal");
const closeModal = document.getElementById("closeModal");
const bookingForm = document.getElementById("bookingForm");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const bookingTime = document.getElementById("bookingTime");
const bookingDate = document.getElementById("bookingDate");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const toast = document.getElementById("toast");
const adminTrainerRows = document.getElementById("adminTrainerRows");
const transactionRows = document.getElementById("transactionRows");
const bookingsModal = document.getElementById("bookingsModal");
const closeBookingsModal = document.getElementById("closeBookingsModal");
const bookingsList = document.getElementById("bookingsList");
const showBookings = document.getElementById("showBookings");
const trainerEarnings = document.getElementById("trainerEarnings");
const registrationForm = document.getElementById("registrationForm");
const chatWidget = document.getElementById("chatWidget");
const openChatDemo = document.getElementById("openChatDemo");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");

function getBookings() {
  return JSON.parse(localStorage.getItem("fitconnectBookings") || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem("fitconnectBookings", JSON.stringify(bookings));
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderTrainers() {
  const query = searchInput.value.trim().toLowerCase();
  const specialization = specializationFilter.value;
  const maxPrice = Number(priceFilter.value);
  const minRating = Number(ratingFilter.value);

  const filtered = trainers.filter((trainer) => {
    const text = `${trainer.name} ${trainer.specialization} ${trainer.skills.join(" ")}`.toLowerCase();
    return text.includes(query)
      && (specialization === "all" || trainer.specialization === specialization)
      && trainer.price <= maxPrice
      && trainer.rating >= minRating;
  });

  if (!filtered.length) {
    trainerGrid.innerHTML = `<div class="empty-state"><h3>No trainers found</h3><p>Try changing your filters or search keyword.</p></div>`;
    return;
  }

  trainerGrid.innerHTML = filtered.map((trainer) => `
    <article class="trainer-card">
      <div class="trainer-cover">
        <span class="verify-badge">${trainer.verified ? "✓ Verified" : "Pending Verification"}</span>
        <div class="avatar">${trainer.initials}</div>
      </div>
      <div class="trainer-body">
        <h3>${trainer.name}</h3>
        <p class="trainer-specialty">${trainer.specialization}</p>
        <div class="trainer-meta">
          <span>★ ${trainer.rating}</span>
          <span>${trainer.experience}</span>
          <span>৳${trainer.price}/session</span>
        </div>
        <div class="trainer-meta">
          ${trainer.skills.map((skill) => `<span>${skill}</span>`).join("")}
        </div>
        <p class="trainer-desc">${trainer.description}</p>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="openBooking(${trainer.id})">Book Trainer</button>
          <button class="btn btn-secondary" onclick="openChatFor('${trainer.name}')">Chat / Call</button>
        </div>
      </div>
    </article>
  `).join("");
}

function openBooking(id) {
  selectedTrainer = trainers.find((trainer) => trainer.id === id);
  if (!selectedTrainer) return;

  modalTitle.textContent = `Book ${selectedTrainer.name}`;
  modalSubtitle.textContent = `${selectedTrainer.specialization} • ৳${selectedTrainer.price} per session • ★ ${selectedTrainer.rating}`;
  bookingTime.innerHTML = selectedTrainer.availability.map((time) => `<option value="${time}">${time}</option>`).join("");
  bookingDate.min = new Date().toISOString().split("T")[0];
  bookingDate.value = bookingDate.min;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeBookingModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  bookingForm.reset();
}

function renderAdminPanel() {
  adminTrainerRows.innerHTML = trainers.map((trainer) => `
    <tr>
      <td>${trainer.name}</td>
      <td>${trainer.specialization}</td>
      <td><span class="status ${trainer.verified ? "verified" : "pending"}">${trainer.verified ? "Verified" : "Pending"}</span></td>
      <td><button class="small-btn" onclick="verifyTrainer(${trainer.id})">${trainer.verified ? "Checked" : "Verify"}</button></td>
    </tr>
  `).join("");

  renderTransactions();
}

function verifyTrainer(id) {
  const trainer = trainers.find((item) => item.id === id);
  if (!trainer) return;
  trainer.verified = true;
  renderTrainers();
  renderAdminPanel();
  showToast(`${trainer.name} is now verified.`);
}

function renderTransactions() {
  const bookings = getBookings();
  if (!bookings.length) {
    transactionRows.innerHTML = `<tr><td colspan="3">No transactions yet.</td></tr>`;
  } else {
    transactionRows.innerHTML = bookings.slice(-6).reverse().map((booking) => `
      <tr>
        <td>${booking.trainerName}<br><small>${booking.date}, ${booking.time}</small></td>
        <td>৳${booking.price}</td>
        <td><span class="status paid">Paid</span></td>
      </tr>
    `).join("");
  }

  const total = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
  trainerEarnings.textContent = `৳${total}`;
}

function renderBookings() {
  const bookings = getBookings();
  if (!bookings.length) {
    bookingsList.innerHTML = `<div class="empty-state"><h3>No bookings yet</h3><p>Book a trainer first to see your demo booking history.</p></div>`;
    return;
  }

  bookingsList.innerHTML = bookings.slice().reverse().map((booking, index) => `
    <div class="booking-item">
      <h4>${booking.trainerName}</h4>
      <p><strong>Session:</strong> ${booking.sessionType}</p>
      <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
      <p><strong>Payment:</strong> SSLCommerz Sandbox • ৳${booking.price} • Paid</p>
      <p><strong>Status:</strong> Trainer confirmation pending</p>
      <div class="review-row">
        <select aria-label="Rating for ${booking.trainerName}" id="rating-${index}">
          <option>5 ★</option>
          <option>4 ★</option>
          <option>3 ★</option>
          <option>2 ★</option>
          <option>1 ★</option>
        </select>
        <button class="small-btn" onclick="submitReview('${booking.trainerName}')">Submit Review</button>
      </div>
    </div>
  `).join("");
}

function submitReview(name) {
  showToast(`Review submitted for ${name}.`);
}

function openChatFor(name) {
  chatWidget.classList.add("open");
  chatBody.innerHTML += `<p class="bot-msg">You are now connected with ${name}'s support channel. This is a demo chat.</p>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedTrainer) return;

  const booking = {
    id: Date.now(),
    trainerId: selectedTrainer.id,
    trainerName: selectedTrainer.name,
    price: selectedTrainer.price,
    date: bookingDate.value,
    time: bookingTime.value,
    sessionType: document.getElementById("sessionType").value,
    note: document.getElementById("bookingNote").value,
    payment: "SSLCommerz Sandbox",
    status: "Paid"
  };

  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
  closeBookingModal();
  renderTransactions();
  showToast("Payment successful. Booking request sent to trainer.");
});

searchInput.addEventListener("input", renderTrainers);
specializationFilter.addEventListener("change", renderTrainers);
priceFilter.addEventListener("change", renderTrainers);
ratingFilter.addEventListener("change", renderTrainers);

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  specializationFilter.value = "all";
  priceFilter.value = "9999";
  ratingFilter.value = "0";
  renderTrainers();
});

closeModal.addEventListener("click", closeBookingModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeBookingModal();
});

showBookings.addEventListener("click", () => {
  renderBookings();
  bookingsModal.classList.add("open");
  bookingsModal.setAttribute("aria-hidden", "false");
});

closeBookingsModal.addEventListener("click", () => {
  bookingsModal.classList.remove("open");
  bookingsModal.setAttribute("aria-hidden", "true");
});

bookingsModal.addEventListener("click", (event) => {
  if (event.target === bookingsModal) {
    bookingsModal.classList.remove("open");
    bookingsModal.setAttribute("aria-hidden", "true");
  }
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTo);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("fullName").value.trim();
  const accountType = document.getElementById("accountType").value;
  if (!name) return;
  showToast(`${accountType} demo account created for ${name}.`);
  registrationForm.reset();
});

openChatDemo.addEventListener("click", () => {
  chatWidget.classList.add("open");
});

closeChat.addEventListener("click", () => {
  chatWidget.classList.remove("open");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatBody.innerHTML += `<p class="user-msg">${message}</p>`;
  chatInput.value = "";
  setTimeout(() => {
    chatBody.innerHTML += `<p class="bot-msg">Thank you. This message has been received in the demo communication module.</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 500);
  chatBody.scrollTop = chatBody.scrollHeight;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBookingModal();
    bookingsModal.classList.remove("open");
    chatWidget.classList.remove("open");
  }
});

renderTrainers();
renderAdminPanel();
