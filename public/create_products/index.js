// functionality to add a product to the database
let submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", async () => {
  let nameString = document.getElementById("name-input").value;
  let descriptionString = document.getElementById("description-input").value;
  let imageURLString = document.getElementById("url-input").value;
  let priceNumber = +document.getElementById("price-input").value;
  let inventoryNumber = +document.getElementById("inventory-input").value;
  let isInStockBoolean =
    document.getElementById("in-stock-input").value === "true" ? true : false;

  const product = {
    nameString,
    descriptionString,
    imageURLString,
    priceNumber,
    inventoryNumber,
    isInStockBoolean,
  };

  let response = await fetch("http://localhost:5000/create_product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  let uploadStatusTag = document.getElementById("upload-status");
  if (response.status === 200) {
    console.log(`${response.status} - Great Success!`);
    uploadStatusTag.classList.remove("hidden");
    uploadStatusTag.textContent = "Upload Completed!";
    uploadStatusTag.style.color = "green";
  } else {
    console.log(response);
    uploadStatusTag.classList.remove("hidden");
    uploadStatusTag.textContent = "Upload Failed :(";
    uploadStatusTag.style.color = "red";
  }
});

// functionality to return to the home page
let homeBtn = document.getElementById("go-home-btn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// functionality to view the cart
