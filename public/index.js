// functionality to move to the create an product page
let createProductBtn = document.getElementById("create-product-btn");

createProductBtn.addEventListener("click", () => {
  window.location.href = "./create_products";
});

// functionality to move to the display all products page
let showProductsBtn = document.getElementById("show-products-btn");

showProductsBtn.addEventListener("click", () => {
  window.location.href = "./display_products";
});

// functionality to search for a product
let searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let showProductArea = document.getElementById("show-product-area");
  let userQuery = document.getElementById("user-query").value;
  if (userQuery === "") {
    showProductArea.classList.remove("hidden");
    showProductArea.style.color = "red";
    showProductArea.innerHTML =
      "<h2>Please type the name of a product in the search bar before clicking the search button!</h2>";
  } else {
    let res = await fetch(`http://localhost:5000/get_specific_product/${userQuery}`);
    let product = await res.json();
    try {
      showProductArea.classList.remove("hidden");
      showProductArea.style.color = "#003057";
      showProductArea.innerHTML = `
        <table>
          <tr>
            <td>Name:</td>
            <td>${product[0].name}</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>${product[0].description}</td>
          </tr>
          <tr>
            <td>Image:</td>
            <td><img src="${product[0].imageURL}" alt="a girl doll in a pink dress"></td>
          </tr>
          <tr>
            <td>Price:</td>
            <td>${product[0].price}</td>
          </tr>
          <tr>
            <td>Inventory:</td>
            <td>${product[0].inventory}</td>
          </tr>
          <tr>
            <td>In Stock?</td>
            <td>${product[0].isInStock}</td>
          </tr>
        </table>
        `;
    } catch (error) {
      showProductArea.style.color = "red";
      showProductArea.innerHTML =
        "<h2>That product is not in the database. Please search for another product.</h2>";
    }
  }
});
