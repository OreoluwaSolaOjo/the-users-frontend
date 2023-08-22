import React, { useState } from 'react';
import Login from './components/Login';
import InputForm from './components/InputForm';
import PercentageCalculator from './components/PercentageCalculator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { config } from './firebase';
import AuthRoute from './components/AuthRoute';
import AdminPage from './components/Admin';


initializeApp(config.firebaseConfig);
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  return (
    // <div className="App">
    //     {!loggedIn && <Login onLogin={() => setLoggedIn(true)} />}
    //     {loggedIn && !formData && <InputForm onFormSubmit={(data) => setFormData(data)} />}
    //     {formData && <PercentageCalculator numOfUsers={formData.numOfUsers} numOfProducts={formData.numOfProducts} />}
    // </div>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Login />
          }
        />
        <Route path="/" element={<AuthRoute>
          <InputForm onFormSubmit={(data) => setFormData(data)} />
        </AuthRoute>} />
        <Route path="/admin" element={<AuthRoute>
          <AdminPage  />
        </AuthRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
