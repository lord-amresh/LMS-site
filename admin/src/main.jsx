import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import {BrowserRouter} from "react-router-dom";


// for clerk
const clerkkey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkkey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
 );
