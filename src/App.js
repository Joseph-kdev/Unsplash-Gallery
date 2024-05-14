import './App.css'
import { useEffect, useRef, useReducer} from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css'

const reducer = (state,action) => {
  switch (action.type) {
    case "search-item":
      return {...state, searchItem: action.payload}
    case "search-done":
      return {...state, searchDone: action.payload}
    case "results-received":
      return { ...state, results: action.payload }

    default:
      throw new Error()
  }
}

const SearchApp = () => {
  const [state, dispatch] = useReducer(reducer, { searchItem: '', searchDone: false, results: [] })

  const ref = useRef('')
  const searchInput = useRef(null);

  const search = (event) => {
    event.preventDefault()
    dispatch({
      type: 'search-item',
      payload: ref.current
    })
    dispatch({
      type: 'search-done',
      payload: true
    })
  }

  // const download = (result) => {
  //   axios.get(`result.links.download_location&client_id=${process.env.REACT_APP_UNSPLASH}`)
  //     .then(response => {
  //       console.log(response);
  //     })
  // }

  const handleChange = (event) => {
    ref.current = event.target.value
  }

  useEffect(() => {
      const requestUrl = `https://api.unsplash.com/search/photos?query=${state.searchItem}&per_page=10&client_id=${process.env.REACT_APP_UNSPLASH}`
      axios.get(requestUrl)
        .then(response => {
          dispatch({
            type: "results-received",
            payload: response.data.results
          })
        })
        .catch(error => {
          console.error("error", error);
        })
      searchInput.current.blur()

  }, [state.searchItem])

const breakPoints = {
  default: 3,
  1100: 3,
  700: 2,
}

  return (
    <div>
      <form onSubmit={search} className='searchPart'>
        <input ref={searchInput} placeholder='Search images...' onChange={handleChange} className='searchBar'/>
      </form>
      {state.searchDone && state.results.length === 0 ? (
        <p className='notify'>No results for {state.searchItem}</p>
      ) : (
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
          {state.results.map(result => (
          <div key={result.id}>
          <img className='images' src={result.urls.small} alt={result.description} />
          </div>
          ))}
      </Masonry>
      )}
    </div>
   );
}
const App = () => {
  return (
    <div className='app'>
      <SearchApp />
    </div>
   );
}
export default App;
