import React from "react"; // Importing necessary components and styles for the application
import Navbar from './components/navbar/navbar' // Navigation bar component
import Header from './containers/header/header' // Header component main title
import About from './components/about/about' // About section component
import Features from './components/features/features' // Features section component
import Map from './components/map/map' // Map component for displaying locations
import Footer from './containers/footer/footer' // Footer component for miscellaneous information and links

import './App.css'  // Importing styles specific to the App component


// Define the App component
export default function App () {
  return (
    <div className="App">     {/* Main container of the App */}
      <div className="gradient__bg">
         <Navbar/>
         <Header/>
        </div >
          <About/>
          <Features/>
      <div className="gradient__bg">
          <Map/>
      </div>
          <Footer/>
    </div>
  )
}
