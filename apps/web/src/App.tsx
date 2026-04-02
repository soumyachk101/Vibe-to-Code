import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import Gallery from './pages/Gallery'
import Auth from './pages/Auth'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}
