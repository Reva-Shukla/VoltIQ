import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FleetProvider } from './contexts/FleetContext';
import { RootLayout } from './layouts/RootLayout';

import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <FleetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="features" element={<Features />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="about" element={<About />} />
              <Route path="team" element={<Team />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FleetProvider>
    </ThemeProvider>
  );
};

export default App;
