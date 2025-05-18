const vin = new URLSearchParams(window.location.search).get("vin");
const carData = JSON.parse(sessionStorage.getItem("carData") || "[]");
const car = carData.find(c => c.vin === vin);

const form = document.getElementById("reservation-form");

if (car) {
  document.getElementById("car-name").textContent = `${car.brand} ${car.model}`;
  document.getElementById("car-year").textContent = `Year: ${car.year}`;
  document.getElementById("car-fuel").textContent = `Fuel: ${car.fuelType}`;
  document.getElementById("car-price").textContent = `Price per day: $${car.pricePerDay}`;
  document.getElementById("car-image").src = car.image;

  const rentalDaysInput = document.getElementById("rental-days");
  const totalPriceEl = document.getElementById("total-price");

  const updatePrice = () => {
    const days = parseInt(rentalDaysInput.value) || 1;
    const total = (days * car.pricePerDay).toFixed(2);
    totalPriceEl.textContent = total;
  };

  rentalDaysInput.addEventListener("input", updatePrice);
  updatePrice();
}

const savedData = JSON.parse(localStorage.getItem("savedReservation"));
if (savedData) {
  for (let key in savedData) {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      field.value = savedData[key];
    }
  }
}


form.addEventListener("input", () => {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  localStorage.setItem("savedReservation", JSON.stringify(data));
});


form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.vin = vin;
  sessionStorage.setItem("reservationDetails", JSON.stringify(data));
  localStorage.removeItem("savedReservation"); 
  window.location.href = "confirmation.html";
});


const cancelBtn = document.getElementById("cancelBtn");
if (cancelBtn) {
  cancelBtn.addEventListener("click", function () {
    localStorage.removeItem("savedReservation");
    sessionStorage.removeItem("reservationDetails");
    window.location.href = "index.html";
  });
}
