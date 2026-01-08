import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="flex min-h-screen items-center justify-center bg-neutral-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-500 mb-4">Semi-Project Initialized!</h1>
                <p className="text-neutral-600">Vite + React 19 + TypeScript + TailwindCSS</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
