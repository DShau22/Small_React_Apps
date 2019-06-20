import React from 'react'


const ImageSlide = ({ activity }) => {
  return (
    <div className="imageSlide">
      <img src={activity.imageUrl} alt="loading..."/>
      <h3 style={{
        marginTop: "30px",
        border: "solid",
        borderRadius: "1px"
      }}>
        {renderDisplay(activity)}
      </h3>
    </div>
  )
}

function renderDisplay (activity) {
  return activity.action + ": " + ((activity.num === undefined) ? 0 : activity.num)
}

export default ImageSlide
