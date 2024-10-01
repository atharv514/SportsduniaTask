import React, { useState } from 'react';
import CollegeTable from './components/CollegeTable';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
      <div className="page-container">
          <div className="content">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <CollegeTable searchTerm={searchTerm} />
          </div>
      </div>
  );
}
export default App;
