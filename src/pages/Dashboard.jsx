import { useEffect, useState } from 'react'; // Fixed: Removed unused 'React' import
import { useNavigate } from 'react-router-dom';
import AddBookModal from '../component/AddBookModal';

const Dashboard = () => {
  const navigate = useNavigate();

  // FIX: Lazy Initialization handles the data retrieval logic during the initial state setup.
  // This prevents the "cascading render" error by avoiding a setState call inside useEffect.
  const [user, setUser] = useState(() => {
    const savedData = sessionStorage.getItem("userProfile");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Ensure points exist based on current inventory if they aren't already set
      if (parsedData.points === undefined) {
        parsedData.points = (parsedData.books ? parsedData.books.length : 0) * 10;
        sessionStorage.setItem("userProfile", JSON.stringify(parsedData));
      }
      return parsedData;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This useEffect now only handles navigation/protection logic
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      navigate('/');
    }
  };

  const addNewBook = (bookInfo) => {
    const updatedUser = {
      ...user,
      books: [...user.books, { ...bookInfo, id: Date.now() }],
      points: user.points + 10
    };
    setUser(updatedUser);
    sessionStorage.setItem("userProfile", JSON.stringify(updatedUser));
    setIsModalOpen(false);
  };

  if (!user) return <div style={loaderStyle}>Loading Profile...</div>;

  return (
    <div style={dashboardLayout}>
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
        navigate={navigate}
      />

      <main style={mainContentStyle}>
        <DashboardHeader name={user.name} booksCount={user.books.length} points={user.points} />

        {activeTab === 'inventory' ? (
          <InventorySection 
            books={user.books} 
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            addNewBook={addNewBook}
          />
        ) : (
          <RequestsSection user={user} setUser={setUser} />
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Sidebar = ({ user, activeTab, setActiveTab, handleLogout, navigate }) => (
  <aside style={sidebarStyle}>
    <div style={profileSection}>
      <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
      <h3 style={{ margin: '10px 0 5px' }}>{user.name}</h3>
      <div style={pointsBadge}>🪙 {user.points} Points</div>
    </div>
    <nav style={navStyle}>
      <button style={activeTab === 'inventory' ? navItemActive : navItem} onClick={() => setActiveTab('inventory')}>📂 My Inventory</button>
      <button style={activeTab === 'requests' ? navItemActive : navItem} onClick={() => setActiveTab('requests')}>📩 Exchange Requests</button>
      <button style={navItem} onClick={() => navigate('/')}>🔍 Browse Books</button>
      <button style={logoutBtn} onClick={handleLogout}>🚪 Logout</button>
    </nav>
  </aside>
);

const DashboardHeader = ({ name, booksCount, points }) => (
  <header style={mainHeader}>
    <div>
      <h2 style={{ margin: 0 }}>Hello, {name.split(' ')[0]}! 👋</h2>
    </div>
    <div style={statsContainer}>
      <StatCard label="Books Shared" value={booksCount} color="#3498db" />
      <StatCard label="Points Balance" value={points} color="#f39c12" />
    </div>
  </header>
);

const StatCard = ({ label, value, color }) => (
  <div style={statCard}>
    <span style={{ color: color, fontSize: '24px', fontWeight: 'bold' }}>{value}</span>
    <p style={statLabel}>{label}</p>
  </div>
);

const InventorySection = ({ books, setIsModalOpen, isModalOpen, addNewBook }) => (
  <section style={fadeIn}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3>Your Collection</h3>
      <button onClick={() => setIsModalOpen(true)} style={addMoreBtn}>+ Add New Book</button>
    </div>
    
    <AddBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddBook={addNewBook} 
    />

    <div style={bookGrid}>
      {books.map((book, index) => (
        <div key={index} style={bookCard}>
          <img 
             src={
               // 1. Base64 (కొత్త యూజర్ అప్‌లోడ్ చేసినవి) అయితే నేరుగా వాడు
               book.image.startsWith('data:image') 
                 ? book.image 
                 : (
                     // 2. పాత పాత్ అయితే ఫైల్ పేరును తీసుకుని public ఫోల్డర్ నుండి వెతుకు
                     book.image.includes('/') 
                       ? `/assets/images/${book.image.split('/').pop()}` 
                       : `/assets/images/${book.image}`
                   )
             } 
             alt={book.title} 
             style={bookImg} 
             // 3. ఇమేజ్ లోడ్ అవ్వకపోతే డీఫాల్ట్ ఇమేజ్ చూపిస్తుంది
             onError={(e) => {
               e.target.src = "https://via.placeholder.com/150?text=No+Image";
             }}
           />
          <div style={{ padding: '12px' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '15px' }}>{book.title}</h4>
            <span style={tagStyle}>Value: 10 Pts</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const RequestsSection = ({ user, setUser }) => {
  // 1. సెట్ రిక్వెస్ట్స్ (setRequests) ని యాడ్ చేసాము
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      from: "John Doe", 
      book: user.books && user.books.length > 0 ? user.books[0].title : "A Shared Book" 
    },
    { 
      id: 2, 
      from: "Jane Smith", 
      book: "React Guide" 
    }
  ]);

  // 2. రిక్వెస్ట్ యాక్సెప్ట్ చేసినప్పుడు
  const handleAccept = (requestId) => {
    // పాయింట్లు పెంచడం
    const updatedUser = { 
      ...user, 
      points: (user.points || 0) + 10 
    };

    setUser(updatedUser);
    sessionStorage.setItem("userProfile", JSON.stringify(updatedUser));

    // లిస్ట్ నుండి ఆ రిక్వెస్ట్‌ను తొలగించడం
    setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    
    alert(`Request Accepted! 10 points added to your balance.`);
  };

  // 3. రిక్వెస్ట్ డిక్లైన్ చేసినప్పుడు
  const handleDecline = (requestId) => {
    if (window.confirm("Are you sure you want to decline this request?")) {
      // పాయింట్లు పెంచకుండా కేవలం లిస్ట్ నుండి తొలగించడం
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    }
  };

  return (
    <section style={fadeIn}>
      <h3 style={{ borderBottom: '2px solid #3498db', display: 'inline-block', paddingBottom: '5px' }}>
        Exchange Requests
      </h3>
      
      {requests.length > 0 ? (
        requests.map(req => (
          <div key={req.id} style={requestCardStyle}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>{req.from}</strong> wants to borrow: <span style={{ color: '#2980b9' }}>"{req.book}"</span>
            </p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleAccept(req.id)} 
                style={acceptBtn}
              >
                Accept (+10 Pts)
              </button>
              
              <button 
                onClick={() => handleDecline(req.id)} 
                style={declineBtn}
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: '20px', color: '#7f8c8d', fontStyle: 'italic' }}>
          No pending requests at the moment.
        </div>
      )}
    </section>
  );
};
// --- Styles ---
const fadeIn = { animation: 'fadeIn 0.5s ease-in' };
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' };
const dashboardLayout = { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Segoe UI', Roboto, sans-serif" };
const sidebarStyle = { width: '280px', backgroundColor: '#1a252f', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px', position: 'fixed', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' };
const profileSection = { textAlign: 'center', paddingBottom: '25px', borderBottom: '1px solid #34495e', marginBottom: '25px' };
const avatarStyle = { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', border: '3px solid #fff' };
const pointsBadge = { backgroundColor: '#f39c12', padding: '6px 15px', borderRadius: '20px', fontSize: '14px', display: 'inline-block' };
const navStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const navItem = { padding: '12px 15px', textAlign: 'left', backgroundColor: 'transparent', color: '#bdc3c7', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s', fontSize: '15px' };
const navItemActive = { ...navItem, backgroundColor: '#3498db', color: '#fff', transform: 'translateX(5px)' };
const logoutBtn = { ...navItem, marginTop: 'auto', color: '#e74c3c', borderTop: '1px solid #34495e', borderRadius: '0' };
const mainContentStyle = { flex: 1, padding: '40px', marginLeft: '280px' };
const mainHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' };
const statsContainer = { display: 'flex', gap: '15px' };
const statCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', minWidth: '130px' };
const statLabel = { fontSize: '12px', color: '#95a5a6', textTransform: 'uppercase', marginTop: '5px', fontWeight: '600' };
const bookGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '25px' };
const bookCard = { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 15px rgba(0,0,0,0.06)', transition: 'transform 0.3s hover' };
const bookImg = { width: '100%', height: '160px', objectFit: 'cover' };
const tagStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
const addMoreBtn = { padding: '10px 20px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(39,174,96,0.3)' };
const requestCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', borderLeft: '5px solid #3498db' };
const acceptBtn = { padding: '8px 15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const declineBtn = { padding: '8px 15px', backgroundColor: '#f8d7da', color: '#721c24', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Dashboard;