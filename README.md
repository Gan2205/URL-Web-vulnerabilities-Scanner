# ThreatLens - Web Vulnerability Scanner

A professional web vulnerability scanner designed for SMBs and developers to detect security flaws in web applications.

## Features

- **Comprehensive Vulnerability Detection**
  - SQL Injection (SQLi) testing
  - Cross-Site Scripting (XSS) detection
  - Directory Traversal vulnerability scanning
  - Security header analysis
  - Information disclosure detection

- **Professional Reporting**
  - Detailed PDF reports with vulnerability descriptions
  - Severity-based categorization (Critical, High, Medium, Low)
  - Remediation recommendations
  - Executive summary and technical details

- **Modern Web Interface**
  - Clean, responsive design
  - Real-time scan progress
  - Interactive results display
  - Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd threatlens
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Target URL**: Input the website URL you want to scan
2. **Start Scan**: Click "Start Scan" to begin vulnerability assessment
3. **Review Results**: View detected vulnerabilities with severity levels
4. **Generate Report**: Download a professional PDF report

## Security Features

### SQL Injection Detection
- Tests common SQL injection payloads
- Detects database error patterns
- Parameter-based testing

### XSS Vulnerability Scanning
- Form field testing with XSS payloads
- Reflected XSS detection
- Multiple payload variations

### Security Headers Analysis
- Missing security headers detection
- Server information disclosure
- HTTPS configuration analysis

### Directory Traversal Testing
- Path traversal payload testing
- File system access detection
- Common file pattern recognition

## API Endpoints

- `POST /api/scan` - Perform vulnerability scan
- `POST /api/report` - Generate PDF report

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Vulnerability Testing**: Axios, Cheerio
- **Report Generation**: jsPDF
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This tool is for authorized security testing only. Always ensure you have permission to test the target website. The authors are not responsible for any misuse of this software.
