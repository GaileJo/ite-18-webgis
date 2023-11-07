import React from 'react'
import './features.css'
import Article from '../article/article'

const featuresData = [
    {
        title:'Search',
        text:'Enter the name of the school or any relevant keywords in the search bar.',
    },
    {
        title:'Explore',
        text:'Use the interactive map to discover schools in the Caraga region.',
    },
    {
        title:'Filters',
        text:'Refine your search results by applying filters, such as grade level, school type, and location.',
    },
    {
        title:'Details',
        text:'Click on a school icon on the map to view detailed information, including contact details and address.',
    },
]
export default function Features() {
  return (
    <div className='webgis__features section__padding' id="features">
        <div className='webgis__features-heading'>
            <h1 className='header__text'>How to Use Caraga State University WebGIS</h1>
            <p>Using our WebGIS is straightforward. Just follow these simple steps:</p>
            <div>
                <a href='#map'>
                    <button type="button">Get Started</button>
                </a>
            </div>
        </div>
        <div className='webgis__features-container'>
            {featuresData.map((item, index) => (
                <Article  title={item.title} text={item.text} key={item.title + index} />
            ))}
        </div>
    </div>
  )
}


