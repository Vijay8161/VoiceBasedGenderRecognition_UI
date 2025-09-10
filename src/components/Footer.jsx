import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">Connect with me</p>
        <div className="social-links">
          <a
            href="https://github.com/Vijay8161"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
          >
            <span className="social-icon">🐙</span>
            GitHub
          </a>
          <a
            href="https://www.instagram.com/vijaykrishnaneeli/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            <span className="social-icon">📷</span>
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/vijaykrishnaneeli/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            <span className="social-icon">💼</span>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
