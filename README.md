# 📚 GetBook - Book Bartering Platform

**GetBook** is a modern web application designed for users to share books they own with others in exchange for reward points. It encourages community-based book swapping and makes reading more accessible.

**🔗 Live Demo:** [https://getbook-pbog.vercel.app/](https://getbook-pbog.vercel.app/)

---

## 🚀 Features

* **User Registration & Login:** New users can register by uploading 5 books, earning an initial 50 points.
* **Dynamic Dashboard:** View user profile details, book inventory, and point balances in real-time.
* **Inventory Management:** Users can dynamically add new books to their collection. Each successful upload grants +10 points.
* **Exchange Requests:** A dedicated section to 'Accept' or 'Decline' incoming book requests from other users.
* **Base64 Image Processing:** Uses Base64 encoding to handle user-uploaded images, ensuring they persist within the browser session without a backend.
* **Responsive UI:** A clean, modern interface built for a seamless experience across mobile and desktop devices.

---

## 📁 Folder Structure

The project is organized to separate concerns between data, UI components, and page logic:

```text
getbook/
├── public/                 # Static assets
│   └── assets/
│       └── images/         # Default book covers and system icons
├── src/                    # Main source code
│   ├── component/          # Reusable UI components
│   │   ├── AddBookModal.jsx # Logic for adding new books via popup
│   │   └── Navbar.jsx      # Navigation controls
│   ├── data/               # Mock data files
│   │   └── user.json       # Initial database of registered users
│   ├── pages/              # Primary application views
│   │   ├── Login.jsx       # Registration and login flow
│   │   └── Dashboard.jsx   # User inventory and request management
│   ├── App.js              # Main routing and entry point
│   └── index.js            # React DOM rendering file
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
