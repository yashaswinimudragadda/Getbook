import { useState } from 'react';

const AddBookModal = ({ isOpen, onClose, onAddBook }) => {
  const [bookData, setBookData] = useState({ title: '', image: '' });

  // 1. ఇమేజ్ ఫైల్‌ను హ్యాండిల్ చేసే ఫంక్షన్
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // ఇమేజ్‌ని Base64 స్ట్రింగ్‌గా మార్చి స్టేట్‌లో సేవ్ చేస్తుంది
        setBookData({ ...bookData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookData.title && bookData.image) {
      onAddBook(bookData); 
      setBookData({ title: '', image: '' }); // ఫీల్డ్స్ క్లియర్ చేయడం
    } else {
      alert("Please enter title and upload an image!");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Add New Book</h3>
          <button onClick={onClose} style={closeX}>&times;</button>
        </div>
        <p style={{ fontSize: '13px', color: '#27ae60', margin: '10px 0' }}>
          Uploading this book will grant you <strong>+10 Points</strong> 🪙
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* టైటిల్ ఇన్‌పుట్ */}
          <div style={inputGroup}>
            <label style={labelStyle}>Book Title</label>
            <input 
              type="text" 
              placeholder="e.g. Atomic Habits" 
              style={modalInput}
              value={bookData.title}
              onChange={(e) => setBookData({...bookData, title: e.target.value})}
              required
            />
          </div>

          {/* ఇమేజ్ అప్‌లోడ్ ఇన్‌పుట్ */}
          <div style={inputGroup}>
            <label style={labelStyle}>Upload Book Cover</label>
            <input 
              type="file" 
              accept="image/*" // కేవలం ఫోటోలు మాత్రమే అనుమతిస్తుంది
              style={modalInput}
              onChange={handleImageChange}
              required
            />
          </div>

          {/* ఇమేజ్ ప్రివ్యూ (యూజర్ అప్‌లోడ్ చేసిన ఫోటో ఇక్కడే కనిపిస్తుంది) */}
          {bookData.image && (
            <div style={previewContainer}>
              <p style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '5px' }}>Preview:</p>
              <img src={bookData.image} alt="Preview" style={previewImg} />
            </div>
          )}

          <div style={modalActions}>
            <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
            <button type="submit" style={submitBtn}>Add Book & Points</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Styles ---
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
const closeX = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#7f8c8d' };
const inputGroup = { marginBottom: '15px' };
const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' };
const modalInput = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' };
const modalActions = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };
const cancelBtn = { padding: '10px 20px', border: 'none', backgroundColor: '#ecf0f1', color: '#7f8c8d', borderRadius: '8px', cursor: 'pointer' };
const submitBtn = { padding: '10px 20px', border: 'none', backgroundColor: '#3498db', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

// Preview Styles
const previewContainer = { textAlign: 'center', margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' };
const previewImg = { width: '80px', height: '110px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' };

export default AddBookModal;