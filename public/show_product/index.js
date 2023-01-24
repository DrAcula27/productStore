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
      console.log(parsedData);
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

          <p>
            <button id="buy-btn">Buy Now</button> 
            or 
            <button id="add-to-cart-btn">Add to Cart</button>
          </p>

          <button id="edit-btn">Edit this Product</button>

          <button id="delete-btn" title="this is permanent!">
            <i class="fa-solid fa-trash"></i> DELETE
          </button>
        `;

      productContainer.appendChild(divTag);
    });
  });
};
populateProductContainer();

// functionality to return to the home page
let homeBtn = document.getElementById("go-home-btn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// functionality to search for a product
let searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let userQuery = document.getElementById("user-query").value;
  let errorMsgDiv = document.getElementById("error-msg-container");

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
        errorMsgDiv.style.color = "red";
        errorMsgDiv.innerHTML =
          "<h2>That product is not in the database. Please search for another product.</h2>";
      }
    } catch (error) {}
  }
});
