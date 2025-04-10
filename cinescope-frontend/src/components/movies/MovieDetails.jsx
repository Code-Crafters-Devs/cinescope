import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faDownload, faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';

function TrailerPage({ movie, onBack, trailerKey }) {
    const [movieDetails, setMovieDetails] = useState(null);
    const [cast, setCast] = useState([]);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (movie) {
            fetchMovieDetails();
        }
    }, [movie]);
    
    const fetchMovieDetails = async () => {
        try {
            setLoading(true);
            
            // Fetch detailed movie info including genres
            const detailsResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US`
            );
            const detailsData = await detailsResponse.json();
            setMovieDetails(detailsData);
            
            // Fetch cast info
            const creditsResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=02d2d30e38f07e116dd9f4ec122a4a27`
            );
            const creditsData = await creditsResponse.json();
            setCast(creditsData.cast.slice(0, 8)); // Only show top 8 cast members
            
            // Fetch similar movies
            const similarResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US&page=1`
            );
            const similarData = await similarResponse.json();
            setRelatedMovies(similarData.results.slice(0, 6)); // Only show 6 similar movies
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching movie details:", error);
            setLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (trailerKey) {
            // This is a simplified approach. Actual downloading requires more complex handling
            // This just opens the YouTube video in a new tab
            window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
            alert("For actual downloading, you would need a server-side solution to handle YouTube video downloads.");
        }
    };
    
    if (loading) {
        return (
            <div style={{ 
                backgroundColor: '#0f0f1a', 
                minHeight: '100vh', 
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.5rem'
            }}>
                Loading movie details...
            </div>
        );
    }
    
    return (
        <div style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', color: 'white' }}>
            {/* Hero Section with Movie Background */}
            <div style={{
                position: 'relative',
                height: '70vh',
                width: '100%',
                overflow: 'hidden'
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4)'
                }}></div>
                
                {/* Back Button */}
                <button 
                    onClick={onBack}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                
                {/* Movie Info Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '40px',
                    background: 'linear-gradient(transparent, rgba(15, 15, 26, 1))'
                }}>
                    <div style={{ maxWidth: '800px' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{movie.title}</h1>
                        
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '20px',
                            marginBottom: '20px'
                        }}>
                            <span style={{ 
                                backgroundColor: '#e50914',
                                padding: '5px 12px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}>
                                <FontAwesomeIcon icon={faStar} style={{ marginRight: '5px', color: '#FFD700' }} />
                                {movie.vote_average?.toFixed(1) || 'N/A'}/10
                            </span>
                            
                            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                            
                            {movieDetails && movieDetails.runtime && (
                                <span>{Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m</span>
                            )}
                        </div>
                        
                        {/* Genres */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {movieDetails && movieDetails.genres && movieDetails.genres.map(genre => (
                                <span 
                                    key={genre.id}
                                    style={{
                                        border: '1px solid white',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        
                        {/* Watch & Download Buttons */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => window.location.href = `https://www.youtube.com/watch?v=${trailerKey}`}
                                style={{
                                    backgroundColor: '#e50914',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <FontAwesomeIcon icon={faPlay} /> Watch Now
                            </button>
                            
                            <button 
                                onClick={handleDownload}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: '2px solid white',
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <FontAwesomeIcon icon={faDownload} /> Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Content Container */}
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Overview Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                        Overview
                    </h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {movie.overview || 'No overview available for this movie.'}
                    </p>
                </section>
                
                {/* Cast Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                        Cast
                    </h2>
                    
                    {cast.length === 0 ? (
                        <p>No cast information available.</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '20px'
                        }}>
                            {cast.map(person => (
                                <div key={person.id} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        margin: '0 auto 10px auto',
                                        border: '2px solid #333'
                                    }}>
                                        <img 
                                            src={person.profile_path 
                                                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                                : 'https://via.placeholder.com/185x185?text=No+Image'}
                                            alt={person.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{person.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>{person.character}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                
                {/* Related Movies Section */}
                <section>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                        Related Movies
                    </h2>
                    
                    {relatedMovies.length === 0 ? (
                        <p>No related movies available.</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '25px'
                        }}>
                            {relatedMovies.map(relatedMovie => (
                                <div 
                                    key={relatedMovie.id}
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img 
                                        src={relatedMovie.poster_path 
                                            ? `https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`
                                            : 'https://via.placeholder.com/180x270?text=No+Poster'}
                                        alt={relatedMovie.title}
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
                                            {relatedMovie.title}
                                        </h4>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span style={{ color: '#aaa' }}>
                                                {relatedMovie.release_date?.split('-')[0] || 'N/A'}
                                            </span>
                                            <span style={{ 
                                                color: '#FFD700',
                                                fontWeight: 'bold'
                                            }}>
                                                ★ {relatedMovie.vote_average?.toFixed(1) || '0.0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default TrailerPage;