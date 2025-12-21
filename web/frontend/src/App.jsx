import Header from './components/Header'
import './App.css'

// return what that appears on the screen
function App() {

  // what that will be displayed (UI) AND update automaticaly changes
  return (
      <div>
      <h1><Header></Header></h1>
      <p>ברוכים הבאים</p>
      </div>
  )
}

//can use App in other places
export default App
