import { CalendarDays, HeartHandshake, House, ShoppingBasket, Smartphone, Sparkles, Wrench } from 'lucide-react'

export const services = [
  { id: 'groceries', name: 'Groceries & pharmacy', description: 'Shopping, prescriptions and essential errands.', icon: ShoppingBasket },
  { id: 'cleaning', name: 'Cleaning & home care', description: 'Light cleaning and practical help at home.', icon: Sparkles },
  { id: 'companionship', name: 'Companionship visits', description: 'A friendly visit, walk or chat nearby.', icon: HeartHandshake },
  { id: 'appointments', name: 'Appointment escort', description: 'Company and transport support for appointments.', icon: CalendarDays },
  { id: 'technology', name: 'Technology help', description: 'Phones, computers, video calls and devices.', icon: Smartphone },
  { id: 'home-repairs', name: 'Small home tasks', description: 'Light household tasks and small repairs.', icon: Wrench },
  { id: 'transport', name: 'Rides & transport', description: 'Help getting safely around your area.', icon: House },
] as const

export type ServiceId = (typeof services)[number]['id']
export const getService = (id: string | null | undefined) => services.find((service) => service.id === id)
