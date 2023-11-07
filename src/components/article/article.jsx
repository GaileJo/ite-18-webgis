import React from 'react'
import './article.css'

export default function Article({title, text}) {
  return (
    <div className='webgis__articles-container__article'>
      <div className='webgis__articles-container__article-title'>
        <div />
        <h1>{title}</h1>
      </div>
      <div className='webgis__articles-container_article-text'>
        <p>{text}</p>
      </div>
    </div>
  )
}
