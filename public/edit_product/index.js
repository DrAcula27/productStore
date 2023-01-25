// to dynamically update page title
let titleSpan = document.getElementById("product-name-title");
titleSpan.textContent = `product name`;

// functionality to update a product in the database
let submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", async () => {
  let nameString = document.getElementById("name-input").value;
  let categoryString = document.getElementById("category-select").value;
  let descriptionString = document.getElementById("description-input").value;
  let imageURLString = document.getElementById("url-input").value;
  let priceNumber = +document.getElementById("price-input").value;
  let inventoryNumber = +document.getElementById("inventory-input").value;
  let isInStockBoolean =
    document.getElementById("in-stock-input").value === "true" ? true : false;

  const product = {
    nameString,
    categoryString,
    descriptionString,
    imageURLString,
    priceNumber,
    inventoryNumber,
    isInStockBoolean,
  };

  let response = await fetch("http://localhost:5000/update_product", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  let uploadStatusTag = document.getElementById("upload-status");
  if (response.status === 200) {
    console.log(`${response.status} - Great Success!`);
    uploadStatusTag.classList.remove("hidden");
    uploadStatusTag.textContent = "Update Completed!";
    uploadStatusTag.style.color = "green";
  } else {
    console.log(response);
    uploadStatusTag.classList.remove("hidden");
    uploadStatusTag.textContent = "Update Failed :(";
    uploadStatusTag.style.color = "red";
  }
});

// functionality to return to the home page
let homeBtn = document.getElementById("go-home-btn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// functionality to search for a product using the search bar
let searchBtn = document.getElementById("search-btn");
let errorMsgDiv = document.getElementById("error-msg-container");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let userQuery = document.getElementById("user-query").value;

  if (userQuery === "") {
    errorMsgDiv.classList.remove("hidden");
    errorMsgDiv.style.color = "red";
    errorMsgDiv.innerHTML =
      "<h2>Please type the name of a product in the search bar before clicking the search button!</h2>";
  } else {
    let res = await fetch(`http://localhost:5000/search/${userQuery}`);
    let product = await res.json();
    let product_id = product[0]._id;
    try {
      if (product_id) {
        window.location.href = `../show_product?clickedProductId=${product_id}`;
      } else {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.style.color = "red";
        errorMsgDiv.innerHTML =
          "<h2>That product is not in the database. Please search for another product.</h2>";
      }
    } catch (error) {}
  }
});
// to re-hide the error message container when the user starts typing in the search bar
let searchBar = document.getElementById("user-query");
searchBar.addEventListener("keydown", () => {
  errorMsgDiv.classList.add("hidden");
});

// functionality to view shopping cart
