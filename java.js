// Function to format price as number
function parsePrice(priceString) {
  // Remove '+' and any other non-numeric characters except decimal point
  return parseFloat(priceString.replace(/[^\d.-]/g, ''));
}

// Function to save cart data to localStorage
function saveCartData() {
  const cartItems = document.querySelectorAll('.cart-swap-item');
  const cartData = Array.from(cartItems).map(item => {
    return {
      name: item.querySelector('.item-info span').textContent,
      price: parsePrice(item.querySelector('.price').getAttribute('data-base-price')),
      quantity: parseInt(item.querySelector('.item-info p').textContent.replace('x', '')),
      image: item.querySelector('.item-info img').src
    };
  });
  
  localStorage.setItem('cartItems', JSON.stringify(cartData));
}

// Function to create cart item with specific quantity
function createCartItem(itemName, basePrice, itemImage, quantity) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-swap-item');
  
  // Calculate total price for the current quantity
  const totalPrice = (basePrice * quantity).toFixed(2);
  
  cartItem.innerHTML = `
    <div class="item-info">
      <img src="${itemImage}" alt="${itemName}">
      <span>${itemName}</span>
      <p>x${quantity}</p>
    </div>
    <span class="price" data-base-price="${basePrice}">+${totalPrice}</span>
    <button class="remove-btn">X</button>
  `;
  
  // Add click event listener to the remove button
  const removeBtn = cartItem.querySelector('.remove-btn');
  removeBtn.addEventListener('click', function() {
    cartItem.remove();
    updateTotalCredits();
    saveCartData();
  });
  
  return cartItem;
}

// Function to load cart data from localStorage
function loadCartData() {
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    const cartData = JSON.parse(savedCart);
    const cartSwapSection = document.querySelector('.cart-swap-section');
    
    // Clear existing cart items
    cartSwapSection.innerHTML = '';
    
    // Add each item with its saved quantity
    cartData.forEach(item => {
      const cartItem = createCartItem(
        item.name,
        parseFloat(item.price),
        item.image,
        parseInt(item.quantity)
      );
      cartSwapSection.appendChild(cartItem);
    });
    
    // Update total after loading all items
    updateTotalCredits();
  }
}

// Function to find existing cart item
function findExistingCartItem(itemName) {
  const cartItems = document.querySelectorAll('.cart-swap-item');
  return Array.from(cartItems).find(item => {
    const itemNameInCart = item.querySelector('.item-info span').textContent;
    return itemNameInCart === itemName;
  });
}

// Function to update quantity and price of existing item
function updateCartItemQuantity(cartItem) {
  const quantityElement = cartItem.querySelector('.item-info p');
  const priceElement = cartItem.querySelector('.price');
  const basePrice = parseFloat(priceElement.getAttribute('data-base-price'));
  
  // Get current quantity and increment it
  const currentQuantity = parseInt(quantityElement.textContent.replace('x', ''));
  const newQuantity = currentQuantity + 1;
  
  // Update quantity display
  quantityElement.textContent = `x${newQuantity}`;
  
  // Calculate new total price using the base price and new quantity
  const newTotalPrice = (basePrice * newQuantity).toFixed(2);
  
  // Update price display while preserving the base price attribute
  priceElement.textContent = `+${newTotalPrice}`;
  
  // Save updated cart data
  saveCartData();
  
  return newQuantity;
}

// Function to add an item to the cart-swap-section
function addToCart(itemName, itemPrice, itemImage) {
  const existingItem = findExistingCartItem(itemName);
  
  if (existingItem) {
    // Update quantity if item already exists
    updateCartItemQuantity(existingItem);
  } else {
    // Create new cart item if it doesn't exist
    const cartSwapSection = document.querySelector('.cart-swap-section');
    // Ensure we get a clean number for the base price
    const basePrice = parsePrice(itemPrice);
    const cartItem = createCartItem(itemName, basePrice, itemImage, 1);
    cartSwapSection.appendChild(cartItem);
  }
  
  updateTotalCredits();
  saveCartData();
}

// Function to calculate and update total swap credits
function updateTotalCredits() {
  const SERVICE_FEE = 1.00;
  let total = SERVICE_FEE;
  
  const cartItems = document.querySelectorAll('.cart-swap-item');
  cartItems.forEach(item => {
    const price = parsePrice(item.querySelector('.price').textContent);
    total += price;
  });
  
  const totalElement = document.querySelector('.total-credits h2');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
}

// Add event listeners to all add buttons
document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    
    const itemContainer = this.closest('.swap-item');
    const itemName = itemContainer.querySelector('h4').textContent;
    const itemPrice = itemContainer.querySelector('.price').textContent;
    const itemImage = itemContainer.querySelector('img').src;
    
    addToCart(itemName, itemPrice, itemImage);
  });
});

// Initialize cart functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load saved cart data
  loadCartData();
});