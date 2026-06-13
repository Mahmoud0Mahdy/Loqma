import { Github, Mail } from 'lucide-react';
import './footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const teamMembers = [
    { name: "Mahmoud Mahdy", id: "20220452", github: "https://github.com/Mahmoud0Mahdy", email: "mailto:mahmoudmahdy752@gmail.com" },
    { name: "Abdelrahman Salah ", id: "20220260", github: "https://github.com/abdosabada", email: "mailto:abdoaboabada@gmail.com" },
    { name: "Mahmoud Elgabry", id: "20220447", github: "https://github.com/Mahmoudelgabry", email: "mailto:mahmoudelgabry765@gmail.com" },
    { name: "Mariam Mahmoud", id: "20220471", github: "https://github.com/mariammaahmoud", email: "mailto:merofooly@gmail.com" },
    { name: "Alaa Wafiek", id: "20220070", github: "https://github.com/alaa-wafiek", email: "https://github.com/alaa-wafiek" }, 
    { name: "Jana Waleed", id: "20220125", github: "https://github.com/jana-waleed", email: "https://github.com/jana-waleed" }, 
  ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        <div className="footer-grid">
          
          {/* 1. Brand & Project Bio */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <h2 className="footer-logo-text">Loqma</h2>
              <span className="footer-badge">Graduation Project</span>
            </div>
            
            <p className="footer-desc">
              Your smart <strong>AI cooking assistant</strong>. Discover fresh ingredients, personalized recipes, and join a community of food lovers.
            </p>
            
            <div>
              <a 
                href="https://github.com/Mahmoud0Mahdy/Loqma.git" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-repo-btn"
              >
                <Github size={20} />
                <span>Loqma Source Code</span>
              </a>
            </div>
          </div>
          
          {/* 2. Graduation Team */}
          <div className="footer-team-col">
            <h3 className="footer-team-title">Graduation Team</h3>
            
            <ul className="footer-team-list">
              {teamMembers.map((member, index) => (
                <li key={index} className="footer-team-item">
                  
                  <div className="footer-member-info">
                    <span className="footer-member-name">{member.name}</span>
                    <span className="footer-member-id">{member.id}</span>
                  </div>
                  
                  <div className="footer-social-links">
                    {member.github && member.github !== "#" && (
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="footer-icon-link" 
                        title={`${member.name}'s GitHub`}
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {member.email && (
                      <a 
                        href={member.email} 
                        className="footer-icon-link"
                        title={`Email ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                    )}
                  </div>
                  
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Loqma Graduation Project. All rights reserved.
          </p>
          <p className="footer-credit">
            Built with <span className="heart-icon">❤️</span> for smart cooking.
          </p>
        </div>

      </div>
    </footer>
  );
}