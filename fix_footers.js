const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'main_file', 'html');
const canonicalFooter = `
  <!-- Footer -->
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <i class="fas fa-university"></i>
            <h3>Amandeep Loans</h3>
          </div>
          <p>Professional loan management solutions for individuals and businesses. Secure, reliable, and user-friendly financial tools.</p>
          <div class="contact-info">
            <div class="contact-item"><i class="fas fa-phone"></i> <span>+1 (555) 123-4567</span></div>
            <div class="contact-item"><i class="fas fa-envelope"></i> <span>support@amandeepLoans.com</span></div>
            <div class="contact-item"><i class="fas fa-map-marker-alt"></i> <span>123 Finance Street, NY 10001</span></div>
          </div>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Amandeep Loans. All rights reserved.</p>
      </div>
    </div>
  </footer>
  <div id="notification" class="notification"></div>
`;

fs.readdirSync(htmlDir).forEach(file => {
  if (!file.endsWith('.html')) return;

  const fullPath = path.join(htmlDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const footerCount = (content.match(/<!-- Footer -->/g) || []).length;
  if (footerCount <= 1) {
    return;
  }

  const afterLastFooter = content.split('</footer>').pop();
  const scripts = (afterLastFooter.match(/<script[^>]*><\/script>/g) || []).join('\n');
  const beforeFooter = content.split('<!-- Footer -->')[0];

  const fixed = beforeFooter.trimEnd() + '\n' + canonicalFooter + '\n' + scripts + '\n</body>\n</html>\n';

  fs.writeFileSync(fullPath, fixed, 'utf8');
  console.log(`Fixed: ${file}`);
});
