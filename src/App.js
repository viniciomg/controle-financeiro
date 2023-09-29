import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Atualize a importação

import YearMonthSelector from '././Components/calendar';
import AppLancar from './Pages/applancar/AppLancar';
import Login from './Pages/Login/Login'

function App() {
  return (
    <Router>
      <Routes> {/* Use 'Routes' em vez de 'Switch' */}
        <Route path="/" element={<Login />} />
        <Route path="/Calendar" element={<YearMonthSelector />} />
        <Route path="/AppLancar/:year/:month" element={<AppLancar />} /> {/* Use 'element' para especificar o componente */}
      </Routes>
    </Router>
  );
}

export default App;
