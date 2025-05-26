
import './App.css'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './pages/Dashboard'
import UploadClaim from './pages/Uploadclaim'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import { Routes, Route, Navigate } from 'react-router-dom'
function App() {

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadClaim />} />    
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} /> 
        <Route path="/profile" element={<Profile />} />

      </Routes>
      
  
  )
}

export default App
