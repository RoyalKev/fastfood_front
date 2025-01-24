import React from 'react'

const Footer = () => {
  return (
    <footer className="footer skin-dark-footer bg-secondary">
				<div className="container">
					
					<div className="row mb-5">

						<div className="col-12 col-md-4 col-lg-4">
							<div className="footer-widget pe-xl-5 mb-5 mb-md-0">
								<div className="footerLogo">
									LOGO
								</div>
								<div className="footerText pe-xl-3">
									<p>We make your dream more beautiful & enjoyful with lots of happiness.</p>
								</div>
								<form className="d-block mt-3">
									<div className="newsllerForm">
										<div className="inputBox"><input type="text" className="form-control" placeholder="Enter Your Mail!"/></div>
										<div className="btnWrap"><button type="button" className="btn btn-primary"><i className="fa-solid fa-location-arrow"></i></button></div>
									</div>
								</form>
							</div>
						</div>
						<div className="col-6 col-md-4 col-lg-2">
							<div className="footer-widget mb-5 mb-md-5 mb-lg-0">
								<h4 className="widget-title">About Us</h4>
								<ul className="footer-menu">
									<li><a href="JavaScript:Void(0);">Our Partners</a></li>
									<li><a href="JavaScript:Void(0);">Our Mission</a></li>
									<li><a href="JavaScript:Void(0);">News & Updates</a></li>
									<li><a href="JavaScript:Void(0);">Careers</a></li>
									<li><a href="JavaScript:Void(0);">Pricing</a></li>
								</ul>
							</div>
						</div>

						<div className="col-6 col-md-4 col-lg-2">
							
						</div>

						<div className="col-6 col-md-4 offset-md-4 col-lg-2 offset-lg-0">
							
						</div>

						<div className="col-6 col-md-4 col-lg-2">
							
						</div>

					</div>
					
					<div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 col-12">
							<div className="footerBottom">
								<div className="d-flex align-items-center justify-content-center justify-content-md-between gap-3">
									
									<div className="copyrightCaps"><p className="copyright-text">© Hiredio. 2024 Themezhub. All rights reserved.</p></div>
									
									<div className="d-flex align-items-center justify-content-start gap-2">
										<div className="ftr-select language-select">
											<select className="form-select">
											  <option selected>English</option>
											  <option value="1">Hindi</option>
											  <option value="2">French</option>
											  <option value="3">Spanish</option>
											  <option value="3">China</option>
											</select>
										</div>
										<div className="ftr-select currency-select">
											<select className="form-select">
											  <option selected>USD</option>
											  <option value="1">EURO</option>
											  <option value="2">PUND</option>
											  <option value="3">INR</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
				</div>
				
			</footer>
  )
}

export default Footer