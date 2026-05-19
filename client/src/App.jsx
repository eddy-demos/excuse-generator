import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import { ToastProvider } from './components/Toast.jsx';
import GeneratePage from './pages/GeneratePage.jsx';
import ManagePage from './pages/ManagePage.jsx';
import ExcuseForm from './pages/ExcuseForm.jsx';

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/new" element={<ExcuseForm />} />
            <Route path="/edit/:id" element={<ExcuseForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}
