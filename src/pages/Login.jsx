import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userDataFromFile from '../data/user.json';

const Login = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    books: [],
    points: 0
  });

  const [currentBook, setCurrentBook] = useState({ title: '', image: null });

  // ఫైల్ ని Base64 గా మార్చే ఫంక్షన్
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result లో Base64 స్ట్రింగ్ ఉంటుంది
      setCurrentBook({ ...currentBook, image: reader.result });
    };
    reader.readAsDataURL(file);
  }
};

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const addBookToList = () => {
    if (currentBook.title && currentBook.image) {
      if (userData.books.length < 5) {
        setUserData({
          ...userData,
          books: [...userData.books, { ...currentBook, id: Date.now() }]
        });
        setCurrentBook({ title: '', image: null }); 
      }
    } else {
      alert("Please provide both a book title and an image.");
    }
  };

 const handleFinalSubmit = (e) => { // async అవసరం లేదు ఎందుకంటే fetch వాడట్లేదు
  e.preventDefault();

  try {
    // 1. fetch కి బదులుగా నేరుగా ఇంపోర్ట్ చేసిన డేటాను వాడండి
    const data = userDataFromFile; 

    // 2. ఫోన్ నంబర్ ద్వారా యూజర్‌ని వెతకడం
    const existingUser = data.users.find(u => u.phone === userData.phone);

    if (existingUser) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userProfile", JSON.stringify(existingUser));
      alert(`Welcome back, ${existingUser.name}!`);
      navigate('/dashboard');
    } else {
      // 3. కొత్త యూజర్ రిజిస్ట్రేషన్ లాజిక్
      if (userData.books.length < 5) {
        alert("New users must upload 5 books to register and earn their first 50 points!");
        return;
      }

      const newUser = {
        ...userData,
        points: userData.books.length * 10,
        id: `user_${Date.now()}`
      };

      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userProfile", JSON.stringify(newUser));
      alert("Registration successful! You earned 50 points.");
      navigate('/dashboard');
    }
  } catch (error) {
    console.error("Error processing user data:", error);
    alert("An error occurred during login.");
  }
};

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleFinalSubmit}>
        <h2 style={{ textAlign: 'center' }}>Step 2: Login or Register</h2>
        
        <div style={inputGroup}>
          <label>Full Name</label>
          <input type="text" name="name" required onChange={handleUserChange} style={inputStyle} />
        </div>
        <div style={inputGroup}>
          <label>Phone Number</label>
          <input type="tel" name="phone" required onChange={handleUserChange} style={inputStyle} />
        </div>

        <hr style={{ margin: '20px 0' }} />

        <h3>New User? Upload 5 Books ({userData.books.length}/5)</h3>
        <div style={uploadBox}>
          <input 
            type="text" 
            placeholder="Book Title" 
            value={currentBook.title}
            onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
            style={inputStyle}
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '10px' }}
          />
          <button type="button" onClick={addBookToList} disabled={userData.books.length >= 5} style={addBtnStyle}>
            {userData.books.length >= 5 ? "Limit Reached" : "Add Book (+10 Pts)"}
          </button>
        </div>

        <div style={previewGrid}>
          {userData.books.map((book, index) => (
            <div key={index} style={miniCard}>
              <img src={book.image} alt="preview" style={miniImg} />
              <p style={{ fontSize: '10px', overflow: 'hidden' }}>{book.title}</p>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          style={userData.phone ? submitBtnActive : submitBtnDisabled}
        >
          {userData.books.length === 5 ? "Register & Enter" : "Check for Existing Account"}
        </button>
      </form>
    </div>
  );
};

// Styles (unchanged)
const containerStyle = { display: 'flex', justifyContent: 'center', padding: '50px', backgroundColor: '#f0f2f5', minHeight: '100vh' };
const formStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' };
const inputGroup = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' };
const uploadBox = { padding: '15px', border: '1px dashed #007bff', borderRadius: '8px', marginBottom: '20px' };
const addBtnStyle = { marginTop: '10px', width: '100%', padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const previewGrid = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' };
const miniCard = { textAlign: 'center', width: '80px', border: '1px solid #eee', padding: '5px' };
const miniImg = { width: '60px', height: '60px', objectFit: 'cover' };
const submitBtnActive = { width: '100%', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const submitBtnDisabled = { width: '100%', padding: '15px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'not-allowed' };

export default Login;