import React from "react";

import { footer } from "../../Portfolio";

import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <ul className="footer-links">
            {footer.links.data.map((link, index) => {
              return (
                <li key={index}>
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-1"
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="footer-right">
          <div className="footer-icons">
            {footer.socialMedia.data.map((socialLink, index) => {
              return (
                <a
                  key={index}
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  {socialLink.icon}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <p className="footer-company-name">{footer.copyRight}</p>
    </footer>
  );
}

export default Footer;