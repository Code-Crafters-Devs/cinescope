import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faAngleUp, 
    faAngleDown, 
    faSearch, 
    faUserCircle, 
    faEdit, 
    faSignOutAlt,
    faHeart,
    faPlayCircle,
    faHeart as faSolidHeart
} from '@fortawesome/free-solid-svg-icons';
import MovieDetails from '../components/movies/MovieDetails.jsx';
import { useNavigate } from 'react-router-dom';

function UserHome() {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [featuredMovieVideos, setFeaturedMovieVideos] = useState([]);
    const [featuredTrailerKey, setFeaturedTrailerKey] = useState(null);
    const [showVideoGallery, setShowVideoGallery] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [showTrailerPage, setShowTrailerPage] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [currentlyWatching, setCurrentlyWatching] = useState([]);
    const [recentlyWatched, setRecentlyWatched] = useState([]);
    const [popularInCountry, setPopularInCountry] = useState([]);
    const [activeSection, setActiveSection] = useState('Featured Movies');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState({});
    const [isWatchingLoading, setIsWatchingLoading] = useState({});
    const categories = ["Action", "Comedy", "Animation", "Horror", "Romantic"];
    const navigate = useNavigate();

    // Profile dropdown states
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: ''
    });

    // Load user data from localStorage on mount
    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            try {
                const parsedData = JSON.parse(userDataString);
                setUserData(parsedData);
                setUpdateFormData({
                    firstName: parsedData.firstName || '',
                    lastName: parsedData.lastName || '',
                    email: parsedData.email || '',
                    country: parsedData.country || ''
                });
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                setUserData(null);
            }
        }
    }, []);

    // Fetch all user-specific data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch user profile
                const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Fetch favorites
                const favoritesResponse = await fetch('http://localhost:5000/api/users/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Fetch currently watching
                const currentlyWatchingResponse = await fetch('http://localhost:5000/api/users/currently-watching', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Fetch watch history
                const watchHistoryResponse = await fetch('http://localhost:5000/api/users/watch-history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (profileResponse.ok && favoritesResponse.ok && 
                    currentlyWatchingResponse.ok && watchHistoryResponse.ok) {
                    const profileData = await profileResponse.json();
                    const favoritesData = await favoritesResponse.json();
                    const currentlyWatchingData = await currentlyWatchingResponse.json();
                    const watchHistoryData = await watchHistoryResponse.json();
                    
                    setUserData(profileData);
                    setFavorites(favoritesData.favorites || []);
                    setCurrentlyWatching(currentlyWatchingData.currentlyWatching || []);
                    setRecentlyWatched(watchHistoryData || []);
                    
                    // Update localStorage
                    localStorage.setItem('user', JSON.stringify({
                        ...profileData,
                        favorites: favoritesData.favorites || [],
                        currentlyWatching: currentlyWatchingData.currentlyWatching || [],
                        recentlyWatched: watchHistoryData || []
                    }));
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            }
        };

        fetchUserData();
    }, []);

    // Fetch popular movies for user's country
    useEffect(() => {
        if (userData?.country) {
            const fetchPopularForCountry = async () => {
                try {
                    const regionMap = {
                        'United States': 'US',
                        'India': 'IN',
                        'United Kingdom': 'GB',
                        'South Africa': 'ZA'
                    };

                    const region = regionMap[userData.country] || '';
                    const response = await fetch(
                        `https://api.themoviedb.org/3/movie/popular?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US&page=1&region=${region}`
                    );

                    const data = await response.json();
                    const filteredResults = data.results.filter(movie =>
                        !movie.title.toLowerCase().includes('minecraft')
                    );

                    setPopularInCountry(filteredResults.slice(0, 12));
                } catch (error) {
                    console.error("Error fetching popular movies for country:", error);
                    setError('Failed to load popular movies for your country');
                }
            };

            fetchPopularForCountry();
        }
    }, [userData]);

    const fetchMovieVideos = useCallback(async (movieId, isFeatured = false) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=02d2d30e38f07e116dd9f4ec122a4a27`
            );
            const data = await response.json();
            const videos = data.results;
            
            if (isFeatured) {
                setFeaturedMovieVideos(videos);
                const trailer = videos.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
                if (trailer) {
                    setFeaturedTrailerKey(trailer.key);
                }
            }
            
            return videos;
        } catch (error) {
            console.error("Error fetching videos:", error);
            return [];
        }
    }, []);

    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US&page=${page}`
            );
            const data = await response.json();
            setTotalPages(data.total_pages);
            
            const filteredResults = data.results.filter(movie => 
                !movie.title.toLowerCase().includes('minecraft')
            );
            
            if (page === 1) {
                const moviesToShow = filteredResults.slice(0, 12);
                setMovies(moviesToShow);
                setFilteredMovies(moviesToShow);
                
                if (moviesToShow.length > 0) {
                    const firstMovie = moviesToShow[0];
                    setFeaturedMovie(firstMovie);
                    fetchMovieVideos(firstMovie.id, true);
                }
            } else {
                setMovies(prev => [...prev, ...filteredResults.slice(0, 12)]);
                setFilteredMovies(prev => [...prev, ...filteredResults.slice(0, 12)]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setError('Failed to load movies');
            setLoading(false);
        }
    }, [page, fetchMovieVideos]);

    const toggleFavorite = async (movie) => {
        try {
            setIsFavoriteLoading(prev => ({ ...prev, [movie.id]: true }));
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
    
            const isCurrentlyFavorite = favorites.some(fav => fav.tmdbId === movie.id);
            const endpoint = `http://localhost:5000/api/users/favorites/${movie.id}`;
            const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
    
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to ${isCurrentlyFavorite ? 'remove from' : 'add to'} favorites`);
            }
    
            const data = await response.json();
    
            // Update favorites in state
            setFavorites(data.favorites || []);
    
            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser) {
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    favorites: data.favorites || []
                }));
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            setError(error.message);
        } finally {
            setIsFavoriteLoading(prev => ({ ...prev, [movie.id]: false }));
        }
    };

    const toggleCurrentlyWatching = async (movie) => {
        try {
            setIsWatchingLoading(prev => ({ ...prev, [movie.id]: true }));
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
    
            const isCurrentlyWatching = currentlyWatching.some(m => m.tmdbId === movie.id);
            const endpoint = `http://localhost:5000/api/users/currently-watching/${movie.id}`;
            const method = 'POST'; // Always POST to toggle
    
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to ${isCurrentlyWatching ? 'remove from' : 'add to'} currently watching`);
            }
    
            const data = await response.json();
    
            // Update currently watching in state
            setCurrentlyWatching(data.currentlyWatching || []);
    
            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser) {
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    currentlyWatching: data.currentlyWatching || []
                }));
            }
        } catch (error) {
            console.error("Error updating currently watching:", error);
            setError(error.message);
        } finally {
            setIsWatchingLoading(prev => ({ ...prev, [movie.id]: false }));
        }
    };
    
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.tmdbId === movieId);
    };

    const isCurrentlyWatching = (movieId) => {
        return currentlyWatching.some(movie => movie.tmdbId === movieId);
    };

    const playTrailer = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Add to recently watched
                const response = await fetch(`http://localhost:5000/api/users/recently-watched/${movie.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRecentlyWatched(data.recentlyWatched || []);
                    
                    // Update localStorage
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    if (currentUser) {
                        localStorage.setItem('user', JSON.stringify({
                            ...currentUser,
                            recentlyWatched: data.recentlyWatched || []
                        }));
                    }
                }
            }
            
            const videos = await fetchMovieVideos(movie.id);
            const trailer = videos.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
            if (trailer) {
                setTrailerUrl(trailer.key);
                setSelectedMovie(movie);
                setShowTrailerPage(true);
            }
        } catch (error) {
            console.error("Error tracking watched movie:", error);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateFormData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            if (!data.user) {
                throw new Error('User data not returned from server');
            }

            // Update localStorage and state
            localStorage.setItem('user', JSON.stringify(data.user));
            setUserData(data.user);
            setUpdateFormData({
                firstName: data.user.firstName || '',
                lastName: data.user.lastName || '',
                email: data.user.email || '',
                country: data.user.country || ''
            });
            setShowUpdateForm(false);
            setError(null);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            setError(`Failed to update profile: ${err.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserData(null);
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredMovies(movies);
        } else {
            const filtered = movies.filter(movie =>
                movie.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMovies(filtered);
        }
    };

    const closeTrailerPage = () => {
        setShowTrailerPage(false);
        setTrailerUrl(null);
    };

    const loadMoreMovies = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const toggleVideoGallery = () => {
        setShowVideoGallery(!showVideoGallery);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const updateFeaturedMovie = (movie) => {
        if (!movie.title.toLowerCase().includes('minecraft')) {
            setFeaturedMovie(movie);
            fetchMovieVideos(movie.id, true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    if (showTrailerPage && selectedMovie && trailerUrl) {
        return <MovieDetails 
            movie={selectedMovie} 
            onBack={closeTrailerPage} 
            trailerKey={trailerUrl} 
        />;
    }

    const renderMovieGrid = (movies, sectionName) => {
        if (movies.length === 0) {
            let message = '';
            switch(sectionName) {
                case 'Your Favorites':
                    message = 'You currently have no favorite movies.';
                    break;
                case 'Recently Watched':
                    message = 'You have not watched any movies recently.';
                    break;
                case 'Currently Watching':
                    message = 'You are not currently watching any movies.';
                    break;
                default:
                    message = 'No movies available.';
            }
            
            return (
                <div style={{ 
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    color: '#aaa'
                }}>
                    {message}
                </div>
            );
        }

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '15px',
                padding: '10px 0',
                '@media (min-width: 768px)': {
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '25px'
                }
            }}>
                {movies.map((movie) => (
                    <div 
                        key={movie.id}
                        style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            transform: isFavoriteLoading[movie.id] || isWatchingLoading[movie.id] ? 'scale(0.98)' : 'scale(1)',
                            opacity: isFavoriteLoading[movie.id] || isWatchingLoading[movie.id] ? 0.8 : 1
                        }}
                    >
                        <div 
                            onClick={() => updateFeaturedMovie(movie)}
                            style={{ position: 'relative' }}
                        >
                            <img 
                                src={movie.poster_path 
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : 'https://via.placeholder.com/180x270?text=No+Poster'}
                                alt={movie.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    aspectRatio: '2/3',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #333'
                                }}
                            />
                            <div 
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    zIndex: 2,
                                    '@media (min-width: 768px)': {
                                        width: '36px',
                                        height: '36px'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(movie);
                                }}
                            >
                                {isFavoriteLoading[movie.id] ? (
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #fff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite'
                                    }} />
                                ) : (
                                    <FontAwesomeIcon 
                                        icon={isFavorite(movie.id) ? faSolidHeart : faHeart} 
                                        color={isFavorite(movie.id) ? '#e50914' : 'white'}
                                        style={{ transition: 'color 0.2s ease' }}
                                    />
                                )}
                            </div>
                            <div 
                                style={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: '10px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    zIndex: 2,
                                    '@media (min-width: 768px)': {
                                        width: '36px',
                                        height: '36px'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCurrentlyWatching(movie);
                                }}
                            >
                                {isWatchingLoading[movie.id] ? (
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #fff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite'
                                    }} />
                                ) : (
                                    <FontAwesomeIcon 
                                        icon={faPlayCircle} 
                                        color={isCurrentlyWatching(movie.id) ? '#e50914' : 'white'}
                                        style={{ transition: 'color 0.2s ease' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div style={{ padding: '10px 5px' }}>
                            <h4 style={{ 
                                margin: '0 0 5px 0', 
                                fontSize: '0.9rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                '@media (min-width: 768px)': {
                                    fontSize: '0.95rem'
                                }
                            }}>
                                {movie.title}
                            </h4>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                fontSize: '0.8rem',
                                '@media (min-width: 768px)': {
                                    fontSize: '0.85rem'
                                }
                            }}>
                                <span style={{ color: '#aaa' }}>
                                    {movie.release_date?.split('-')[0] || 'N/A'}
                                </span>
                                <span style={{ 
                                    color: '#FFD700',
                                    fontWeight: 'bold'
                                }}>
                                    ★ {movie.vote_average?.toFixed(1) || '0.0'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderSectionNav = () => {
        return (
            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '1px solid #333',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '@media (min-width: 768px)': {
                    gap: '25px'
                }
            }}>
                {['Featured Movies', 'Popular in Your Country', 'Recently Watched', 'Currently Watching', 'Your Favorites'].map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: activeSection === section ? '#e50914' : 'white',
                            fontSize: '0.9rem',
                            fontWeight: activeSection === section ? 'bold' : 'normal',
                            padding: '8px 0',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            position: 'relative',
                            transition: 'color 0.3s ease',
                            '@media (min-width: 768px)': {
                                fontSize: '1.1rem'
                            }
                        }}
                    >
                        {section}
                        {activeSection === section && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-11px',
                                left: 0,
                                right: 0,
                                height: '3px',
                                backgroundColor: '#e50914',
                                borderRadius: '3px 3px 0 0'
                            }} />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="userHome" style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', color: 'white' }}>
            {error && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    left: '20px',
                    backgroundColor: '#e50914',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    zIndex: 3000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '@media (min-width: 768px)': {
                        left: 'auto',
                        right: '20px',
                        maxWidth: '400px'
                    }
                }}>
                    <span>{error}</span>
                    <button 
                        onClick={() => setError(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {trailerUrl && !showTrailerPage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 2000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <button 
                        onClick={() => setTrailerUrl(null)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: '#e50914',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            zIndex: 2001
                        }}
                    >
                        ×
                    </button>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        padding: '20px',
                        '@media (min-width: 768px)': {
                            width: '80%',
                            height: '80%'
                        }
                    }}>
                        <iframe
                            title="Movie Trailer"
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ zIndex: 2000 }}
                        ></iframe>
                    </div>
                </div>
            )}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                padding: '15px',
                backgroundColor: '#1a1a2e',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                '@media (min-width: 768px)': {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 30px'
                }
            }}>
                <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#e50914',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    '@media (min-width: 768px)': {
                        fontSize: '1.8rem',
                        flex: 1
                    }
                }}>
                    <span>CineScope</span>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    '@media (min-width: 768px)': {
                        flex: 1
                    }
                }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                        <input 
                            type="text" 
                            placeholder="Search movies..." 
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{
                                padding: '8px 35px 8px 15px',
                                borderRadius: '20px',
                                border: 'none',
                                width: '100%',
                                backgroundColor: '#2c2c44',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#aaa',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    justifyContent: 'flex-end',
                    '@media (min-width: 768px)': {
                        gap: '15px',
                        flex: 1
                    }
                }}>
                    <div style={{ position: 'relative' }}>
                        <div 
                            style={{
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#e50914',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                '@media (min-width: 768px)': {
                                    fontSize: '1.5rem',
                                    gap: '10px'
                                }
                            }}
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                            <FontAwesomeIcon icon={faUserCircle} />
                            <span style={{ fontSize: '0.9rem', '@media (min-width: 768px)': { fontSize: '1rem' } }}>
                                Welcome, {userData?.firstName || 'User'}
                            </span>
                        </div>
                        
                        {showProfileDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                backgroundColor: '#2c2c44',
                                borderRadius: '4px',
                                width: '200px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                zIndex: 1000,
                                marginTop: '10px',
                                padding: '10px'
                            }}>
                                {!showUpdateForm ? (
                                    <>
                                        <div style={{ padding: '8px', borderBottom: '1px solid #3e3e5e' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>
                                                {userData?.firstName || ''} {userData?.lastName || ''}
                                            </p>
                                            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#aaa' }}>
                                                {userData?.email || ''}
                                            </p>
                                            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#aaa' }}>
                                                {userData?.country || ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowUpdateForm(true)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                marginTop: '10px',
                                                backgroundColor: '#e50914',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            Update Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                marginTop: '10px',
                                                backgroundColor: 'transparent',
                                                color: '#e50914',
                                                border: '1px solid #e50914',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ padding: '8px' }}>
                                        <h4 style={{ margin: '0 0 10px', textAlign: 'center' }}>Update Profile</h4>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>First Name</label>
                                            <input
                                                type="text"
                                                value={updateFormData.firstName}
                                                onChange={(e) => setUpdateFormData({...updateFormData, firstName: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '5px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #333',
                                                    backgroundColor: '#2c2c44',
                                                    color: '#fff'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>Last Name</label>
                                            <input
                                                type="text"
                                                value={updateFormData.lastName}
                                                onChange={(e) => setUpdateFormData({...updateFormData, lastName: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '5px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #333',
                                                    backgroundColor: '#2c2c44',
                                                    color: '#fff'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>Country</label>
                                            <select
                                                value={updateFormData.country}
                                                onChange={(e) => setUpdateFormData({...updateFormData, country: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '5px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #333',
                                                    backgroundColor: '#2c2c44',
                                                    color: '#fff'
                                                }}
                                            >
                                                <option value="">Select Country</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="United States">United States</option>
                                                <option value="India">India</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                            <button
                                                onClick={handleProfileUpdate}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    backgroundColor: '#e50914',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setShowUpdateForm(false)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    backgroundColor: 'transparent',
                                                    color: '#e50914',
                                                    border: '1px solid #e50914',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown();
                            }}
                            style={{
                                background: 'red',
                                border: 'none',
                                color: 'white',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                display: 'flex',
                                fontWeight: 'bold',
                                gap: '10px',
                                alignItems: 'center',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                '@media (min-width: 768px)': {
                                    padding: '8px 20px',
                                    gap: '15px',
                                    fontSize: '1rem'
                                }
                            }}
                        >
                            Categories {isOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                        </button>
                        {isOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                backgroundColor: '#2c2c44',
                                borderRadius: '4px',
                                width: '150px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                zIndex: 1000,
                                marginTop: '10px',
                                '@media (min-width: 768px)': {
                                    width: '180px'
                                }
                            }}>
                                {categories.map((category) => (
                                    <div 
                                        key={category}
                                        style={{
                                            padding: '10px 15px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #3e3e5e',
                                            transition: 'background-color 0.2s',
                                            fontSize: '0.9rem',
                                            '@media (min-width: 768px)': {
                                                padding: '12px 20px'
                                            }
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e3e5e'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => {
                                            const categoryMap = {
                                                'Action': 'action',
                                                'Comedy': 'comedy',
                                                'Animation': 'animation',
                                                'Horror': 'horror',
                                                'Romantic': 'romance'
                                            };
                                            const path = categoryMap[category] || category.toLowerCase();
                                            navigate(`/user/categories/${path}`);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {category}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ padding: '15px', '@media (min-width: 768px)': { padding: '20px 30px' } }}>
                {activeSection === 'Featured Movies' && featuredMovie && (
                    <div>
                        <section 
                            style={{
                                position: 'relative',
                                borderRadius: '8px',
                                margin: '20px 0',
                                minHeight: '50vh',
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                                '@media (min-width: 768px)': {
                                    minHeight: '70vh'
                                }
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {isHovering && featuredTrailerKey ? (
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    zIndex: 1
                                }}>
                                    <iframe
                                        title="Background Trailer"
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${featuredTrailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${featuredTrailerKey}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        style={{
                                            position: 'absolute',
                                            top: '-60px',
                                            left: 0,
                                            width: '100%',
                                            height: 'calc(100% + 120px)',
                                            objectFit: 'cover',
                                            pointerEvents: 'none'
                                        }}
                                    ></iframe>
                                </div>
                            ) : (
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    backgroundImage: featuredMovie?.backdrop_path 
                                        ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
                                        : 'url(https://image.tmdb.org/t/p/original/ziEuG1essDuWuC5lp3UxW6l7Rpw.jpg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    zIndex: 1
                                }}></div>
                            )}
                            
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: 2
                            }}></div>
                            
                            <div style={{
                                maxWidth: '100%',
                                padding: '20px',
                                position: 'relative',
                                zIndex: 3,
                                '@media (min-width: 768px)': {
                                    maxWidth: '600px',
                                    padding: '40px'
                                }
                            }}>
                                <h2 style={{ 
                                    fontSize: '1.8rem', 
                                    marginBottom: '10px',
                                    '@media (min-width: 768px)': {
                                        fontSize: '2.5rem'
                                    }
                                }}>
                                    {featuredMovie?.title || 'Featured Movie'}
                                </h2>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    '@media (min-width: 768px)': {
                                        fontSize: '1rem'
                                    }
                                }}>
                                    <span>Rating: {featuredMovie?.vote_average?.toFixed(1) || 'N/A'}/10</span>
                                    <span>Released: {featuredMovie?.release_date?.split('-')[0] || 'N/A'}</span>
                                </div>
                                <p style={{ 
                                    lineHeight: '1.6', 
                                    marginBottom: '20px',
                                    fontSize: '0.95rem',
                                    '@media (min-width: 768px)': {
                                        fontSize: '1.1rem',
                                        marginBottom: '25px'
                                    }
                                }}>
                                    {featuredMovie?.overview || 'Movie description will appear here.'}
                                </p>
                                <div style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '10px',
                                    '@media (min-width: 768px)': {
                                        display: 'flex',
                                        gap: '15px',
                                        flexWrap: 'wrap'
                                    }
                                }}>
                                    <button 
                                        onClick={() => {
                                            if (featuredMovie) {
                                                playTrailer(featuredMovie);
                                            }
                                        }}
                                        style={{
                                            backgroundColor: '#e50914',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px',
                                            fontSize: '0.9rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s',
                                            fontWeight: 'bold',
                                            '@media (min-width: 768px)': {
                                                padding: '12px 30px',
                                                fontSize: '1rem'
                                            }
                                        }}
                                    >
                                        VIEW
                                    </button>
                                    <button 
                                        onClick={() => toggleFavorite(featuredMovie)}
                                        disabled={isFavoriteLoading[featuredMovie.id]}
                                        style={{
                                            backgroundColor: isFavorite(featuredMovie.id) ? '#e50914' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            border: `2px solid ${isFavorite(featuredMovie.id) ? '#e50914' : '#e50914'}`,
                                            padding: '10px',
                                            fontSize: '0.9rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px',
                                            opacity: isFavoriteLoading[featuredMovie.id] ? 0.7 : 1,
                                            '@media (min-width: 768px)': {
                                                padding: '12px 30px',
                                                fontSize: '1rem',
                                                gap: '8px'
                                            }
                                        }}
                                    >
                                        {isFavoriteLoading[featuredMovie.id] ? (
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid #fff',
                                                borderTop: '2px solid transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 0.8s linear infinite'
                                            }} />
                                        ) : (
                                            <>
                                                <FontAwesomeIcon 
                                                    icon={isFavorite(featuredMovie.id) ? faSolidHeart : faHeart} 
                                                    color={isFavorite(featuredMovie.id) ? 'white' : '#e50914'}
                                                />
                                                <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                                                    {isFavorite(featuredMovie.id) ? 'FAVORITED' : 'ADD TO FAVORITES'}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => toggleCurrentlyWatching(featuredMovie)}
                                        disabled={isWatchingLoading[featuredMovie.id]}
                                        style={{
                                            backgroundColor: isCurrentlyWatching(featuredMovie.id) ? '#e50914' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            border: `2px solid ${isCurrentlyWatching(featuredMovie.id) ? '#e50914' : '#e50914'}`,
                                            padding: '10px',
                                            fontSize: '0.9rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px',
                                            opacity: isWatchingLoading[featuredMovie.id] ? 0.7 : 1,
                                            '@media (min-width: 768px)': {
                                                padding: '12px 30px',
                                                fontSize: '1rem',
                                                gap: '8px'
                                            }
                                        }}
                                    >
                                        {isWatchingLoading[featuredMovie.id] ? (
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid #fff',
                                                borderTop: '2px solid transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 0.8s linear infinite'
                                            }} />
                                        ) : (
                                            <>
                                                <FontAwesomeIcon 
                                                    icon={faPlayCircle} 
                                                    color={isCurrentlyWatching(featuredMovie.id) ? 'white' : '#e50914'}
                                                />
                                                <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                                                    {isCurrentlyWatching(featuredMovie.id) ? 'WATCHING' : 'CURRENTLY WATCHING'}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                    {featuredMovieVideos.length > 0 && (
                                        <button 
                                            onClick={toggleVideoGallery}
                                            style={{
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                border: '2px solid #e50914',
                                                padding: '10px',
                                                fontSize: '0.9rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s',
                                                fontWeight: 'bold',
                                                '@media (min-width: 768px)': {
                                                    padding: '12px 30px',
                                                    fontSize: '1rem'
                                                }
                                            }}
                                        >
                                            {showVideoGallery ? 'HIDE' : 'VIDEOS'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                        
                        {showVideoGallery && featuredMovieVideos.length > 0 && (
                            <section style={{
                                padding: '15px',
                                backgroundColor: 'rgba(26, 26, 46, 0.8)',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                '@media (min-width: 768px)': {
                                    padding: '20px',
                                    marginBottom: '30px'
                                }
                            }}>
                                <h3 style={{ 
                                    fontSize: '1.1rem', 
                                    marginBottom: '15px',
                                    borderBottom: '1px solid #333',
                                    paddingBottom: '8px',
                                    '@media (min-width: 768px)': {
                                        fontSize: '1.3rem',
                                        marginBottom: '20px',
                                        paddingBottom: '10px'
                                    }
                                }}>
                                    Videos for {featuredMovie?.title}
                                </h3>
                                
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '15px',
                                    '@media (min-width: 768px)': {
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                        gap: '20px'
                                    }
                                }}>
                                    {featuredMovieVideos.map(video => (
                                        <div 
                                            key={video.key}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => setTrailerUrl(video.key)}
                                        >
                                            <div style={{
                                                position: 'relative',
                                                paddingBottom: '56.25%',
                                                height: 0
                                            }}>
                                                <img 
                                                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                                    alt={video.name}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: 'rgba(229, 9, 20, 0.8)',
                                                    borderRadius: '50%',
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    fontSize: '1.2rem',
                                                    '@media (min-width: 768px)': {
                                                        width: '50px',
                                                        height: '50px',
                                                        fontSize: '1.5rem'
                                                    }
                                                }}>
                                                    ▶
                                                </div>
                                            </div>
                                            <div style={{ padding: '8px 5px', '@media (min-width: 768px)': { padding: '10px 5px' } }}>
                                                <p style={{ 
                                                    margin: '0', 
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '0.9rem',
                                                    '@media (min-width: 768px)': {
                                                        fontSize: '1rem'
                                                    }
                                                }}>
                                                    {video.name}
                                                </p>
                                                <p style={{
                                                    margin: '5px 0 0',
                                                    fontSize: '0.75rem',
                                                    color: '#aaa',
                                                    '@media (min-width: 768px)': {
                                                        fontSize: '0.8rem'
                                                    }
                                                }}>
                                                    {video.type}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                <section style={{ margin: '30px 0', '@media (min-width: 768px)': { margin: '40px 0' } }}>
                    {renderSectionNav()}
                    {activeSection === 'Your Favorites' && renderMovieGrid(favorites, 'Your Favorites')}
                    {activeSection === 'Currently Watching' && renderMovieGrid(currentlyWatching, 'Currently Watching')}
                    {activeSection === 'Recently Watched' && renderMovieGrid(recentlyWatched, 'Recently Watched')}
                    {activeSection === 'Popular in Your Country' && renderMovieGrid(popularInCountry, 'Popular in Your Country')}
                </section>
                
                <section>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        margin: '20px 0 15px 0',
                        '@media (min-width: 768px)': {
                            margin: '30px 0 20px 0'
                        }
                    }}>
                        <h3 style={{ fontSize: '1.2rem', '@media (min-width: 768px)': { fontSize: '1.5rem' } }}>
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Movies'}
                        </h3>
                        {!searchQuery && (
                            <button 
                                onClick={loadMoreMovies}
                                disabled={loading || page >= totalPages}
                                style={{ 
                                    background: 'none',
                                    border: 'none',
                                    color: page >= totalPages ? '#666' : '#e50914',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    cursor: page >= totalPages ? 'default' : 'pointer',
                                    padding: 0,
                                    fontSize: '0.9rem',
                                    opacity: page >= totalPages ? 0.7 : 1,
                                    '@media (min-width: 768px)': {
                                        fontSize: '1rem'
                                    }
                                }}
                            >
                                {loading ? 'Loading...' : 'See more'} <span style={{ fontSize: '1rem', '@media (min-width: 768px)': { fontSize: '1.2rem' } }}>→</span>
                            </button>
                        )}
                    </div>
                    
                    {renderMovieGrid(filteredMovies, 'Featured Movies')}
                    
                    {filteredMovies.length === 0 && (
                        <div style={{ 
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '30px',
                            color: '#aaa',
                            '@media (min-width: 768px)': {
                                padding: '40px'
                            }
                        }}>
                            {searchQuery ? 
                                `No movies found matching "${searchQuery}"` : 
                                'No movies available'
                            }
                        </div>
                    )}

                    {loading && !searchQuery && (
                        <div style={{ 
                            color: 'white', 
                            textAlign: 'center', 
                            padding: '15px',
                            fontStyle: 'italic',
                            '@media (min-width: 768px)': {
                                padding: '20px'
                            }
                        }}>
                            Loading more movies...
                        </div>
                    )}
                </section>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default UserHome;