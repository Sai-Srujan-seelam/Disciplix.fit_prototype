'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Dumbbell, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Trainers', href: '/trainers' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-disciplix-primary to-disciplix-secondary rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-disciplix-primary to-disciplix-secondary bg-clip-text text-transparent">
              Disciplix
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-foreground hover:text-disciplix-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" className="font-semibold">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="font-semibold">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" className="font-semibold shadow-lg hover:shadow-xl" aria-label="Start your free 7-day trial">
                  Start Free Trial
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden",
        mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"
      )}>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-disciplix-primary to-disciplix-secondary rounded-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-disciplix-primary to-disciplix-secondary bg-clip-text text-transparent">
                Disciplix
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-bold text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full font-semibold">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleLogout} className="w-full font-semibold">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full font-semibold">Sign In</Button>
                    </Link>
                    <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="gradient" className="w-full font-semibold" aria-label="Start your free 7-day trial">
                        Start Free Trial
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}