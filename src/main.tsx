import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from '@/components/toast/ToastManager.tsx'
import routers from '@/router'
import { store, persistor } from './store'
import './index.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>loading...</div>} persistor={persistor}>
        <RouterProvider router={routers}></RouterProvider>
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
)
