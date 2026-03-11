import { Routes, Route, Navigate } from 'react-router-dom' // routes - wrapper who decide which Route (mapping url and componnet) to show
import Header from './components/Header'
import Nav from './components/Nav'
import Home from './pages/Home'
import AboutClinic from './pages/AboutClinic'
import AboutRoni from './pages/AboutRoni'
import Appointments  from './pages/Appointments'  
import './App.css'


// return what that appears on the screen
function App() {
  return (

    <>
      <Header />
      <Nav /> {/* shows the nav on the screen with the url and active link styling */}

      <main style={{ marginTop: '16px' }}>
        <Routes> {/* react chooses which Route to show by current url that the nav shows*/}
          <Route path="/" element={<Home />} />
          <Route path="/clinic" element={<AboutClinic />} />
          <Route path="/roni" element={<AboutRoni />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="*" element={<Navigate to="/" replace />} /> {/* for unknown url, go to home, ELEMENT = WHAT TO SHOW */}
        </Routes>
      </main>
    </>
  )
}
export default App
