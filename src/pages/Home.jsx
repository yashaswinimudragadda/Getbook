import { useState } from 'react';
import booksData from '../data/data.json';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate(); // Initialize the navigation function
  const [searchTerm, setSearchTerm] = useState("");

  // Live Search Logic: Filters data in real-time as the user types
  // Added optional chaining (?.) to prevent errors if title or author is missing
  const filteredBooks = booksData.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleExchangeClick = (book) => {
    // 1. Check if the user has already uploaded their 5 books
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      // If logged in, go to the dashboard or exchange details
      navigate('/dashboard', { state: { selectedBook: book } });
    } else {
      // If not logged in, alert them and redirect to Login
      alert("Please login and upload 5 books to view exchange details!");
      
      // Optional: Save the book they were interested in to sessionStorage
      sessionStorage.setItem("pendingBook", JSON.stringify(book));
      
      navigate('/login'); // This links to your login page
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* Search Header Section */}
      <div style={headerStyle}>
        <h1 style={{ color: '#2c3e50' }}>📚 Book Exchange Library</h1>
        <p style={{ color: '#7f8c8d' }}>Find and swap your favorite stories</p>
        <div style={searchBoxContainer}>
          <input 
            type="text" 
            placeholder="Search by book title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchFieldStyle}
          />
        </div>
      </div>

      {/* Books Display Grid */}
      <div style={gridStyle}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} style={cardStyle}>
              <div style={imagePlaceholder}>
                <img 
                  src={book.img || 'https://via.placeholder.com/150'} 
                  alt={book.title} 
                  style={imgStyle} 
                />
              </div>
              <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#2c3e50' }}>
                {book.title}
              </h3>
              <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>By: {book.author}</p>
              <button style={actionBtnStyle}
              onClick={() => handleExchangeClick(book)}
              >Exchange Info</button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', marginTop: '50px' }}>
             <h3 style={{ color: '#e74c3c' }}>
               Sorry! We couldn't find any books matching your search.
             </h3>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const headerStyle = { textAlign: 'center', marginBottom: '40px' };
const searchBoxContainer = { display: 'flex', justifyContent: 'center', marginTop: '20px' };
const searchFieldStyle = {
  width: '60%', 
  padding: '15px 25px', 
  borderRadius: '30px',
  border: '2px solid #3498db', 
  fontSize: '16px', 
  outline: 'none',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};
const gridStyle = {
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '25px', 
  maxWidth: '1200px', 
  margin: '0 auto'
};
const cardStyle = {
  backgroundColor: '#fff', 
  padding: '15px', 
  borderRadius: '15px',
  boxShadow: '0 8px 15px rgba(0,0,0,0.1)', 
  textAlign: 'center',
  transition: 'transform 0.2s ease' // Added for a smoother feel
};
const imgStyle = { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' };
const imagePlaceholder = { backgroundColor: '#eee', height: '200px', borderRadius: '10px' };
const actionBtnStyle = {
  marginTop: '15px', 
  padding: '10px 20px', 
  backgroundColor: '#3498db',
  color: '#fff', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Home;