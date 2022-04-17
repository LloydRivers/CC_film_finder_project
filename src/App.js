import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

const tmdbKey = process.env.REACT_APP_TMDBKEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

function App() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [movies, setMovies] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});

  const getGenres = () => {
    const genreRequestEndpoint = `/genre/movie/list`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
    axios
      .get(urlToFetch)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.log("error: ", error));
  };
  const getMovies = (e) => {
    setSelectedGenre(e);
    const discoverMovieEndpoint = `/discover/movie`;
    const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
    axios
      .get(urlToFetch)
      .then((response) => {
        setMovies(response.data.results);
        getRandomMovie(response.data.results);
        //response.data.results
      })
      .catch((error) => console.log("error: ", error));
  };
  const getMovieInfo = (movie) => {
    let movieId = movie.id;
    const movieEndpoint = `/movie/${movieId}`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
    axios
      .get(urlToFetch)
      .then((response) => setMovieInfo(response.data))
      .catch((error) => console.log("error: ", error));
  };
  const getRandomMovie = (movies) => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    getMovieInfo(randomMovie);
  };

  useEffect(() => {
    getGenres();
  }, []);
  console.log(movieInfo);
  return (
    <>
      <header>
        <h1 id="appTitle">🍿Film Finder🍿</h1>
      </header>
      <form id="genreForm">
        <label>Choose a genre:</label>
        <select
          onChange={(e) => getMovies(e.target.value)}
          name="genres"
          id="genres"
        >
          {genres.map((genre, index) => (
            <option key={index} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </form>
      <button id="playBtn">Let's Play!</button>
      <div id="movieInfo">
        <div id="moviePoster"></div>
        <div id="movieText"></div>
      </div>
      <div id="likeOrDislikeBtns" hidden>
        <button id="likeBtn">
          <i className="fa-solid fa-thumbs-up"></i>
        </button>
        <button id="dislikeBtn">
          <i className="fa-solid fa-thumbs-down"></i>
        </button>
      </div>
      <div>
        <h2>{movieInfo.original_title}</h2>

        <ul>
          {movieInfo.genres === undefined
            ? null
            : movieInfo.genres.map((genre, index) => {
                return <li key={index}>Genre:{genre.name}</li>;
              })}
        </ul>
        <p>{movieInfo.overview}</p>
      </div>
    </>
  );
}

export default App;
