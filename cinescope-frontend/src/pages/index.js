import React, { useState, useEffect, useCallback } from 'react';

function LandPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [featuredMovieVideos, setFeaturedMovieVideos] = useState([]);
    const [isPlayingBackgroundTrailer, setIsPlayingBackgroundTrailer] = useState(false);
    const [featuredTrailerKey, setFeaturedTrailerKey] = useState(null);

    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US&page=${page}`
            );
            const data = await response.json();
            setTotalPages(data.total_pages);
            
            if (page === 1) {
                setMovies(data.results.slice(0, 12));
                
                // Set the first movie as featured
                const firstMovie = data.results[0];
                setFeaturedMovie(firstMovie);
                
                // Fetch videos for the featured movie
                fetchMovieVideos(firstMovie.id, true);
            } else {
                setMovies(prev => [...prev, ...data.results.slice(0, 12)]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setLoading(false);
        }
    }, [page]);

    const fetchMovieVideos = async (movieId, isFeatured = false) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=02d2d30e38f07e116dd9f4ec122a4a27`
            );
            const data = await response.json();
            const videos = data.results;
            
            if (isFeatured) {
                setFeaturedMovieVideos(videos);
                
                // Find trailer for the featured movie
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
    };

    const playTrailer = async (movieId) => {
        const videos = await fetchMovieVideos(movieId);
        const trailer = videos.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
        if (trailer) {
            setTrailerUrl(trailer.key);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const loadMoreMovies = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const toggleBackgroundTrailer = () => {
        setIsPlayingBackgroundTrailer(!isPlayingBackgroundTrailer);
    };

    return (
        <div className="landPage" style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', color: 'white' }}>
            {/* Trailer Modal */}
            {trailerUrl && (
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
                    <iframe
                        title="Movie Trailer"
                        width="80%"
                        height="80%"
                        src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ zIndex: 2000 }}
                    ></iframe>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                backgroundColor: '#1a1a2e',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
                <div style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 'bold', 
                    color: '#e50914',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span>CodeCraftersMovies</span>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px' 
                }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            style={{
                                padding: '8px 15px 8px 35px',
                                borderRadius: '20px',
                                border: 'none',
                                width: '300px',
                                backgroundColor: '#2c2c44',
                                color: 'white'
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#aaa'
                        }}>
                            🔍
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button style={{
                            backgroundColor: '#e50914',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}>
                            Sign In
                        </button>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}>
                            ☰
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div style={{ padding: '20px 30px' }}>
                {/* Featured Movie Section */}
                <section style={{
                    position: 'relative',
                    borderRadius: '8px',
                    margin: '20px 0',
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Background Image or Trailer */}
                    {isPlayingBackgroundTrailer && featuredTrailerKey ? (
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
                                    height: 'calc(100% + 120px)', // Make it bigger to cover the section
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
                    
                    {/* Dark Overlay */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 2
                    }}></div>
                    
                    {/* Featured Movie Content */}
                    <div style={{
                        maxWidth: '600px',
                        padding: '40px',
                        position: 'relative',
                        zIndex: 3
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                            {featuredMovie?.title || 'Featured Movie'}
                        </h2>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '20px',
                            fontWeight: 'bold'
                        }}>
                            <span>Rating: {featuredMovie?.vote_average?.toFixed(1) || 'N/A'}/10</span>
                            <span>Released: {featuredMovie?.release_date?.split('-')[0] || 'N/A'}</span>
                        </div>
                        <p style={{ 
                            lineHeight: '1.6', 
                            marginBottom: '25px',
                            fontSize: '1.1rem'
                        }}>
                            {featuredMovie?.overview || 'Movie description will appear here.'}
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => {
                                    const trailer = featuredMovieVideos.find(vid => vid.type === "Trailer");
                                    if (trailer) {
                                        setTrailerUrl(trailer.key);
                                    }
                                }}
                                style={{
                                    backgroundColor: '#e50914',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    fontSize: '1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    fontWeight: 'bold'
                                }}
                            >
                                WATCH TRAILER
                            </button>
                            <button 
                                onClick={toggleBackgroundTrailer}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '2px solid white',
                                    padding: '12px 30px',
                                    fontSize: '1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isPlayingBackgroundTrailer ? 'STOP BACKGROUND' : 'PLAY IN BACKGROUND'}
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* Featured Movies Grid */}
                <section>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        margin: '30px 0 20px 0'
                    }}>
                        <h3 style={{ fontSize: '1.5rem' }}>Featured Movies</h3>
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
                                fontSize: 'inherit',
                                opacity: page >= totalPages ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Loading...' : 'See more'} <span style={{ fontSize: '1.2rem' }}>→</span>
                        </button>
                    </div>
                    
                    {/* Movies Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '25px',
                        padding: '10px 0'
                    }}>
                        {movies.map((movie) => (
                            <div 
                                key={movie.id}
                                style={{
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer',
                                    ':hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                                onClick={() => {
                                    setFeaturedMovie(movie);
                                    fetchMovieVideos(movie.id, true);
                                    // Scroll to top to see featured movie
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                <img 
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : 'https://via.placeholder.com/180x270?text=No+Poster'}
                                    alt={movie.title}
                                    style={{
                                        width: '100%',
                                        height: '270px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #333'
                                    }}
                                />
                                <div style={{ padding: '12px 5px' }}>
                                    <h4 style={{ 
                                        margin: '0 0 5px 0', 
                                        fontSize: '0.95rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {movie.title}
                                    </h4>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        fontSize: '0.85rem'
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

                    {loading && (
                        <div style={{ 
                            color: 'white', 
                            textAlign: 'center', 
                            padding: '20px',
                            fontStyle: 'italic'
                        }}>
                            Loading more movies...
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default LandPage;