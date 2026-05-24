"use client"

import Link from "next/link"
import { useLoggedIn } from "~/hooks/api/auth"

export function AuthHeaderLinks() {
  const { user } = useLoggedIn()

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333333] active:scale-[0.98]"
      >
        Go to Dashboard
      </Link>
    )
  }

  return (
    <>
      <Link href="/login" className="hidden md:block text-sm text-[#787774] hover:text-[#111111]">
        Login
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333333] active:scale-[0.98]"
      >
        Get started
      </Link>
    </>
  )
}
