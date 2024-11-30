class AdvancedCartManager {
    constructor() {
        // Initialize cart from local storage or as an empty array
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartCountElement = document.querySelector('.cart-swap-section');
        this.couponCode = null;
        this.discounts = {
            'SWAP20': { type: 'percentage', value: 20 },
            'FIRST10': { type: 'fixed', value: 10 }
        };

        this.updateCartDisplay();
        this.attachEventListeners();
    }

    // Add item to cart with advanced checks
    addToCart(item) {
        // Validate item input
        if (!this.validateItem(item)) {
            this.showNotification('Invalid item details', 'error');
            return false;
        }

        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(cartItem => 
            cartItem.name === item.name && cartItem.description === item.description
        );

        if (existingItemIndex !== -1) {
            // Increment quantity if max limit not reached
            if (this.cart[existingItemIndex].quantity < 5) {
                this.cart[existingItemIndex].quantity += 1;
            } else {
                this.showNotification('Maximum quantity reached for this item', 'warning');
                return false;
            }
        } else {
            // Add new item
            this.cart.push({
                id: this.generateUniqueId(),
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                image: item.image,
                quantity: 1,
                category: item.category || 'Unknown'
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`Added ${item.name} to cart`, 'success');
        return true;
    }

    // Remove item from cart
    removeFromCart(itemId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== itemId);
        
        if (this.cart.length < initialLength) {
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Item removed from cart', 'info');
        }
    }

    // Update cart quantity with validation
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            // Validate quantity
            if (quantity > 0 && quantity <= 5) {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
                this.showNotification('Quantity updated', 'success');
            } else {
                this.showNotification('Invalid quantity. Must be between 1-5', 'error');
            }
        }
    }

    // Apply coupon code
    applyCoupon(code) {
        const coupon = this.discounts[code.toUpperCase()];
        
        if (coupon) {
            this.couponCode = code.toUpperCase();
            this.showNotification(`Coupon ${code} applied successfully`, 'success');
            this.updateCartDisplay();
            return true;
        } else {
            this.showNotification('Invalid coupon code', 'error');
            return false;
        }
    }

    // Calculate total with advanced pricing logic
    calculateTotal() {
        const serviceFee = 1.00;
        let subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        let total = subtotal + serviceFee;

        // Apply coupon if exists
        if (this.couponCode) {
            const coupon = this.discounts[this.couponCode];
            if (coupon.type === 'percentage') {
                total -= (subtotal * (coupon.value / 100));
            } else if (coupon.type === 'fixed') {
                total -= Math.min(coupon.value, subtotal);
            }
        }

        return {
            subtotal: subtotal,
            serviceFee: serviceFee,
            total: Math.max(total, 0),
            savings: this.couponCode ? this.calculateSavings() : 0
        };
    }

    // Calculate savings from coupon
    calculateSavings() {
        if (!this.couponCode) return 0;
        
        const coupon = this.discounts[this.couponCode];
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (coupon.type === 'percentage') {
            return subtotal * (coupon.value / 100);
        } else if (coupon.type === 'fixed') {
            return Math.min(coupon.value, subtotal);
        }
        
        return 0;
    }

    // Update cart display in the right section
    updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-swap-section');
        const totalCreditsElement = document.querySelector('.total-credits h2');
        const couponBtn = document.querySelector('.coupon-btn');
        
        // Clear existing cart items
        const existingItems = cartContainer.querySelectorAll('.cart-swap-item');
        existingItems.forEach(item => item.remove());

        // Calculate totals
        const pricing = this.calculateTotal();

        // Add cart items
        this.cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-swap-item');
            cartItemDiv.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                    <p>x${item.quantity}</p>
                </div>
                <span class="price">+${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;

            cartContainer.querySelector('h4').after(cartItemDiv);

            // Attach remove item event
            const removeButton = cartItemDiv.querySelector('.remove-item');
            removeButton.addEventListener('click', () => {
                this.removeFromCart(item.id);
            });
        });

        // Update total credits and coupon button
        totalCreditsElement.textContent = pricing.total.toFixed(2);
        
        if (this.couponCode) {
            couponBtn.textContent = `Coupon: ${this.couponCode} (Saved $${pricing.savings.toFixed(2)})`;
        }
    }

    // Validate item before adding to cart
    validateItem(item) {
        return item && 
               item.name && 
               item.description && 
               !isNaN(parseFloat(item.price)) && 
               item.image;
    }

    // Generate unique ID for items
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Show advanced notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        const typeStyles = {
            'success': { backgroundColor: '#4CAF50', color: 'white' },
            'error': { backgroundColor: '#F44336', color: 'white' },
            'warning': { backgroundColor: '#FF9800', color: 'white' },
            'info': { backgroundColor: '#FFB800', color: 'white' }
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${typeStyles[type].backgroundColor};
            color: ${typeStyles[type].color};
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds with fade out
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Attach event listeners to all add buttons
    attachEventListeners() {
        const addButtons = document.querySelectorAll('.add-button');
        const couponBtn = document.querySelector('.coupon-btn');

        addButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const swapItem = event.target.closest('.swap-item');
                const item = {
                    name: swapItem.querySelector('.swap-details h4').textContent,
                    description: swapItem.querySelector('.swap-details p').textContent,
                    price: swapItem.querySelector('.price').textContent.replace('+', ''),
                    image: swapItem.querySelector('img').src,
                    category: this.getCategoryFromItem(swapItem)
                };
                this.addToCart(item);
            });
        });

        // Coupon application
        if (couponBtn) {
            couponBtn.addEventListener('click', () => {
                const code = prompt('Enter your coupon code:');
                if (code) {
                    this.applyCoupon(code);
                }
            });
        }
    }

    // Helper method to get category
    getCategoryFromItem(swapItem) {
        // Attempt to find category from nearby elements or context
        const categoryElement = swapItem.closest('.swaps-section')?.querySelector('h3');
        return categoryElement ? categoryElement.textContent.replace('Popular Swaps', '').trim() : 'Unknown';
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.couponCode = null;
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Cart has been cleared', 'info');
    }

    // Save cart to local storage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}

// Initialize advanced cart manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.advancedCartManager = new AdvancedCartManager();
});

// //'SWAP20': 20% off total
// 'FIRST10': $10 off total//