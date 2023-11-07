import React from 'react'
import './footer.css'
import logo from '../../../public/pictures/logo.svg';
import csulogo from '../../../public/pictures/csulogo.svg';

export default function Footer() {
  return (
    <div className='webgis__footer section__padding'>
      <div className='webgis__footer-heading'>
        <div className='webgis__footer-heading_title'>
          <h1 >Empowering Education Through Technology</h1>
          <h3 >Caraga State University</h3>
          <h3 >3rd Year Bachelor of Science in Computer Science Students</h3>
        </div>
        <div className='webgis__footer-heading_logo1'>
        <img src={logo} alt="logo" style={{width: '120px'}}></img>
        </div>
        <div className='webgis__footer-heading_logo2'>
        <img src={csulogo} alt="csulogo" style={{width: '90px'}}></img>
        </div>
      </div>
      <div className='webgis__footer-information'>
        <div className='webgis__footer-information_details'>
        <h3 >Contact Us</h3>
        <p >Phone: 09916464633</p>
        <p > Email: bscsite18@gmail.com</p>
        </div>
        <div className='webgis__footer-information_socmed'>
            <h3 className='socmed__title'>Follow Us On Social Media</h3>
            <p className='socmed__text-fb'>Facebook: [Your Facebook Page]</p>
            <p className='socmed__text-twt'>Twitter: [Your Twitter Handle]</p>
      </div>
      </div>
      <div className='webgis__footer-disclaimer'>
        <h2>Disclaimer: Caraga State University WebGIS is a student project and is not an official Department of Education (DepEd) resource. Please verify information with DepEd for official use.</h2>
      </div>
    </div>
  )
}
