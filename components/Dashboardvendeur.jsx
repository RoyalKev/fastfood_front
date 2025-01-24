import React from 'react'
import Copyright from './Copyright'

const Dashboardvendeur = () => {
  return (
    <>
        <div className="dashboard-content">
					<div className="dashboard-tlbar d-block mb-4">
						<div className="row">
							<div className="colxl-12 col-lg-12 col-md-12">
								<h1 className="mb-1 fs-3 fw-medium">Employer Dashboard</h1>
								<nav aria-label="breadcrumb">
									<ol className="breadcrumb">
										<li className="breadcrumb-item text-muted"><a href="#">Employer</a></li>
										<li className="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
										<li className="breadcrumb-item"><a href="#" className="text-primary">Employer Statistics</a></li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
					<div className="dashboard-widg-bar d-block">
						<div className="row align-items-center gx-4 gy-4 mb-4">
						
							<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
								<div className="viewBox">
									<div className="viewboxWrap">
										<div className="icon bg-light-seegreen text-seegreen">
											<i className="bi bi-send-check"></i>
										</div>
										<div className="view-caption">
											<h5 className="title"><span className="ctr">59</span></h5>
											<p className="subtitle">Posted Jobs</p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
								<div className="viewBox">
									<div className="viewboxWrap">
										<div className="icon bg-light-purple text-purple">
											<i className="bi bi-bookmark-star"></i>
										</div>
										<div className="view-caption">
											<h5 className="title"><span className="ctr">112</span></h5>
											<p className="subtitle">All Applicants</p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
								<div className="viewBox">
									<div className="viewboxWrap">
										<div className="icon bg-light-warning text-warning">
											<i className="bi bi-chat-dots"></i>
										</div>
										<div className="view-caption">
											<h5 className="title"><span className="ctr">15</span></h5>
											<p className="subtitle">New Message</p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
								<div className="viewBox">
									<div className="viewboxWrap">
										<div className="icon bg-light-danger text-danger">
											<i className="bi bi-people"></i>
										</div>
										<div className="view-caption">
											<h5 className="title"><span className="ctr">78</span></h5>
											<p className="subtitle">My Followers</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Copyright/>
				</div>
    </>
  )
}

export default Dashboardvendeur