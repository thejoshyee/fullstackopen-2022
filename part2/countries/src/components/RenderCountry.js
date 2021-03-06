import React from "react"
import { useState } from "react"
import RenderDetails from "./RenderDetails"


const RenderCountry = ({ country }) => {

    // state to show or hide details
    const [isDetailsVisible, setIsDetailsVisible] = useState(false)
    
    // Button - show / hide details
    const showCountryDetails = (e) => {
        setIsDetailsVisible(!isDetailsVisible)
    }

    // country language values
    const countryLangs = Object.values(country.languages)



    if (!isDetailsVisible) {
        return (
            <div className="country-card">
                <p className="country-name">{country.name.common}</p>
                <button className="detail-button" onClick={showCountryDetails}>Show Info</button>

            </div>
        )
    } else {
        return (
            <div className="country-card-shown">
                <p className="country-name">{country.name.common}</p>
                <button 
                    className="detail-button"
                    onClick={showCountryDetails}>
                    Hide Info
                </button>
                <RenderDetails country={country} countryLangs={countryLangs} />
            </div>
        )
    }
}

export default RenderCountry


