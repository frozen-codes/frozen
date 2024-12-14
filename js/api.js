class MovieAPI {
    constructor() {
        this.API_KEY = CONFIG.API_KEY;
        this.BASE_URL = 'https://api.themoviedb.org/3';
        this.IMAGE_BASE = 'https://image.tmdb.org/t/p';
    }

    async fetchData(endpoint, params = {}) {
        const url = `${this.BASE_URL}${endpoint}?api_key=${this.API_KEY}&${new URLSearchParams(params)}`;
        console.log('Fetching:', url); // Debug log

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getTrending() {
        return this.fetchData('/trending/movie/day');
    }

    getImageUrl(path) {
        if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
        return `${this.IMAGE_BASE}/w500${path}`;
    }
}

// Create and test API instance
const movieAPI = new MovieAPI();
console.log('MovieAPI initialized with key:', CONFIG.API_KEY); // Debug log 