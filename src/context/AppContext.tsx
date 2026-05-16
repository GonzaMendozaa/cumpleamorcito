'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { CONFIG } from '@/config'
import type { AppContent } from '@/types'
import { supabase } from '@/lib/supabase'

const defaultContent: AppContent = {
  nombre:    CONFIG.nombre,
  carta:     { parrafos: CONFIG.carta.parrafos, firma: CONFIG.carta.firma },
  fotos:     CONFIG.fotos,
  regalo:    CONFIG.regalo,
  canciones: CONFIG.canciones,
}

interface AppContextType {
  content:          AppContent
  isOwner:          boolean
  showLogin:        boolean
  loading:          boolean
  setContent:       (fn: (prev: AppContent) => AppContent) => void
  login:            (password: string) => boolean
  logout:           () => void
  openLogin:        () => void
  closeLogin:       () => void
  generateShareUrl: () => string
}

const Ctx = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [content,   setContentState] = useState<AppContent>(defaultContent)
  const [isOwner,   setIsOwner]      = useState(false)
  const [showLogin, setShowLogin]    = useState(false)
  const [loading,   setLoading]      = useState(true)

  // Refs para evitar closures viejas en setContent (que está memoizado)
  const isOwnerRef = useRef(false)
  const saveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Carga contenido: primero mira el hash de URL, luego Supabase
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(hash))) as AppContent
        setContentState(decoded)
      } catch { /* hash inválido, ignorar */ }
      setLoading(false)
      return
    }

    supabase
      .from('content')
      .select('data')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.data) {
          setContentState(data.data as AppContent)
        }
        setLoading(false)
      })
  }, [])

  // Restaura sesión de propietario
  useEffect(() => {
    if (sessionStorage.getItem('owner_auth') === 'true') {
      setIsOwner(true)
      isOwnerRef.current = true
    }
  }, [])

  const setContent = useCallback((fn: (prev: AppContent) => AppContent) => {
    setContentState(prev => {
      const next = fn(prev)

      // Auto-guarda en Supabase con debounce de 1 s (solo si es owner)
      if (isOwnerRef.current) {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
          supabase
            .from('content')
            .upsert({ id: 1, data: next, updated_at: new Date().toISOString() })
            .then(() => {})
        }, 1000)
      }

      return next
    })
  }, [])

  function login(password: string): boolean {
    if (password === CONFIG.ownerPassword) {
      sessionStorage.setItem('owner_auth', 'true')
      setIsOwner(true)
      isOwnerRef.current = true
      setShowLogin(false)
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem('owner_auth')
    setIsOwner(false)
    isOwnerRef.current = false
  }

  function generateShareUrl(): string {
    const encoded = encodeURIComponent(btoa(JSON.stringify(content)))
    return `${window.location.origin}/#${encoded}`
  }

  return (
    <Ctx.Provider value={{
      content, isOwner, showLogin, loading,
      setContent, login, logout,
      openLogin:  () => setShowLogin(true),
      closeLogin: () => setShowLogin(false),
      generateShareUrl,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
