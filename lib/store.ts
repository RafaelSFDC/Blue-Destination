"use client"

import { proxy } from "valtio"
import type { User } from "./types"

// Tipos
export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  date: Date
  type: "info" | "success" | "warning" | "error"
}

export interface Favorite {
  id: string
  type: "destination" | "package"
  date: Date
}

export interface UserPreferences {
  currency: string
  language: string
}

// Estado inicial
export interface State {
  auth: {
    user: User | null
  }
  notifications: Notification[]
  favorites: Favorite[]
  ui: {
    sidebarOpen: boolean
  }
  searchFilters: {
    destination: string
    travelers: number
    dates: {
      start: Date | null
      end: Date | null
    }
  }
}

// Estado inicial com valores padrão
export const state = proxy<State>({
  auth: {
    user: {
      id: "",
      name: "Administrador",
      email: "admin@bluedestination.com",
      role: "admin",
      isLoggedIn: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  notifications: [
    {
      id: "1",
      title: "Bem-vindo!",
      message: "Bem-vindo ao Blue Destination. Comece a explorar agora!",
      read: false,
      date: new Date(),
      type: "info",
    },
    {
      id: "2",
      title: "Promoção de Verão",
      message: "Aproveite nossos pacotes com até 30% de desconto!",
      read: false,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      type: "success",
    },
  ],
  favorites: [],
  ui: {
    sidebarOpen: false,
  },
  searchFilters: {
    destination: "",
    travelers: 1,
    dates: {
      start: null,
      end: null,
    },
  },
})

// Ações
export const actions = {
  // Ações do usuário
  login: (user: User) => {
    state.auth.user = user
  },
  logout: () => {
    state.auth.user = {
      id: "",
      name: "",
      email: "",
      role: "user",
      isLoggedIn: false,
      avatar: null
    }
  },

  // Ações de notificações
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => {
    const id = Math.random().toString(36).substring(2, 9)
    state.notifications.unshift({
      ...notification,
      id,
      date: new Date(),
      read: false,
    })
  },
  markNotificationAsRead: (id: string) => {
    const notification = state.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  },
  markAllNotificationsAsRead: () => {
    state.notifications.forEach((notification) => {
      notification.read = true
    })
  },
  removeNotification: (id: string) => {
    const index = state.notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      state.notifications.splice(index, 1)
    }
  },
  clearNotifications: () => {
    state.notifications = []
  },

  // Ações de favoritos
  toggleFavorite: (id: string, type: "destination" | "package") => {
    const index = state.favorites.findIndex((f) => f.id === id && f.type === type)
    if (index !== -1) {
      state.favorites.splice(index, 1)
    } else {
      state.favorites.push({
        id,
        type,
        date: new Date(),
      })
    }
  },
  isFavorite: (id: string, type: "destination" | "package") => {
    return state.favorites.some((f) => f.id === id && f.type === type)
  },
  removeFavorite: (id: string, type: "destination" | "package") => {
    const index = state.favorites.findIndex((f) => f.id === id && f.type === type)
    if (index !== -1) {
      state.favorites.splice(index, 1)
    }
  },
  clearFavorites: () => {
    state.favorites = []
  },

  // Ações da UI
  toggleSidebar: () => {
    state.ui.sidebarOpen = !state.ui.sidebarOpen
  },
  closeSidebar: () => {
    state.ui.sidebarOpen = false
  },
  // Adicionar ação para atualizar filtros de pesquisa
  updateSearchFilters: (filters: Partial<State["searchFilters"]>) => {
    state.searchFilters = {
      ...state.searchFilters,
      ...filters,
    }
  },
}


