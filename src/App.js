import './App.css'
import { useState, useEffect, useRef} from 'react'
import axios from 'axios'


const SearchApp = () => {
  const [searchItem, setSearchItem] = useState('')
  const [results, setResults] = useState([])
  const ref = useRef('')

  const search = (event) => {
    event.preventDefault()
    setSearchItem(ref.current)
  }

  const handleChange = (event) => {
    ref.current = event.target.value
  }

  useEffect((query) => {
      const requestUrl = `https://api.unsplash.com/search/photos?query=${searchItem}&per_page=10&client_id=${process.env.REACT_APP_UNSPLASH}`
      axios.get(requestUrl)
        .then(response => {
          console.log(response.data);
          setResults(response.data.results)
        })
        .catch(error => {
          console.error("error", error);
        })

  }, [searchItem])

  return (
    <div>
      <form onSubmit={search} className='searchPart'>
        <input placeholder='search' onChange={handleChange} className='searchBar'/>
      </form>
        <div className='container'>
          {results.map(result => (
          <img className='images' key={result.id} src={result.urls.small} alt={result.description} />
          ))}
        </div>
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
