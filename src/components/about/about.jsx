import React from 'react'
import './about.css';
import Article from '../article/article';

export default function About() {
  return (
    <div className='webgis__about section__margin' id='about'>

      <div className='webgis__about-div'/>
      <div className='webgis__about-content'>
          <h1>Welcome to Caraga State University's WEBGIS</h1>
          <p>A powerful tool designed by our 3rd-year Bachelor of Science in Computer Science (BSCS) students. Our mission is to make educational information more accessible to everyone.</p>
      </div>
      <div className='webgis__about-heading'>
        <h1 className='header-text'>Are you looking for a convenient way to find Department of Education (DepEd) schools in the Caraga region? You've come to the right place!</h1>
        <p>Who We Are</p>
      </div>
      <div className='webgis__about-container'> 
        <Article title="About Us" text="At Caraga State University, we believe in harnessing the power of technology for the greater good. The BSCS students have developed this innovative WebGIS platform to provide you with a seamless experience in locating DepEd schools in Caraga."/>
        <Article title="Our Vision" text="We envision a future where education is easily accessible to all, and our WebGIS is a small step toward that dream. By merging technology and education, we aim to create a more informed and empowered society."/>
        <Article title="Our Mission" text="Our mission is to facilitate the search for DepEd schools in Caraga, making it simpler and more efficient for parents, students, and educators. We strive to provide accurate and up-to-date information, ensuring that educational opportunities are within reach."/>
      </div>
    </div>
  )
}
