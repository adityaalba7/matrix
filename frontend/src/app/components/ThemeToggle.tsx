import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-white/10 transition-colors border border-white/5 text-[#c9c4d8] hover:text-[#e3e1ef] relative inline-flex items-center justify-center overflow-hidden w-10 h-10 focus:outline-none focus:ring-2 focus:ring-primary/50 shrink-0"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden text-amber-400" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:block hidden text-[#c9bfff]" />
    </button>
  )
}
