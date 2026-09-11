```javascript
// ===============================
// ShopNest - script.js
// ===============================


// ---------- Global Variables ----------

let products = [];

let cart = [];

let selectedCategory = "All";


// ---------- DOM Elements ----------

const productContainer =
    document.getElementById("productContainer");

const searchInput =
    document.getElementById("searchInput");

const cartContainer =
    document.getElementById("cartContainer");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const noProducts =
    document.getElementById("noProducts");

const categoryButtons =
    document.querySelectorAll(".category-btn");


// ===============================
// 1. FETCH PRODUCTS
// ===============================

async function loadProducts() {

    try {

        const response =
            await fetch("products.json");

        products =
            await response.json();

        renderProducts();

        loadCart();

    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

    }

}


// ===============================
// 2. RENDER PRODUCTS
// ===============================

function renderProducts() {

    productContainer.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase();


    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;


            return matchesSearch &&
                   matchesCategory;

        });


    if (filteredProducts.length === 0) {

        noProducts.classList.remove("hidden");

    } else {

        noProducts.classList.add("hidden");

    }


    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <img
                src="${product.imageUrl}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p>
                Category:
                ${product.category}
            </p>

            <p>
                ⭐ ${product.rating}
            </p>

            <p>

                <strong>
                    ₹${product.price}
                </strong>

                <del>
                    ₹${product.originalPrice}
                </del>

            </p>

            <button
                class="add-cart-btn"
                data-id="${product.id}"
            >
                Add to Cart
            </button>

        `;


        productContainer.appendChild(card);

    });

}


// ===============================
// 3. LIVE SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    () => {

        renderProducts();

    }
);


// ===============================
// 4. CATEGORY FILTER
// ===============================

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedCategory =
                button.dataset.category;


            categoryButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            renderProducts();

        }
    );

});


// ===============================
// 5. ADD TO CART
// ===============================

productContainer.addEventListener(
    "click",
    event => {

        if (
            !event.target.classList
                .contains("add-cart-btn")
        ) {

            return;

        }


        const productId =
            Number(
                event.target.dataset.id
            );


        addToCart(productId);

    }
);


function addToCart(productId) {

    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: productId,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

}


// ===============================
// 6. RENDER CART
// ===============================

function renderCart() {

    cartContainer.innerHTML = "";

    let total = 0;

    let itemCount = 0;


    cart.forEach(cartItem => {

        const product =
            products.find(
                product =>
                    product.id === cartItem.id
            );


        if (!product) {

            return;

        }


        const itemTotal =
            product.price *
            cartItem.quantity;


        total += itemTotal;


        itemCount +=
            cartItem.quantity;


        const cartElement =
            document.createElement("div");


        cartElement.className =
            "cart-item";


        cartElement.innerHTML = `

            <h3>
                ${product.name}
            </h3>

            <p>
                Price:
                ₹${product.price}
            </p>

            <button
                class="decrease-btn"
                data-id="${product.id}"
            >
                -
            </button>

            <span>
                ${cartItem.quantity}
            </span>

            <button
                class="increase-btn"
                data-id="${product.id}"
            >
                +
            </button>

            <button
                class="remove-btn"
                data-id="${product.id}"
            >
                Remove
            </button>

            <p>
                Item Total:
                ₹${itemTotal}
            </p>

        `;


        cartContainer.appendChild(
            cartElement
        );

    });


    cartTotal.textContent =
        total;


    cartCount.textContent =
        itemCount;

}


// ===============================
// 7. PLUS / MINUS / REMOVE
// ===============================

cartContainer.addEventListener(
    "click",
    event => {

        const productId =
            Number(
                event.target.dataset.id
            );


        if (
            event.target.classList
                .contains("increase-btn")
        ) {

            changeQuantity(
                productId,
                1
            );

        }


        if (
            event.target.classList
                .contains("decrease-btn")
        ) {

            changeQuantity(
                productId,
                -1
            );

        }


        if (
            event.target.classList
                .contains("remove-btn")
        ) {

            removeFromCart(
                productId
            );

        }

    }
);


// ===============================
// 8. CHANGE QUANTITY
// ===============================

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) {

        return;

    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveCart();

    renderCart();

}


// ===============================
// 9. REMOVE FROM CART
// ===============================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    renderCart();

}


// ===============================
// 10. SAVE CART
// ===============================

function saveCart() {

    localStorage.setItem(
        "shopNestCart",
        JSON.stringify(cart)
    );

}


// ===============================
// 11. LOAD CART
// ===============================

function loadCart() {

    const savedCart =
        localStorage.getItem(
            "shopNestCart"
        );


    if (savedCart) {

        cart =
            JSON.parse(savedCart);

    }


    renderCart();

}


// ===============================
// 12. START APPLICATION
// ===============================

loadProducts();
```
