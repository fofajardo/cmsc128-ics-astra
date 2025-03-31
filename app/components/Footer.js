export default function Footer() {
  return (
    <footer className="footer w-full">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h2 className="footer-heading">University of the Philippines - Los Baños</h2>
            <ul className="footer-list">
              <li className="footer-list-item">
                <p className="footer-list">Institute of Computer Science</p>
              </li>
              <li className="footer-list-item">
                <p className="footer-list">© 2025 UPLB All rights reserved.</p>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">Get in Touch</h2>
            <ul className="footer-list">
              <li className="footer-list-item">
                <p className="footer-list">
                  <i className="fas fa-map-marker-alt"></i>
                  College of Arts and Sciences, UPLB Los Baños Laguna, Philippines 4031
                </p>
              </li>
              <li className="footer-list-item">
                <p className="footer-list">
                  <i className="fas fa-phone-alt"></i>
                  (049) 536 2302 | 63-49-536-2302
                </p>
              </li>
              <li className="footer-list-item">
                <p className="footer-list">
                  <i className="fas fa-envelope"></i>
                  ics.uplb@up.edu.ph
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">Learn More</h2>
            <ul className="footer-list">
              <li className="footer-list-item">
                <a href="https://www.uplb.edu.ph/" className="footer-link">UPLB</a>
              </li>
              <li className="footer-list-item">
                <a href="https://ovcaa.uplb.edu.ph/" className="footer-link">OVCAA UPLB</a>
              </li>
              <li className="footer-list-item">
                <a href="https://graduateschool.uplb.edu.ph/" className="footer-link">UPLB Graduate School</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
