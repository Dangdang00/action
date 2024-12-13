import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {MainView} from './pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/:id" element={<MainView />} />
      </Routes>
    </BrowserRouter>
  )
}
