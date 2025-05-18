
const data = JSON.parse(sessionStorage.getItem("reservationDetails") || "{}");
const carData = JSON.parse(sessionStorage.getItem("carData") || "[]");

const container = document.getElementById("confirmation-details");

if (Object.keys(data).length > 0) {
  container.innerHTML = `
    <h2>Thank you for your reservation!</h2>
    <p><strong>Name:</strong> ${data["Name"]}</p>
    <p><strong>Phone:</strong> ${data["Phone"]}</p>
    <p><strong>Email:</strong> ${data["Email"]}</p>
    <p><strong>License #:</strong> ${data["License #"]}</p>
    <p><strong>Start Date:</strong> ${data["Start Date"]}</p>
    <p><strong>Rental Days:</strong> ${data["Rental Days"]}</p>
    <p><strong>VIN:</strong> ${data.vin}</p>
    <p><strong>Status:</strong> <span id="order-status">pending</span></p>
    <button id="confirm-btn">Click here to confirm your order</button>
    <br><br>
    <button id="home-btn">Return to Home</button>
  `;

  document.getElementById("confirm-btn").onclick = () => {
    document.getElementById("order-status").textContent = "confirmed";

    const index = carData.findIndex(c => c.vin === data.vin);
    if (index !== -1) {
      carData[index].available = false;
      sessionStorage.setItem("carData", JSON.stringify(carData));
    }

    document.getElementById("confirm-btn").disabled = true;
    document.getElementById("confirm-btn").textContent = "Order Confirmed";
  };

  document.getElementById("home-btn").onclick = () => {
    window.location.href = "index.html";
  };
}
