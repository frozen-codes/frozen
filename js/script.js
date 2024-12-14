const API_KEY = 'b7c613791d9030103a0d89f604532a7a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const MOVIES_PER_PAGE = 30;
let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedMovie();
    loadTrendingMovies(currentPage);
});

async function loadFeaturedMovie() {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}`
        );
        const data = await response.json();
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        
        document.querySelector('.featured-section').style.backgroundImage = 
            `url(${IMAGE_BASE_URL}original${randomMovie.backdrop_path})`;
        document.getElementById('featured-title').textContent = randomMovie.title;
        document.getElementById('featured-overview').textContent = randomMovie.overview;
    } catch (error) {
        console.error('Error loading featured movie:', error);
    }
}

async function loadTrendingMovies(page = 1) {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
        );
        const data = await response.json();
        totalPages = data.total_pages;
        
        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = '';

        data.results.forEach(movie => {
            const movieCard = createMovieCard(movie);
            movieContainer.appendChild(movieCard);
        });

        createPagination(page, totalPages);
    } catch (error) {
        console.error('Error loading trending movies:', error);
    }
}

function createMovieCard(movie) {
    const div = document.createElement('div');
    div.className = 'movie-card';
    
    div.innerHTML = `
        <img src="${IMAGE_BASE_URL}w500${movie.poster_path}" 
             alt="${movie.title}">
        <div class="movie-info">
            <h4 title="${movie.title}">${movie.title}</h4>
            <div class="rating">
                <i class="fas fa-star"></i>
                <span>${movie.vote_average.toFixed(1)}</span>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => {
        window.open(`movie.html?id=${movie.id}`, '_blank');
    });
    
    return div;
}

function createPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
        const prevButton = createPageButton('Previous', currentPage - 1);
        prevButton.classList.add('pagination-prev');
        paginationContainer.appendChild(prevButton);
    }

    // First page
    if (startPage > 1) {
        paginationContainer.appendChild(createPageButton('1', 1));
        if (startPage > 2) {
            paginationContainer.appendChild(createEllipsis());
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPageButton(i.toString(), i);
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationContainer.appendChild(pageButton);
    }

    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationContainer.appendChild(createEllipsis());
        }
        paginationContainer.appendChild(createPageButton(totalPages.toString(), totalPages));
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = createPageButton('Next', currentPage + 1);
        nextButton.classList.add('pagination-next');
        paginationContainer.appendChild(nextButton);
    }
}

function createPageButton(text, pageNumber) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('pagination-button');
    button.addEventListener('click', () => {
        currentPage = pageNumber;
        loadTrendingMovies(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return button;
}

function createEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.classList.add('pagination-ellipsis');
    return span;
}

// Search functionality
const searchInput = document.getElementById('search');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    currentPage = 1; // Reset to first page on new search
    searchTimeout = setTimeout(() => {
        searchMovies(e.target.value, currentPage);
    }, 500);
});

async function searchMovies(query, page = 1) {
    if (!query) {
        loadTrendingMovies(page);
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
        );
        const data = await response.json();
        
        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = '';

        data.results.forEach(movie => {
            if (movie.poster_path) {
                const movieCard = createMovieCard(movie);
                movieContainer.appendChild(movieCard);
            }
        });

        createPagination(page, data.total_pages);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
} 