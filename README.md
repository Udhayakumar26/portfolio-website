# AI & Data Science Portfolio

A modern, responsive portfolio website showcasing AI and Data Science projects, skills, and experience. Built with HTML, CSS, and JavaScript with advanced animations and interactive features.

## 🌟 Features

- **Modern Design**: Contemporary UI with glassmorphism effects and smooth animations
- **Responsive Layout**: Optimized for all devices (desktop, tablet, mobile)
- **Interactive Animations**: Particle system, hover effects, and scroll animations
- **Dynamic Content**: JSON-based content management for easy updates
- **Project Showcase**: Filterable project gallery with detailed modals
- **Contact Form**: Functional contact form with validation
- **Performance Optimized**: Fast loading with optimized assets
- **Accessibility**: WCAG compliant with keyboard navigation support
- **SEO Friendly**: Optimized for search engines

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-website.git
   cd portfolio-website
   ```

2. **Customize your content**
   - Update `data/personal.json` with your information
   - Add your projects to `data/projects.json`
   - Update skills in `data/skills.json`
   - Add your experience to `data/experience.json`

3. **Add your images**
   - Profile picture: `assets/images/profile/profile-pic.jpg`
   - Project screenshots: `assets/images/projects/`
   - Company logos: `assets/images/companies/`

4. **Open in browser**
   - Simply open `index.html` in your browser
   - Or use a local server for better performance:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

## 📁 Project Structure

```
portfolio-website/
│
├── index.html                 # Main HTML file
│
├── assets/
│   ├── css/
│   │   ├── style.css         # Main stylesheet
│   │   ├── animations.css    # Animation styles
│   │   └── responsive.css    # Mobile responsiveness
│   │
│   ├── js/
│   │   ├── main.js          # Core functionality
│   │   ├── animations.js    # Animation effects
│   │   └── form-handler.js  # Form handling
│   │
│   └── images/              # All image assets
│
├── data/                    # JSON data files
│   ├── projects.json       # Project information
│   ├── skills.json        # Skills and technologies
│   ├── experience.json    # Work experience & education
│   └── personal.json      # Personal information
│
└── docs/                  # Documentation
    ├── SETUP.md
    └── DEPLOYMENT.md
```

## 🎨 Customization Guide

### 1. Personal Information
Update `data/personal.json` with:
- Your name, title, and bio
- Contact information
- Social media links
- Career goals and interests

### 2. Projects
Edit `data/projects.json` to:
- Add your project details
- Include screenshots and demos
- Specify technologies used
- Add GitHub links

### 3. Skills
Modify `data/skills.json` to:
- Update skill categories
- Add your proficiency levels
- Include certifications
- Set learning goals

### 4. Styling
Customize the look in `assets/css/style.css`:
```css
:root {
    --primary-color: #00d4ff;    /* Change primary color */
    --secondary-color: #ff6b6b;  /* Change secondary color */
    --accent-color: #4ecdc4;     /* Change accent color */
}
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints for:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## ⚡ Performance Features

- **Lazy Loading**: Images load as needed
- **Minified Assets**: Optimized CSS and JS
- **Caching**: Browser caching for faster loads
- **Compressed Images**: WebP format support
- **CDN Ready**: Easy integration with CDNs

## 🔧 Advanced Features

### Contact Form Setup

1. **EmailJS Integration** (Recommended for client-side)
   ```javascript
   // In form-handler.js, update these values:
   emailjs.init('YOUR_USER_ID');
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
   ```

2. **Formspree Integration**
   ```javascript
   // Update the form action in form-handler.js:
   fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

3. **Custom Backend**
   - Set up your own API endpoint
   - Update the fetch URL in `form-handler.js`

### Analytics Integration

Add Google Analytics to track visitors:
```html
<!-- Add to <head> section of index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Deployment Options

### 1. GitHub Pages (Free)
```bash
# Push to GitHub repository
git add .
git commit -m "Initial portfolio setup"
git push origin main

# Enable GitHub Pages in repository settings
# Your site will be available at: https://username.github.io/portfolio-website
```

### 2. Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `# Leave empty for static site`
3. Set publish directory: `./`
4. Deploy automatically on git push

### 3. Vercel
```bash
npm install -g vercel
vercel --prod
```

### 4. Custom Domain Setup
1. Purchase a domain from your preferred registrar
2. Update DNS settings to point to your hosting provider
3. Configure SSL certificate (usually automatic)

## 🔒 Security Best Practices

- Keep dependencies updated
- Use HTTPS for all external resources
- Implement CSP headers for production
- Sanitize user inputs in contact forms
- Regular security audits

## 📊 SEO Optimization

The portfolio includes:
- Semantic HTML structure
- Meta tags and Open Graph data
- Structured data (JSON-LD)
- XML sitemap generation
- Fast loading times
- Mobile-first design

## 🎯 Performance Optimization Tips

1. **Image Optimization**
   ```bash
   # Use tools like ImageOptim or TinyPNG
   # Convert to WebP format when possible
   # Use appropriate image sizes for different screens
   ```

2. **Code Minification**
   ```bash
   # Minify CSS
   npm install -g clean-css-cli
   cleancss -o assets/css/style.min.css assets/css/style.css
   
   # Minify JavaScript
   npm install -g terser
   terser assets/js/main.js -o assets/js/main.min.js
   ```

3. **Caching Strategy**
   ```html
   <!-- Add cache headers for static assets -->
   <meta http-equiv="Cache-Control" content="public, max-age=31536000">
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**
   - Check file paths in JSON files
   - Ensure images exist in correct directories
   - Verify image file extensions

2. **Animations not working**
   - Check browser compatibility
   - Ensure CSS animations are enabled
   - Test on different devices

3. **Contact form not sending**
   - Verify email service configuration
   - Check browser console for errors
   - Test form validation

4. **Mobile responsiveness issues**
   - Test on actual devices
   - Use browser developer tools
   - Check CSS media queries

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspiration from various portfolio designs
- Icons from [Lucide Icons](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Animation libraries and techniques from the web community

## 📞 Support

If you have any questions or need help customizing your portfolio:

- Create an issue on GitHub
- Email: your.email@gmail.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

## 🔄 Changelog

### Version 1.0.0
- Initial release with all core features
- Responsive design implementation
- Contact form integration
- Project showcase functionality
- Skills and experience sections

---

**Happy Coding!** 🚀

Made with ❤️ by [Your Name]