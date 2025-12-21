import { useState } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import AboutClinic from './pages/AboutClinic'
import AboutRoni from './pages/AboutRoni'
import Nav from './components/Nav'
import './App.css'

// return what that appears on the screen
function App() {

  //React, sets the current value of page which setpage changes. starts as 'home'
  const [page, setPage] = useState('home')

  // what that will be displayed (UI) AND update automaticaly changes
  return (
      <div>
        <Header />

      <Nav page = {page} navigator={setPage} />

      <main style={{ marginTop: '16px' }}> {/*what page to put with the value of page*/}
        {page === 'home' && <Home />}
        {page === 'clinic' && <AboutClinic />}
        {page === 'roni' && <AboutRoni />}
      </main>

      </div>
  )
}

//can use App in other places
export default App
