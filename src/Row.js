import React, { useState, useEffect } from 'react' //rfce to create basic 
import axios from './axios'
import './row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = "https://tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
  //state is like way write variable in react where we store temporary information which we can replace. 
  const [movies, setMovies] = useState([]) //here we are using react hooks useState
  const [trailerUrl, setTrailerUrl] = useState("")

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl)
      setMovies(request.data.results)//data.result comes from jason data, console.log request.data.results. 
      return request
    }
    fetchData()
  }, [fetchUrl]) //has two arguments 1st is function, 2nd is []. if we leave [] empthy then we are saying run once when the row loads, and don't run again. [movies] we are creating dependency here so it will run once when the row loads and then it will run every single time when movies changes. recomment to add it. 

  //console.log(movies)

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  }

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('')
    } else {
      movieTrailer(movie?.name || "")
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search)
          setTrailerUrl(urlParams.get('v'))
        }).catch((error) => console.log(error))
    }
  }

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(movie => (
          <img key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`} src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  )
}

export default Row
