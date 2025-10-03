let cart = [];

const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const emptyCart = document.getElementById('empty-cart');
const totalPriceElement = document.getElementById('total-price');

function openCart() {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCartSidebar() {
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function calculateTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function renderCart() {
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartItemsContainer.style.display = 'none';
    cartItemsContainer.innerHTML = '';
  } else {
    emptyCart.style.display = 'none';
    cartItemsContainer.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
          <button class="cart-item-remove" data-index="${index}">Remove</button>
        </div>
      </div>
    `).join('');

    const removeButtons = cartItemsContainer.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        removeFromCart(index);
      });
    });
  }

  updateCartCount();
  calculateTotal();
}

function addToCart(product) {
  const existingItem = cart.find(item => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  renderCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

const addToCartButtons = document.querySelectorAll('.btn-secondary');
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPriceText = productCard.querySelector('.product-price').textContent;
    const productPrice = parseFloat(productPriceText.replace('$', ''));
    const productImage = productCard.querySelector('.product-image img').src;

    const product = {
      name: productName,
      price: productPrice,
      image: productImage
    };

    addToCart(product);
  });
});

renderCart();