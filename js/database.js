class Database {
    constructor() {
        this.artworks = [];
        this.collections = [];
        this.cart = [];
    }

    // Add new artwork
    addArtwork(artwork) {
        const newArtwork = {
            id: Date.now(),
            timestamp: new Date(),
            ...artwork
        };
        this.artworks.push(newArtwork);
        this.saveToLocalStorage();
        return newArtwork;
    }

    // Get all artworks
    getArtworks(category = 'all') {
        if (category === 'all') return this.artworks;
        return this.artworks.filter(art => art.category === category);
    }

    // Save to localStorage
    saveToLocalStorage() {
        localStorage.setItem('aiVaultArtworks', JSON.stringify(this.artworks));
        localStorage.setItem('aiVaultCollections', JSON.stringify(this.collections));
    }

    // Load from localStorage
    loadFromLocalStorage() {
        const artworks = localStorage.getItem('aiVaultArtworks');
        const collections = localStorage.getItem('aiVaultCollections');
        
        if (artworks) this.artworks = JSON.parse(artworks);
        if (collections) this.collections = JSON.parse(collections);
    }
} 