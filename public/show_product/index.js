// grab product id from url
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let productIdFromURL = params.clickedProductId;

// populate page with product data
let productContainer = document.getElementById("container");

let globalScopedData;

const populateProductContainer = async () => {
  let data = await fetch(
    `http://localhost:5000/get_specific_product/${productIdFromURL}`
  );

  data.json().then((parsedData) => {
    parsedData.forEach((object) => {
      globalScopedData = object;

      let divTag = document.createElement("div");
      divTag.classList.add("data-container");

      let objectTitle = document.createElement("h2");
      objectTitle.textContent = `${object.name}`;
      divTag.append(objectTitle);

      let objectImage = document.createElement("img");
      objectImage.src = `${object.imageURL}`;
      objectImage.alt = `${object.name}`;
      objectImage.title = `${object.name}`;
      divTag.append(objectImage);

      let objectCategory = document.createElement("p");
      objectCategory.textContent = `Category: ${object.category}`;
      divTag.append(objectCategory);

      let objectDescription = document.createElement("p");
      objectDescription.textContent = `${object.description}`;
      divTag.append(objectDescription);

      let objectPrice = document.createElement("p");
      objectPrice.textContent = `Price: $${object.price}`;
      divTag.append(objectPrice);

      let objectInventory = document.createElement("p");
      objectInventory.id = "inventory-p";
      let objectInventoryAmt = document.createElement("span");
      objectInventoryAmt.id = "inventory-span";
      objectInventoryAmt.textContent = `${object.inventory}`;
      objectInventory.append(objectInventoryAmt);
      objectInventory.append(" in stock");
      divTag.append(objectInventory);

      productContainer.prepend(divTag);
    });
  });
};
populateProductContainer();

// functionality to buy one of the product
setTimeout(() => {
  let buyBtn = document.getElementById("buy-btn");
  let inventoryP = document.getElementById("inventory-p");
  let inventorySpan = document.getElementById("inventory-span");

  // check if product is out of stock
  if (inventorySpan.innerText <= "0") {
    inventorySpan.innerText = "";
    inventoryP.innerText = "OUT OF STOCK";
    inventoryP.classList.add("out-of-stock");
    buyBtn.classList.add("hidden");
  } else {
    // add event listener to buy button
    buyBtn.addEventListener("click", async () => {
      let inventoryNumber = +inventorySpan.textContent - 1;
      let isInStockBoolean = globalScopedData.isInStock;

      if (inventoryNumber <= 0) {
        inventoryNumber = 0;
        isInStockBoolean = false;
      }

      let boughtOne = await fetch(`/buy_product/${productIdFromURL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryNumber,
          isInStockBoolean,
        }),
      });

      boughtOne.json().then((parsed) => {
        let newInventory = parsed.inventory;

        if (newInventory <= 0) {
          newInventory = 0;
          inventorySpan.textContent = "";
          inventoryP.textContent = "OUT OF STOCK";
          inventoryP.classList.add("out-of-stock");
          buyBtn.classList.add("hidden");
        } else {
          inventorySpan.textContent = `${newInventory}`;
          inventoryP.classList.remove("out-of-stock");
          buyBtn.classList.remove("hidden");
        }
      });
      // location.reload();
    });
  }
}, 500);

// functionality to return to the home page
let homeBtn = document.getElementById("go-home-btn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// functionality to search for a product using the search bar
let searchBtn = document.getElementById("search-btn");
let errorMsgH2 = document.getElementById("error-msg-container");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let userQuery = document.getElementById("user-query").value;

  if (userQuery === "") {
    errorMsgH2.classList.remove("hidden");
    errorMsgH2.style.color = "red";
    errorMsgH2.textContent =
      "Please type the name of a product in the search bar before clicking the search button!";
  } else {
    let res = await fetch(`http://localhost:5000/search/${userQuery}`);
    let product = await res.json();
    let product_id = product[0]._id;
    try {
      if (product_id) {
        window.location.href = `../show_product?clickedProductId=${product_id}`;
      } else {
        errorMsgH2.classList.remove("hidden");
        errorMsgH2.style.color = "red";
        errorMsgH2.textContent =
          "That product is not in the database. Please search for another product.";
      }
    } catch (error) {}
  }
});
// to re-hide the error message container when the user changes the input in the search bar
let searchBar = document.getElementById("user-query");
searchBar.addEventListener("input", () => {
  errorMsgH2.classList.add("hidden");
});

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
