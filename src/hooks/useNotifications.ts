import { useEffect, useRef } from 'react'

export function useNotifications() {
  const permissionRef = useRef<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      permissionRef.current = Notification.permission
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((p) => {
          permissionRef.current = p
        })
      }
    }
  }, [])

  const notify = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { icon: '/icon.svg', ...options })
    }
  }

  return { notify }
}
