// populate page with product data
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let productIdFromURL = params.clickedProductId;

let productContainer = document.getElementById("container");

const populateProductContainer = async () => {
  let data = await fetch(
    `http://localhost:5000/get_specific_product/${productIdFromURL}`
  );

  data.json().then((parsedData) => {
    parsedData.forEach((object) => {
      let divTag = document.createElement("div");
      divTag.classList.add("data-container");

      divTag.innerHTML = `
          <h2>${object.name}</h2>

          <img
            src="${object.imageURL}"
            alt="${object.name}"
            title="${object.name}"
          />
          
          <p>Category: ${object.category}</p>

          <p>${object.description}</p>

          <p>Price: $${object.price}</p>

          <p>${object.inventory} in stock</p>
        `;

      productContainer.prepend(divTag);
    });
  });
};
populateProductContainer();

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
// to re-hide the error message container when the user changes the input in the search bar
let searchBar = document.getElementById("user-query");
searchBar.addEventListener("input", () => {
  errorMsgDiv.classList.add("hidden");
});

// functionality to view shopping cart

// functionality to buy one of the product

// functionality to add one of the product to the user's cart

// functionality to move to the update product page
let editBtn = document.getElementById("edit-btn");

editBtn.addEventListener("click", () => {
  window.location.href = `../edit_product?clickedProductId=${productIdFromURL}`;
});

// functionality to delete the product from the database
let deleteBtn = document.getElementById("delete-btn");

deleteBtn.addEventListener("click", async () => {
  let response = await fetch(
    `http://localhost:5000/delete_product?idOfProduct=${productIdFromURL}`,
    {
      method: "delete",
    }
  );
  window.location.href = "../index.html";
  console.log(response);
});
