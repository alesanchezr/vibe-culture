"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/AuthProvider"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Submit Event", path: "/submit-event" },
  ]

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
    router.refresh()
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">VibeCulture</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <p>Loading user...</p>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">VibeCulture</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.path ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <form className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search events..." className="pl-8 w-full md:w-[200px] lg:w-[300px]" />
          </form>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.email || 'User'} />
                    <AvatarFallback>{user.email ? user.email[0].toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 px-4 md:px-6">
            <form className="relative w-full mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search events..." className="pl-8 w-full" />
            </form>
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-accent",
                    pathname === item.path ? "bg-accent" : "",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <>
                  <Link href="/auth/login" className={cn("flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-accent", pathname === '/auth/login' ? "bg-accent" : "")} onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link href="/auth/signup" className={cn("flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-accent", pathname === '/auth/signup' ? "bg-accent" : "")} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
