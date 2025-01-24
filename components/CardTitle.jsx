import React from 'react'

const CardTitle = (props) => {
  return (
    <div className="card-header py-3 d-flex justify-content-between align-items-center bg-transparent border-bottom-3">
        <h6 className="m-0 fw-bold">{props.title}</h6>
    </div>
  )
}

export default CardTitle