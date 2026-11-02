import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { PublicLayout } from './components/public/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Menu } from './pages/public/Menu';
import { PublicEvents } from './pages/public/PublicEvents';
import { Gallery } from './pages/public/Gallery';
import { BookTable } from './pages/public/BookTable';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Dashboard } from './pages/admin/Dashboard';
import { Reservations } from './pages/admin/Reservations';
import { Customers } from './pages/admin/Customers';
import { Tables } from './pages/admin/Tables';
import { Events } from './pages/admin/Events';
import { Inventory } from './pages/admin/Inventory';
import { Sales } from './pages/admin/Sales';
import { Staff } from './pages/admin/Staff';
import { Settings } from './pages/admin/Settings';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: { background: '#171717', border: '1px solid rgba(212,175,55,0.3)', color: '#F5F5F4' }
            }} />
          
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/events" element={<PublicEvents />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reservations" element={<BookTable />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
              <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
              
              <Route index element={<ProtectedRoute module="dashboard"><Dashboard /></ProtectedRoute>} />
              <Route path="reservations" element={<ProtectedRoute module="reservations"><Reservations /></ProtectedRoute>} />
              <Route path="customers" element={<ProtectedRoute module="customers"><Customers /></ProtectedRoute>} />
              <Route path="tables" element={<ProtectedRoute module="tables"><Tables /></ProtectedRoute>} />
              <Route path="events" element={<ProtectedRoute module="events"><Events /></ProtectedRoute>} />
              <Route path="inventory" element={<ProtectedRoute module="inventory"><Inventory /></ProtectedRoute>} />
              <Route path="sales" element={<ProtectedRoute module="sales"><Sales /></ProtectedRoute>} />
              <Route path="staff" element={<ProtectedRoute module="staff"><Staff /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute module="settings"><Settings /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>);

}