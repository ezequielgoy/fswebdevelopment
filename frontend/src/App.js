
import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import UserInfoPage from './pages/UserInfoPage.tsx';
import AdminPage from './pages/AdminPage.jsx';
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <main>
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/order/:name" element={<OrderPage />} />
          <Route path="/viewOrder/:name" element={<UserInfoPage />} />
        </Routes>
        </BrowserRouter>
      </main>
      </header>
    </div>
  );
}

export default App;
