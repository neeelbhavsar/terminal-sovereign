# Neel Bhavsar - Portfolio

<div align="center">

**A modern, interactive portfolio showcasing 4+ years of Node.js & Backend Architecture expertise**

[🌐 Visit Live](https://portfolio.neelbhavsar.dev) • [💼 LinkedIn](https://linkedin.com/in/neeelbhavsar) • [🐙 GitHub](https://github.com/neeelbhavsar) • [✉️ Email](mailto:neelbhavsar124@gmail.com)

</div>

---

## 🎨 About This Portfolio

This is a **production-ready, enterprise-grade portfolio website** that showcases my expertise in:

- **Backend Architecture** - Designing scalable, high-performance systems
- **RESTful APIs** - Building robust APIs with proper validation and error handling  
- **Database Design** - Optimizing for performance across polyglot architectures
- **Real-time Systems** - WebSocket implementations and live data handling
- **Security** - Implementing best practices for secure applications

The portfolio itself demonstrates these skills through:

✅ **Security hardening** - Email validation, rate limiting, XSS protection  
✅ **Performance optimization** - Optimized canvas rendering, image compression  
✅ **SEO excellence** - OG tags, structured data, sitemap  
✅ **Accessibility** - WCAG compliant with ARIA labels  
✅ **Clean architecture** - Well-organized, maintainable TypeScript code

---

## ✨ Key Features

### 🎬 Interactive Hero Section
- Scroll-triggered canvas animation sequence (120 frames)
- Smooth parallax effects with Framer Motion
- Real-time progress tracking with loading states
- Error handling and graceful fallbacks

### 📧 Secure Contact Form
- **Email Validation** - RFC 5321 compliant format checking
- **XSS Protection** - HTML entity encoding on all inputs
- **Rate Limiting** - 5 requests per IP per hour (prevents spam)
- **Input Sanitization** - Protection against malicious payloads
- **Auto-replies** - Styled HTML emails with metadata tracking
- **Live Preview** - Email preview before sending

### 🔍 SEO & Social Sharing
- **Open Graph Tags** - Optimized for Facebook, LinkedIn, Twitter
- **JSON-LD Schema** - Structured data for search engines
- **Sitemap & Robots.txt** - Search engine crawler optimization
- **Canonical URLs** - Prevents duplicate content issues
- **Meta Tags** - Complete SEO configuration

### ♿ Accessibility
- **ARIA Labels** - Screen reader support
- **Semantic HTML** - Proper form labeling and structure
- **Keyboard Navigation** - Full keyboard accessibility
- **WCAG Compliant** - Meets modern accessibility standards

### ⚡ Performance
- **Image Optimization** - AVIF & WebP format support
- **Canvas Optimization** - Reduced DOM reflows and repaints
- **Responsive Loading** - Device-aware image sizing
- **Build Optimization** - 145 KB First Load JS

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|---------------|
| **Framework** | Next.js 14.2.14 |
| **Language** | TypeScript 5 |
| **Frontend** | React 18.3, Framer Motion 11.5 |
| **Styling** | Tailwind CSS 3.4 |
| **Email** | Nodemailer 8.0 |
| **Validation** | Custom validators |
| **Dev Tools** | ESLint 8, Node 20+ |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gmail account with App Password enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/neeelbhavsar/terminal-sovereign.git
   cd terminal-sovereign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Gmail credentials**
   - Get App Password from [Google Account Security](https://myaccount.google.com/security)
   - Add to `.env.local`:
     ```
     GMAIL_USER=your-email@gmail.com
     GMAIL_APP_PASSWORD=your-16-char-password
     ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📋 Project Structure

```
terminal-sovereign/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API with validation & rate limiting
│   ├── components/
│   │   ├── About.tsx             # Professional background section
│   │   ├── Contact.tsx           # Secure contact form with preview
│   │   ├── Experience.tsx        # Work experience timeline
│   │   ├── Projects.tsx          # Portfolio projects showcase
│   │   ├── Skills.tsx            # Technical skills display
│   │   ├── ScrollyCanvas.tsx     # Hero animation sequence
│   │   ├── NetworkBackground.tsx # Animated node network
│   │   ├── StructuredData.tsx    # JSON-LD schema markup
│   │   └── ...other components
│   ├── globals.css               # Global styles & design system
│   ├── layout.tsx                # Root layout with SEO metadata
│   └── page.tsx                  # Main portfolio page
├── public/
│   ├── robots.txt                # Search engine directives
│   ├── sitemap.xml               # SEO sitemap
│   └── sequence/                 # Canvas animation frames (120 PNG files)
├── .env.example                  # Environment template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── SETUP.md                      # Detailed setup guide
```

---

## 🔐 Security Features

All sensitive data and potential vulnerabilities are addressed:

| Feature | Implementation |
|---------|-----------------|
| **Email Validation** | RFC 5321 compliant regex + length checks |
| **XSS Protection** | HTML entity encoding on user inputs |
| **Rate Limiting** | 5 requests/hour per IP (in-memory) |
| **Input Sanitization** | Prevents malicious scripts and HTML injection |
| **Env Validation** | Startup checks for required credentials |
| **Secrets Management** | `.env` excluded from git, template provided |

**Production Note:** For distributed systems, migrate to Redis-based rate limiting.

---

## 📊 Performance Metrics

- **First Load JS:** 145 KB ✅
- **Canvas Loading:** Progress bar with timeout
- **Image Optimization:** AVIF + WebP formats
- **DOM Operations:** Optimized for smooth animations
- **Build Time:** ~5-10 seconds

**Lighthouse Targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 📝 API Documentation

### POST `/api/contact`

Submit a contact form message with automatic email notifications.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in working together..."
}
```

**Validation:**
- Name: Required, max 100 characters
- Email: Required, valid email format
- Message: Required, 10-5000 characters

**Rate Limiting:** 5 requests per IP per hour (HTTP 429)

**Response:**
```json
{
  "success": true
}
```

**Error Responses:**
```json
{
  "error": "All fields are required." // 400
}
{
  "error": "Invalid email address format." // 400
}
{
  "error": "Too many requests. Please try again in X minutes." // 429
}
```

---

## 🧪 Testing

### Contact Form Testing
1. **Valid submission** - Should send emails to both recipient and auto-reply
2. **Rate limiting** - Send 6+ messages from same IP, should receive 429 error
3. **Input validation** - Try invalid emails, short messages, HTML content
4. **Error handling** - Check error messages are helpful

### SEO Verification
```bash
# Check robots.txt
curl http://localhost:3000/robots.txt

# Check sitemap
curl http://localhost:3000/sitemap.xml

# Check meta tags in source
# Open browser devtools and inspect <head> section
```

### Accessibility Testing
- Tab through form with keyboard only
- Use screen reader (NVDA, JAWS, or VoiceOver)
- Verify all sections have aria-labels

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete installation & troubleshooting guide
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Detailed implementation notes
- **[CHANGES_COMPLETED.md](./CHANGES_COMPLETED.md)** - Summary of all improvements

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `NEXT_PUBLIC_BASE_URL` (optional, for custom domain)
4. Deploy (automatic on push)

### Other Platforms

Set environment variables in your deployment platform:
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

Then run:
```bash
npm run build
npm start
```

---

## 🎓 What I Learned Building This

This portfolio demonstrates practical knowledge in:

- **Full-stack development** - From API design to responsive UI
- **Security best practices** - Validation, sanitization, rate limiting
- **Performance optimization** - Canvas rendering, image formats, caching
- **SEO & accessibility** - Standards compliance and search visibility
- **DevOps basics** - Environment configuration, deployment
- **Code quality** - TypeScript, linting, proper error handling

---

## 🔄 Updates & Improvements

Last Updated: **April 12, 2026**

Recent improvements:
- ✅ Security hardening (email validation, XSS protection, rate limiting)
- ✅ Performance optimization (canvas rendering, image formats)
- ✅ SEO configuration (OG tags, structured data)
- ✅ Accessibility enhancements (ARIA labels, semantic HTML)
- ✅ Comprehensive documentation

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed changelog.

---

## 💼 About Me

**Neel Bhavsar** - Node.js Developer & Backend Architect

- **Experience:** 4+ years building scalable backend systems
- **Expertise:** REST APIs, database optimization, real-time systems
- **Technologies:** Node.js, Express, NestJS, TypeScript, PostgreSQL, MongoDB
- **Current Role:** Senior Developer @ Artoon Solution Pvt Ltd
- **Status:** Open to full-time roles & freelance opportunities

### Connect with Me
- 💼 **LinkedIn:** [/in/neeelbhavsar](https://linkedin.com/in/neeelbhavsar)
- 🐙 **GitHub:** [@neeelbhavsar](https://github.com/neeelbhavsar)
- 📧 **Email:** [neelbhavsar124@gmail.com](mailto:neelbhavsar124@gmail.com)
- 🌐 **Website:** [portfolio.neelbhavsar.dev](https://portfolio.neelbhavsar.dev)

---

## 📄 License

MIT License - feel free to use this portfolio as a template for your own!

---

## 🤝 Contributing

This is a personal portfolio, but if you find bugs or have suggestions:

1. Open an issue
2. Describe the problem or suggestion
3. Include relevant details

---

<div align="center">

**Made with ❤️ by Neel Bhavsar**

⭐ If you like this project, please consider giving it a star!

</div>
