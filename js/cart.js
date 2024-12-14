class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.count = 0;
        this.loadCart();
        this.updateUI();
    }

    addItem(artworkId) {
        const artwork = db.artworks.find(art => art.id === artworkId);
        if (!artwork) return;

        const cartItem = {
            id: artwork.id,
            title: artwork.title,
            price: artwork.price,
            quantity: 1
        };

        const existingItem = this.items.find(item => item.id === artworkId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(cartItem);
        }

        this.updateCart();
        ui.showNotification('Item added to cart');
    }

    removeItem(artworkId) {
        this.items = this.items.filter(item => item.id !== artworkId);
        this.updateCart();
    }

    updateQuantity(artworkId, quantity) {
        const item = this.items.find(item => item.id === artworkId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(artworkId);
            }
        }
        this.updateCart();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0);
        this.count = this.items.reduce((sum, item) => 
            sum + item.quantity, 0);
    }

    updateCart() {
        this.calculateTotal();
        this.saveCart();
        this.updateUI();
    }

    updateUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.count;
        }

        const cartModal = document.getElementById('cart-modal');
        if (cartModal && cartModal.classList.contains('active')) {
            this.renderCartModal();
        }
    }

    renderCartModal() {
        const cartModal = document.getElementById('cart-modal');
        if (!cartModal) return;

        cartModal.innerHTML = `
            <div class="cart-content">
                <h2>Shopping Cart</h2>
                ${this.items.map(item => `
                    <div class="cart-item">
                        <h3>${item.title}</h3>
                        <div class="quantity-controls">
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <p>${CONFIG.CART.currency}${item.price * item.quantity}</p>
                        <button onclick="cart.removeItem(${item.id})">Remove</button>
                    </div>
                `).join('')}
                <div class="cart-total">
                    <h3>Total: ${CONFIG.CART.currency}${this.total}</h3>
                    <button onclick="cart.checkout()" class="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total,
            count: this.count
        }));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const { items, total, count } = JSON.parse(savedCart);
            this.items = items;
            this.total = total;
            this.count = count;
        }
    }

    checkout() {
        // Implement checkout logic here
        console.log('Proceeding to checkout...');
    }
} 