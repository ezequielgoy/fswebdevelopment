
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <main>
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<h1>Admin</h1>} />

        </Routes>
        </BrowserRouter>
      </main>
      </header>
    </div>
  );
}

export default App;
