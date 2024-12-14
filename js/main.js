window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.log('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + error);
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document ready, creating app...');
    window.app = new MovieApp();
});

class MovieApp {
    constructor() {
        this.api = movieAPI;
        this.moviesGrid = document.getElementById('moviesGrid');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        
        // Start loading immediately
        this.init();
    }

    async init() {
        try {
            console.log('Initializing MovieApp...');
            await this.loadMovies();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize app');
        }
    }

    async loadMovies() {
        try {
            this.showLoading();
            console.log('Loading movies...');

            const data = await this.api.getTrending();
            console.log('Movies data:', data);

            if (data.results && data.results.length > 0) {
                this.renderMovies(data.results);
            } else {
                throw new Error('No movies found');
            }
        } catch (error) {
            console.error('Error loading movies:', error);
            this.showError('Failed to load movies');
        } finally {
            this.hideLoading();
        }
    }

    renderMovies(movies) {
        if (!this.moviesGrid) {
            console.error('Movies grid not found');
            return;
        }

        console.log('Rendering movies:', movies.length);

        this.moviesGrid.innerHTML = movies.map(movie => `
            <div class="movie-card">
                <img src="${this.api.getImageUrl(movie.poster_path)}" 
                     alt="${movie.title}"
                     class="movie-poster"
                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${movie.vote_average.toFixed(1)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

