import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Approutes from './routes/Approutes'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 font-mono text-sm overflow-auto">
          {error.message}
        </div>
        <p className="mb-4 text-gray-600">
          There was an error in the application. This might be due to browser storage issues.
          Try the following:
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-600">
          <li>Clear your browser cache and cookies</li>
          <li>Try using a different browser</li>
          <li>Disable browser extensions</li>
          <li>Check if your browser blocks cookies or localStorage</li>
        </ul>
        <button
          onClick={resetErrorBoundary}
          className="w-full py-2 px-4 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

// Custom hook to test localStorage compatibility
function useLocalStorageTest() {
  const [isCompatible, setIsCompatible] = useState(true)
  
  useEffect(() => {
    try {
      // Test if localStorage is available and working
      const testKey = '_test_localStorage_' + Date.now()
      localStorage.setItem(testKey, 'test')
      const testResult = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
      
      if (testResult !== 'test') {
        throw new Error('localStorage test failed')
      }
      
      setIsCompatible(true)
      console.log('localStorage test passed')
    } catch (error) {
      console.error('localStorage test failed:', error)
      setIsCompatible(false)
    }
  }, [])
  
  return isCompatible
}

function App() {
  const isLocalStorageCompatible = useLocalStorageTest()
  
  if (!isLocalStorageCompatible) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Browser Storage Issue</h2>
          <p className="mb-4 text-gray-600">
            This application requires localStorage to function properly, but it appears to be disabled or not working
            in your browser. This can happen due to:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-600">
            <li>Private/Incognito browsing mode</li>
            <li>Browser settings blocking cookies and site data</li>
            <li>Browser extensions</li>
            <li>Storage quota exceeded</li>
          </ul>
          <p className="text-gray-700 font-medium">
            Please try enabling cookies and localStorage in your browser settings, or try a different browser.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the app state here
        window.location.href = '/'
      }}
    >
      <Approutes />
    </ErrorBoundary>
  )
}

export default App
