import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faDownload, faArrowLeft, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';

function MovieDetails({ movie, onBack, trailerKey }) {
    const [movieDetails, setMovieDetails] = useState(null);
    const [cast, setCast] = useState([]);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showTrailer, setShowTrailer] = useState(false);
    
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                
                const detailsResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US`
                );
                const detailsData = await detailsResponse.json();
                setMovieDetails(detailsData);
                
                const creditsResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=02d2d30e38f07e116dd9f4ec122a4a27`
                );
                const creditsData = await creditsResponse.json();
                setCast(creditsData.cast);
                
                const similarResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=02d2d30e38f07e116dd9f4ec122a4a27&language=en-US&page=1`
                );
                const similarData = await similarResponse.json();
                setRelatedMovies(similarData.results.slice(0, 6));
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        };

        if (movie) {
            fetchMovieDetails();
        }
    }, [movie]);
    
    const handleDownload = () => {
        if (trailerKey) {
            window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
            alert("For actual downloading, you would need a server-side solution to handle YouTube video downloads.");
        }
    };
    
    const toggleTrailer = () => {
        setShowTrailer(!showTrailer);
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
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return (
                    <div style={{ padding: '25px 0' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {movie.overview || 'No overview available for this movie.'}
                        </p>
                    </div>
                );
            case 'cast':
                return (
                    <div style={{ padding: '25px 0' }}>
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
                    </div>
                );
            case 'related':
                return (
                    <div style={{ padding: '25px 0' }}>
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
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };
    
    return (
        <div style={{ 
            backgroundColor: '#0f0f1a', 
            minHeight: '100vh', 
            color: 'white',
            position: 'relative' 
        }}>
            {/* Hero Section with Movie Background */}
            <div style={{
                position: 'relative',
                height: '70vh',
                width: '100%',
                overflow: 'hidden',
                display: 'flex'
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
                
                {/* Movie Info Section - now sharing row with trailer */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: showTrailer ? '60%' : '100%',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    transition: 'width 0.3s ease'
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
                                onClick={toggleTrailer}
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
                                <FontAwesomeIcon icon={faPlay} /> Watch Trailer
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

                {/* Trailer Section - now positioned opposite the movie details */}
                {showTrailer && (
                    <div style={{
                        width: '40%',
                        position: 'relative',
                        zIndex: 2,
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '56.25%', /* 16:9 aspect ratio */
                            height: 0,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}>
                            <iframe 
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                title="Movie Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <button
                            onClick={toggleTrailer}
                            style={{
                                alignSelf: 'flex-end',
                                marginTop: '15px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} /> Close Trailer
                        </button>
                    </div>
                )}
            </div>
            
            {/* Content Container - now below both movie details and trailer */}
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                padding: '0 40px'
            }}>
                {/* Horizontal Navbar */}
                <div style={{ 
                    display: 'flex',
                    borderBottom: '1px solid #333',
                    margin: '20px 0 0 0'
                }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            backgroundColor: 'transparent',
                            color: activeTab === 'overview' ? '#e50914' : 'white',
                            border: 'none',
                            borderBottom: activeTab === 'overview' ? '3px solid #e50914' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Overview
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('cast')}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            backgroundColor: 'transparent',
                            color: activeTab === 'cast' ? '#e50914' : 'white',
                            border: 'none',
                            borderBottom: activeTab === 'cast' ? '3px solid #e50914' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'cast' ? 'bold' : 'normal',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cast
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('related')}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            backgroundColor: 'transparent',
                            color: activeTab === 'related' ? '#e50914' : 'white',
                            border: 'none',
                            borderBottom: activeTab === 'related' ? '3px solid #e50914' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'related' ? 'bold' : 'normal',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Related Movies
                    </button>
                </div>
                
                {/* Dynamic Content based on active tab */}
                {renderTabContent()}
            </div>
        </div>
    );
}

export default MovieDetails;