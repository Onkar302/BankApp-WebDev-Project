import { Link, Outlet } from "react-router-dom";

export default function MasterPage(){

  //retrieve
    return(
        <div>
          
            <nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
      Bank App
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
        <Link className="nav-link active" to='/home'>Home</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link active" to='/dotransaction'>Self Transact</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link active" to='/passbook'>Get Passbook</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link active" to='/transfer'>Transfer money</Link>
        </li>


        
      </ul>
   
    </div>
  </div>
</nav>
            
            <section>
                <Outlet></Outlet>
            </section>

            <footer className="page-footer font-small blue">

  
                <div className="footer-copyright text-center py-3">© 2022 Copyright:
                    <a>Bank App</a>
                </div>
    
            </footer>
        </div>
    )
}