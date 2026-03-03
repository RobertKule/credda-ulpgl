// __tests__/unit/components/Navbar.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/shared/Navbar'

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'fr',
  useTranslations: () => (key: string) => key,
}))

// Mock navigation
jest.mock('@/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  usePathname: () => '/',
}))

// Mock SearchModal
jest.mock('@/components/shared/SearchModal', () => ({
  __esModule: true,
  default: () => null,
}))

describe('Navbar Component', () => {
  it('should render brand logo', () => {
    render(<Navbar />)
    expect(screen.getByText('CREDDA.ULPGL')).toBeInTheDocument()
  })

  it('should have navigation links', () => {
    render(<Navbar />)
    
    // Vérifier les liens principaux
    expect(screen.getByText('À Propos')).toBeInTheDocument()
    expect(screen.getByText('Recherche & Clinique')).toBeInTheDocument()
    expect(screen.getByText('Équipe')).toBeInTheDocument()
    expect(screen.getByText('Galerie')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should have language switcher', () => {
    render(<Navbar />)
    
    expect(screen.getByText('FR')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('SW')).toBeInTheDocument()
  })

  it('should have search button', () => {
    render(<Navbar />)
    
    const searchButton = screen.getByRole('button', { name: /recherche/i })
    expect(searchButton).toBeInTheDocument()
  })
})