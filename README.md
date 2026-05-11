📚 Book Exchange Portal
A full-stack web application designed to facilitate book sharing and bartering within a community. Users can list their books, earn points for sharing, and request exchanges with others.

Live Demo: https://getbook-pbog.vercel.app/

✨ Features
Dynamic Registration: New users register by uploading 5 books to earn their initial 50 points.

Inventory Management: Users can add new books to their collection dynamically using Base64 image encoding for persistence.

Gamified Exchange: Earn +10 Points for every book added and every exchange request accepted.

Real-time Dashboard: A centralized view for managing your collection, tracking points, and responding to exchange requests.

Responsive UI: Built with modern CSS-in-JS and React functional components for a smooth user experience.

🛠️ Tech Stack
Frontend: React.js (Functional Components, Hooks).

Routing: React Router DOM.

State Management: useState, useEffect, and sessionStorage for persistence.

Styling: Inline JavaScript Styles (CSS-in-JS).

Backend (In Transition): Java, Servlets, and Spring MVC.

📂 Folder Structure
Plaintext
getbook-portal/
├── public/                 # Static assets
│   └── assets/
│       └── images/         # Hardcoded local images (e.g., logos, icons)
├── src/                    # Source code
│   ├── component/          # Reusable UI components
│   │   ├── AddBookModal.jsx# Modal for adding new books with Base64 upload
│   │   └── Sidebar.jsx     # Navigation and profile summary
│   ├── data/
│   │   └── user.json       # Mock database for existing users
│   ├── pages/
│   │   ├── Login.jsx       # Multi-step login and registration logic
│   │   └── Dashboard.jsx   # Main user interface and request management
│   ├── App.js              # Root component and route definitions
│   └── index.js            # Entry point
├── .gitignore
├── package.json            # Project dependencies and scripts
└── README.md
🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

npm or yarn

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/getbook-portal.git
Navigate to the directory:

Bash
cd getbook-portal
Install dependencies:

Bash
npm install
Start the development server:

Bash
npm start
📖 Usage Note on Images
This project uses a hybrid image loading strategy:

Legacy Data: Images from user.json are served via the public/assets/images folder.

Dynamic Data: Newly added books use Base64 Encoding via the FileReader API to ensure images persist across page refreshes within the sessionStorage.

Developed by: Yashaswini Mudragadda
