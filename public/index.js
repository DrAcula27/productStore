// populate the grid with all the items currently in the database
let productGrid = document.getElementById("product-grid");

const populateGrid = async () => {
  let data = await fetch("http://localhost:5000/get_products");

  data.json().then((parsedData) => {
    parsedData.forEach((object) => {
      let divTag = document.createElement("div");

      divTag.databaseId = object._id;

      divTag.innerHTML = `
        <img
          src="${object.imageURL}"
          alt="${object.name}"
          title="Click to view: ${object.name}"
        />
      `;
      divTag.classList.add("grid-item");

      // functionality to move to a specific product's page when its grid item is clicked
      divTag.addEventListener("click", () => {
        window.location.href = `./show_product?clickedProductId=${divTag.databaseId}`;
      });

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
        window.location.href = `./show_product?clickedProductId=${product_id}`;
      } else {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.style.color = "red";
        errorMsgDiv.innerHTML =
          "<h2>That product is not in the database. Please search for another product.</h2>";
      }
    } catch (error) {}
  }
});
// to re-hide the error message container when the user changes the input in the search bar
let searchBar = document.getElementById("user-query");
searchBar.addEventListener("input", () => {
  errorMsgDiv.classList.add("hidden");
});
