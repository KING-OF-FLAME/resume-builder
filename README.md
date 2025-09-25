# 📄 ATS-friendly resume builder

A single, ultra-polished, and visually stunning ATS-friendly resume builder. This tool empowers users to effortlessly create professional resumes optimized for Applicant Tracking Systems, ensuring their applications stand out to recruiters. Built entirely with **Vanilla HTML, CSS, and PHP**, it offers a seamless, interactive experience without external JavaScript libraries or complex frameworks.

<p align="center">
  <img src="https://i.ibb.co/9ktMTbWP/make-a-logo-for-resume-builder.jpg" alt="Resume Builder Screenshot" width="200"> 
  <br>
  <i>(A glimpse of the modern UI and live preview in action)</i>
</p>

[![Repo Size](https://img.shields.io/github/repo-size/your-username/your-repo-name?style=flat-square&color=orange)](https://github.com/your-username/your-repo-name)
[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/your-username/your-repo-name)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/your-username/your-repo-name/graphs/commit-activity)

-------------------------------------------------

## 🌟 About The Project 📍

The AI Powered ATS Resume Builder is designed to simplify the resume creation process, making it intuitive, fast, and highly effective. It addresses the critical need for resumes that are not only visually appealing but also easily parsed by Applicant Tracking Systems (ATS) used by companies globally.

This project showcases:
* **Vanilla Stack Prowess**: Built purely with HTML, CSS, JavaScript, and PHP, demonstrating robust functionality without heavy frameworks.
* **ATS Optimization**: The generated PDF is carefully structured to ensure maximum compatibility and readability for automated systems.
* **Stunning UI/UX**: A modern, professional interface with real-time updates, animations, and responsive design for both desktop and mobile users.
* **Server-Side PDF Generation**: Utilizes PHP and the FPDF library for reliable, pixel-perfect PDF output, overcoming browser rendering inconsistencies.

-------------------------------------------------

### 🚀 Getting Started

To get this Resume Builder up and running on your local machine, you'll need a web server environment that supports PHP (like XAMPP, WAMP, or MAMP).

1.  **Clone the repository**:
    * Open your command line or terminal.
    * Navigate to your web server's document root (e.g., `cd E:\xampp\htdocs` for XAMPP users).
    * Run the command: `git clone https://github.com/your-username/your-repo-name.git resume-builder`.
        *(Replace `your-username/your-repo-name` with your actual GitHub repository path)*

2.  **Download FPDF Library**:
    * Go to the official FPDF website: [https://www.fpdf.org/en/download.php](https://www.fpdf.org/en/download.php)
    * Download the latest version (e.g., `fpdf186.zip`).
    * Unzip the downloaded file. You'll find a folder (e.g., `fpdf186`).
    * **Rename this folder to `fpdf`**.
    * Place this `fpdf` folder directly inside your `resume-builder` project directory.
        *Your project structure should look like this:*
        ```
        /resume-builder/
        |-- index.html
        |-- style.css
        |-- script.js
        |-- generate-pdf.php
        |-- /fpdf/                 <-- The FPDF library folder
            |-- fpdf.php
            |-- ... (other FPDF files)
        ```

3.  **Start your Web Server**:
    * Open your XAMPP/WAMP/MAMP Control Panel.
    * Ensure the **Apache** service is running (it should be green). If not, click 'Start'.

4.  **Access the Application**:
    * Open your web browser.
    * Navigate to `http://localhost/resume-builder/` (or your specific local server path).

Start building your professional resume!

-------------------------------------------------

## ✨ Features 📍

* **Real-Time Preview**: See your resume update instantly as you type.
* **Comprehensive Sections**: Includes personal info, contact, summary, work experience, projects, education, skills, certifications, achievements, and languages.
* **ATS-Friendly PDF**: Generates a clean, well-structured PDF highly optimized for Applicant Tracking Systems.
* **Professional Design**: Features a modern, minimalist two-column layout for maximum impact and readability.
* **Responsive UI**: Works seamlessly across desktop and mobile devices.
* **Vanilla Tech Stack**: Built with pure HTML, CSS, JavaScript, and PHP (using FPDF for PDF generation) – no heavy frameworks or external JS libraries.
* **Pre-filled Sample Data**: Provides sample data on load for quick testing and inspiration.

-------------------------------------------------

## 💡 Usage 📍

1.  **Fill the Form**: Enter your personal details, experience, education, skills, and other information into the intuitive form fields on the left.
2.  **Live Update**: Watch your resume transform in the live preview on the right.
3.  **Download PDF**: Click the "Download PDF" button to generate and download your ATS-ready resume.

-------------------------------------------------

## 🤝 Contributions 📍

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have suggestions for improving this project, please fork the repo and create a pull request. You can also open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-------------------------------------------------

## 📧 Contact 📍
## Contact 📍

Github: [KING OF FLAME](https://github.com/KING-OF-FLAME) - Creator and Maintainer
Instagram: [yash.developer](https://instagram.com/yash.developer)

*(Please replace `your-username`, `your-repo-name`, and `your.instagram.handle` with your actual details.)*

-------------------------------------------------

## 🙏 Acknowledgments 📍

* Special thanks to the developers of **FPDF Library** for robust PDF generation.
* To the open-source community for continuous inspiration and learning.
