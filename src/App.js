import './App.css'
import { useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css'


const SearchApp = () => {
  const [searchItem, setSearchItem] = useState('')
  const [results, setResults] = useState([])
  const ref = useRef('')
  const searchInput = useRef(null);
  const [searchDone, setSearchDone] = useState(false)

  const search = (event) => {
    event.preventDefault()
    setSearchItem(ref.current)
    setSearchDone(true)
  }

  const handleChange = (event) => {
    ref.current = event.target.value
  }

  useEffect(() => {
      const requestUrl = `https://api.unsplash.com/search/photos?query=${searchItem}&per_page=10&client_id=${process.env.REACT_APP_UNSPLASH}`
      axios.get(requestUrl)
        .then(response => {
          setResults(response.data.results)
        })
        .catch(error => {
          console.error("error", error);
        })
      searchInput.current.blur()

  }, [searchItem])

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
      {searchDone && results.length === 0 ? (
        <p className='notify'>No results for {searchItem}</p>
      ) : (
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
          {results.map(result => (
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
