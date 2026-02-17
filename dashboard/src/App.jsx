import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import { ProjectProvider } from './contexts/ProjectContext';
import Projects from './pages/Projects';
import Overview from './pages/Overview';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import Transactions from './pages/Transactions';
import ApiKeys from './pages/ApiKeys';
import Webhooks from './pages/Webhooks';
import Sandbox from './pages/Sandbox';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Overview />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/api-keys" element={<ApiKeys />} />
                <Route path="/webhooks" element={<Webhooks />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
