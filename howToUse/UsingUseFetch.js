import React from 'react'
import useFetch, { CANCEL_REQUEST } from 'useFetch'
import axios from 'axios'

const service = cancelToken => {
  return axios.get('https://api.emdev.io/get-movie-list', { cancelToken })
}

const App = () => {
  const { data, loading, error, reloading, canceling } = useFetch(
    cancelToken => service(cancelToken)
  )

  if (loading) return (
    <>
      <p>Loading</p>
      <button onClick={canceling}>Cancel</button>
    </>
  )

  if (error) return (
    <>
      <p>{error.message === CANCEL_REQUEST ? 'Canceled' : `Error: ${error.message}`}</p>
      <button onClick={reloading}>Reload</button>
    </>
  )

  return (
    <ul>
      {
        data.map(movie => <li key={movie.id}>{movie.title}</li>)
      }
    </ul>
  )
}

export default App

