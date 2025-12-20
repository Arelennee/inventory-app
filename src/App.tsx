import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductForm from './pages/ProductForm';
import ProductList from './pages/ProductList';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<ProductForm />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

