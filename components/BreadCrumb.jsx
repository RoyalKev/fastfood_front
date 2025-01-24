import React from 'react'

const BreadCrumb = (props) => {
  return (
    <div className="row align-items-center" style={{marginTop:'-10px'}}>
        <div className="border-0 mb-4">
            <div className="card-header py-1 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h6 className="mb-0">
                <a href="/meeting/Dashboard" style={{color:"#ffe489"}}> <i className="icofont-loop"></i> Gestion des {props.titre}</a></h6>
                <h6 className="mb-0 pull-right">
                <a href="/meeting/Dashboard" style={{color:"#fff"}}><i className="icofont-home"></i>  Tableau de bord</a></h6>
            </div>
        </div>
    </div>
  )
}

export default BreadCrumb