import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // 1. The "Block of Data" State
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    books: [] // Array to hold 5 book objects
  });

  const [currentBook, setCurrentBook] = useState({ title: '', image: null });

  // Handle Input Changes
  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Add Book to the local array
  const addBookToList = () => {
    if (currentBook.title && currentBook.image) {
      if (userData.books.length < 5) {
        setUserData({
          ...userData,
          books: [...userData.books, currentBook]
        });
        setCurrentBook({ title: '', image: null }); // Clear for next book
      }
    } else {
      alert("Please provide both a book title and an image.");
    }
  };

  // Final Submission to Session Storage
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (userData.books.length < 5) {
      alert("You must upload exactly 5 books to proceed!");
      return;
    }

    // Save session data
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userProfile", JSON.stringify(userData));
    
    alert("Login Successful! 5 Books Verified.");
    navigate('/dashboard'); 
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleFinalSubmit}>
        <h2 style={{ textAlign: 'center' }}>Step 2: Register & Upload</h2>
        
        {/* User Info */}
        <div style={inputGroup}>
          <label>Full Name</label>
          <input type="text" name="name" required onChange={handleUserChange} style={inputStyle} />
        </div>
        <div style={inputGroup}>
          <label>Phone Number</label>
          <input type="tel" name="phone" required onChange={handleUserChange} style={inputStyle} />
        </div>

        <hr style={{ margin: '20px 0' }} />

        {/* Book Upload Logic */}
        <h3>Upload Your 5 Books ({userData.books.length}/5)</h3>
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
            onChange={(e) => setCurrentBook({ ...currentBook, image: URL.createObjectURL(e.target.files[0]) })}
            style={{ marginTop: '10px' }}
          />
          <button type="button" onClick={addBookToList} disabled={userData.books.length >= 5} style={addBtnStyle}>
            {userData.books.length >= 5 ? "Limit Reached" : "Add Book"}
          </button>
        </div>

        {/* List of Added Books */}
        <div style={previewGrid}>
          {userData.books.map((book, index) => (
            <div key={index} style={miniCard}>
              <img src={book.image} alt="preview" style={miniImg} />
              <p style={{ fontSize: '10px' }}>{book.title}</p>
            </div>
          ))}
        </div>

        {/* Submit Button - Only active when 5 books are added */}
        <button 
          type="submit" 
          style={userData.books.length === 5 ? submitBtnActive : submitBtnDisabled}
          disabled={userData.books.length < 5}
        >
          Submit & Enter Dashboard
        </button>
      </form>
    </div>
  );
};

// --- Professional Styling ---
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