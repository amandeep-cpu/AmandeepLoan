import glob, os, re
root = 'main_file/html'
canonical = '''
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
'''

for path in glob.glob(os.path.join(root, '*.html')):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    if text.count('<!-- Footer -->') <= 1:
        continue
    post_last_footer = text.split('</footer>')[-1]
    scripts = ''.join(re.findall(r'<script[^>]*></script>', post_last_footer, re.DOTALL))
    before_footer = text.split('<!-- Footer -->')[0]
    fixed = before_footer.rstrip() + '\n' + canonical + '\n' + scripts + '\n</body>\n</html>\n'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(fixed)
    print('Fixed:', path)
