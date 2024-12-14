class UI {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.collectionsGrid = document.querySelector('.collections-grid');
        this.cartModal = document.getElementById('cart-modal');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleFilter(button.dataset.category);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
    }

    handleFilter(category) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = Array.from(this.filterButtons)
            .find(btn => btn.dataset.category === category);
        activeButton?.classList.add('active');

        this.filterGallery(category);
    }

    filterGallery(category) {
        const artworks = db.getArtworks(category);
        this.renderGallery(artworks);
    }

    renderGallery(artworks) {
        if (!this.galleryGrid) return;

        this.galleryGrid.innerHTML = artworks.map(artwork => `
            <div class="art-card hover-scale" data-id="${artwork.id}">
                <div class="art-image-container">
                    <img src="${artwork.image}" alt="${artwork.title}" loading="lazy">
                </div>
                <div class="art-info">
                    <span class="art-category">${artwork.category}</span>
                    <h3 class="art-title">${artwork.title}</h3>
                    <p class="art-price">${CONFIG.CART.currency}${artwork.price}</p>
                    <button class="buy-btn" onclick="cart.addItem(${artwork.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks?.classList.toggle('active');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
} 