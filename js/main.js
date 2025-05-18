let carData = [];

function renderCars(cars) {
  const grid = document.getElementById("car-grid");
  grid.innerHTML = "";
  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "car-card";
    div.innerHTML = `
      <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-image"/>
      <h3>${car.brand} ${car.model}</h3>
      <p>${car.description}</p>
      <p>Type: ${car.type}</p>
      <p>Fuel: ${car.fuelType}</p>
      <p>Year: ${car.year}</p>
      <p>Price/Day: $${car.pricePerDay}</p>
      <button onclick="reserve('${car.vin}')">Rent</button>
    `;
    grid.appendChild(div);
  });
}

function populateFilters(cars) {
  const brandSelect = document.getElementById("brand-select");
  const typeSelect = document.getElementById("type-select");

  const brands = [...new Set(cars.map(car => car.brand))];
  const types = [...new Set(cars.map(car => car.type))];

  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });

  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

function setupSuggestions(cars) {
  const input = document.querySelector("input[type='text']");
  const datalist = document.createElement("ul");
  datalist.setAttribute("id", "suggestions");
  datalist.style.position = "absolute";
  datalist.style.backgroundColor = "white";
  datalist.style.border = "1px solid #ccc";
  datalist.style.width = input.offsetWidth + "px";
  datalist.style.maxHeight = "160px";
  datalist.style.overflowY = "auto";
  datalist.style.padding = "0";
  datalist.style.margin = "0";
  datalist.style.zIndex = "999";

  input.parentNode.style.position = "relative";
  input.parentNode.appendChild(datalist);

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase().trim();
    datalist.innerHTML = "";

    if (value === "") return;

    const matches = cars.filter(car =>
      (car.brand + " " + car.model).toLowerCase().includes(value) ||
      car.description.toLowerCase().includes(value)
    );

    matches.forEach(car => {
      const item = document.createElement("li");
      item.textContent = `${car.brand} ${car.model}`;
      item.style.listStyle = "none";
      item.style.padding = "5px 10px";
      item.style.cursor = "pointer";
      item.addEventListener("click", () => {
        input.value = `${car.brand} ${car.model}`;
        datalist.innerHTML = "";
      });
      datalist.appendChild(item);
    });
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !datalist.contains(e.target)) {
      datalist.innerHTML = "";
    }
  });
}

function setupSearchHandlers(cars) {
  const input = document.querySelector("input[type='text']");
  const searchBtn = document.querySelector("button");
  const brandSelect = document.querySelectorAll("select")[0];
  const typeSelect = document.querySelectorAll("select")[1];

  searchBtn.addEventListener("click", () => {
    const query = input.value.toLowerCase();
    const selectedBrand = brandSelect.value;
    const selectedType = typeSelect.value;

    const filtered = cars.filter(car => {
      const composite = (car.brand + " " + car.model).toLowerCase().replace(/\s+/g, "");
      const cleanedQuery = query.toLowerCase().replace(/\s+/g, "");
      return (
        (cleanedQuery === "" || composite.includes(cleanedQuery) || car.description.toLowerCase().includes(query)) &&
        (selectedBrand === "" || car.brand === selectedBrand) &&
        (selectedType === "" || car.type === selectedType)
      );
    });

    const grid = document.getElementById("car-grid");
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = "<p style='text-align:center; font-size:18px; margin-top:20px;'>No cars found matching your search.</p>";
    } else {
      renderCars(filtered);
    }
  });
}

function reserve(vin) {
  const car = carData.find(c => c.vin === vin);
  sessionStorage.setItem("carData", JSON.stringify(carData));
  window.location.href = `reservation.html?vin=${vin}`;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/cars.json")
    .then(res => res.json())
    .then(data => {
      carData = data;
      renderCars(carData);
      populateFilters(carData);
      setupSuggestions(carData);
      setupSearchHandlers(carData);
    })
    .catch(error => {
      console.error("Error loading car data:", error);
    });
});
