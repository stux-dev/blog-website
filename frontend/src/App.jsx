import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Navbar from './components/Navbar'
import './App.css'
import Home from "./pages/Home"
import Menubar from "./components/Menubar"

function App() {
 

  return (
    <>
    <Router>
      <Navbar/>
      <Menubar/>
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />

          </Routes>
        </div>
    </Router>
      
    </>
  )
}

export default App
