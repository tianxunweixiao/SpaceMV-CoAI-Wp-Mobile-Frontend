import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Toast, { ToastProps } from './index.tsx'

type ToastOptions = Omit<ToastProps, 'onClose'>

const toastContainer = document.createElement('div')
document.body.appendChild(toastContainer)

class ToastManager {
  private static instance: ToastManager | null = null
  private setToast: React.Dispatch<React.SetStateAction<ToastProps | null>> | null = null

  constructor() {
    if (ToastManager.instance) {
      return ToastManager.instance
    }
    ToastManager.instance = this
  }

  public init(setToastState: React.Dispatch<React.SetStateAction<ToastProps | null>>) {
    this.setToast = setToastState
  }

  public show(options: ToastOptions) {
    if (!this.setToast) throw new Error('Toast not initialized')
    this.setToast({
      ...options,
      onClose: () => this.hide()
    })
  }

  public hide() {
    if (!this.setToast) throw new Error('Toast not initialized')
    this.setToast(null)
  }
}

export const ToastContainer: React.FC = () => {
  const [toast, setToast] = useState<ToastProps | null>(null)

  React.useEffect(() => {
    new ToastManager().init(setToast)
  }, [])

  if (!toast) return null

  return ReactDOM.createPortal(<Toast {...toast} />, toastContainer)
}

export const toast = {
  show: (options: ToastOptions) => {
    new ToastManager().show(options)
  },
  success: (message: string, duration?: number) => {
    new ToastManager().show({ message, type: 'success', duration })
  },
  error: (message: string, duration?: number) => {
    new ToastManager().show({ message, type: 'error', duration })
  },
  info: (message: string, duration?: number) => {
    new ToastManager().show({ message, type: 'info', duration })
  },
  warning: (message: string, duration?: number) => {
    new ToastManager().show({ message, type: 'warning', duration })
  }
}
