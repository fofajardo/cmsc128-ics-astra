import React from 'react'
import { alumList } from './mock_data';
import "../../styles/admin/alumni.css";

import { Icon } from "@iconify/react";

const AlumniPage = () => {
  return (
    <div>
      <h1 className="page-title">Alumni Search</h1>
      <p className="page-subtitle">The ever-growing UPLB-ICS Alumni Network</p>
   

      <div className="searchbar-row">
          
        <p className="page-medium-text">Registered <span>{alumList.length}</span></p>

        {toolKit()}

      </div>
      



    </div>
    
  )
}

const toolKit = () => {
  return(
    <div className="toolkit">

      <div className="search-container">
        <Icon icon="ic:baseline-search" className="search-icon" />
        <input className="search-bar" type="text" placeholder="Search for an alumni..." />
      </div>

    
      <button type="button" className="iconed-button">
        <Icon icon="mdi:filter-variant" className="button-icon" />
        <span className="hidden sm:inline">Filter by</span>
      </button>


      <select className="number-dropdown">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="20">40</option>
        <option value="30">50</option>
      </select>
    </div>
  )
}

export default AlumniPage;