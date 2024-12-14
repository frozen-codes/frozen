const API_KEY = 'b7c613791d9030103a0d89f604532a7a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (movieId) {
        loadMovieDetails(movieId);
        loadMovieCast(movieId);
        setupWatchButton(movieId);
    } else {
        window.location.href = 'index.html';
    }
});

async function loadMovieDetails(movieId) {
    try {
        const [movieResponse, watchProvidersResponse] = await Promise.all([
            fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`),
            fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`)
        ]);
        
        const movie = await movieResponse.json();
        const watchProviders = await watchProvidersResponse.json();
        
        // Set page title
        document.title = `${movie.title} - ReelQuest`;
        
        // Update backdrop
        if (movie.backdrop_path) {
            document.querySelector('.movie-backdrop').style.backgroundImage = 
                `url(${IMAGE_BASE_URL}original${movie.backdrop_path})`;
        }
        
        // Update poster
        if (movie.poster_path) {
            document.getElementById('movie-poster').src = 
                `${IMAGE_BASE_URL}w500${movie.poster_path}`;
            document.getElementById('movie-poster').alt = movie.title;
        }
        
        // Add streaming links section
        const streamingLinksHtml = createStreamingLinksHtml(watchProviders.results);
        
        // Update movie details including streaming options
        document.querySelector('.movie-info-detailed').innerHTML = `
            <h1 id="movie-title">${movie.title}</h1>
            <div class="movie-meta">
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span id="movie-rating">${movie.vote_average.toFixed(1)}</span>
                </div>
                <span>${new Date(movie.release_date).toLocaleDateString()}</span>
                <span>${movie.runtime ? `${movie.runtime} minutes` : 'Runtime not available'}</span>
            </div>
            <div id="movie-genres" class="genres">
                ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <p>${movie.overview || 'No overview available'}</p>
            </div>
            ${streamingLinksHtml}
            <button class="watch-btn trailer-btn">
                <i class="fas fa-play"></i> Watch Trailer
            </button>
            <div class="cast-section">
                <h3>Cast</h3>
                <div class="cast-container" id="movie-cast"></div>
            </div>
        `;

        // Setup trailer button after adding it to DOM
        setupWatchButton(movieId);
            
    } catch (error) {
        console.error('Error loading movie details:', error);
        document.querySelector('.movie-info-detailed').innerHTML = `
            <h1>Error loading movie details</h1>
            <p>Please try again later or go back to the home page.</p>
            <a href="index.html" class="watch-btn">
                <i class="fas fa-home"></i> Go Home
            </a>
        `;
    }
}

function createStreamingLinksHtml(providers) {
    if (!providers || !providers.US) {
        return `
            <div class="streaming-section">
                <h3>Streaming Options</h3>
                <p>No streaming options available in your region.</p>
                <div class="alternative-sources">
                    <p>Try checking on:</p>
                    <div class="streaming-links">
                        <a href="https://www.justwatch.com" target="_blank" class="streaming-link">JustWatch</a>
                        <a href="https://www.netflix.com" target="_blank" class="streaming-link">Netflix</a>
                        <a href="https://www.amazon.com/Prime-Video" target="_blank" class="streaming-link">Amazon Prime</a>
                        <a href="https://www.hulu.com" target="_blank" class="streaming-link">Hulu</a>
                    </div>
                </div>
            </div>
        `;
    }

    const { flatrate, rent, buy } = providers.US;
    let streamingHtml = '<div class="streaming-section"><h3>Streaming Options</h3>';

    if (flatrate) {
        streamingHtml += `
            <div class="streaming-category">
                <h4>Stream</h4>
                <div class="streaming-links">
                    ${flatrate.map(provider => `
                        <a href="https://www.google.com/search?q=watch+movie+on+${provider.provider_name}" 
                           target="_blank" 
                           class="streaming-link">
                            ${provider.provider_name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (rent) {
        streamingHtml += `
            <div class="streaming-category">
                <h4>Rent</h4>
                <div class="streaming-links">
                    ${rent.map(provider => `
                        <a href="https://www.google.com/search?q=rent+movie+on+${provider.provider_name}" 
                           target="_blank" 
                           class="streaming-link">
                            ${provider.provider_name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (buy) {
        streamingHtml += `
            <div class="streaming-category">
                <h4>Buy</h4>
                <div class="streaming-links">
                    ${buy.map(provider => `
                        <a href="https://www.google.com/search?q=buy+movie+on+${provider.provider_name}" 
                           target="_blank" 
                           class="streaming-link">
                            ${provider.provider_name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    streamingHtml += '</div>';
    return streamingHtml;
}

async function loadMovieCast(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        const data = await response.json();
        
        const castContainer = document.getElementById('movie-cast');
        const mainCast = data.cast.slice(0, 6); // Get first 6 cast members
        
        castContainer.innerHTML = mainCast.map(actor => `
            <div class="cast-card">
                <img src="${actor.profile_path 
                    ? IMAGE_BASE_URL + 'w185' + actor.profile_path 
                    : 'images/placeholder.png'}" 
                    alt="${actor.name}">
                <div class="cast-info">
                    <h4>${actor.name}</h4>
                    <p>${actor.character}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading cast:', error);
        document.getElementById('movie-cast').innerHTML = 
            '<p>Cast information not available</p>';
    }
}

async function setupWatchButton(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        const data = await response.json();
        
        const trailer = data.results.find(
            video => video.type === "Trailer" && video.site === "YouTube"
        );
        
        const watchBtn = document.querySelector('.watch-btn');
        if (trailer) {
            watchBtn.addEventListener('click', () => {
                window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
            });
        } else {
            watchBtn.textContent = 'No Trailer Available';
            watchBtn.disabled = true;
            watchBtn.style.opacity = '0.5';
        }
    } catch (error) {
        console.error('Error loading trailer:', error);
        const watchBtn = document.querySelector('.watch-btn');
        watchBtn.textContent = 'Trailer Unavailable';
        watchBtn.disabled = true;
        watchBtn.style.opacity = '0.5';
    }
} 