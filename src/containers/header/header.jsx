import React from 'react'
import './header.css'
import school from '../../../public/pictures/school.jpg'

export default function Header() {
  return (
    <div className='webgis__header section__padding' id='home'>
      <div className='webgis__header-content_top'>
        <p>CARAGA STATE UNIVERSITY</p>
        <div className='webgis__header-content_mid'>
        <h1 className='header__text'>DepEd School <br></br>Locations</h1>
          <div className='webgis__header-content_image'>
            <img src = {school} alt = "school"></img>
          </div>
        </div>
      </div>
      <div className='webgis__header-content_bottom'>
          <p1>A WEBGIS Project of ITE-18 GROUP 3</p1>
          <p2>Caraga State University - Main, Ampayon, Butuan City, Agusan Del Norte, Philippines</p2>
      </div>
    </div>
  )
}
