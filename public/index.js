// populate the grid with all the items currently in the database
let productGrid = document.getElementById("product-grid");

const populateGrid = async () => {
  let data = await fetch("http://localhost:5000/get_products");

  data.json().then((parsedData) => {
    parsedData.forEach((object) => {
      let divTag = document.createElement("div");

      divTag.innerHTML = `<img src="${object.imageURL}" alt="${object.name}" title="${object.name}" />`;
      divTag.classList.add("grid-item");

      productGrid.appendChild(divTag);
    });
  });
};
populateGrid();

// functionality to move to the create a product page
let createProductBtn = document.getElementById("create-product-btn");

createProductBtn.addEventListener("click", () => {
  window.location.href = "./create_products";
});

// functionality to search for a product
let searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let userQuery = document.getElementById("user-query").value;
  window.location.href = `./get_specific_product/${userQuery}`;
});

// functionality to move to a specific product's page when its grid item is clicked
let productGridItem = document.getElementsByClassName("grid-item");

// functionality to view shopping cart
let shoppingCartBtn = document.getElementById("shopping-cart-btn");

shoppingCartBtn.addEventListener("click", () => {
  window.location.href = "./view_shopping_cart";
});
