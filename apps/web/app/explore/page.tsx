"use client"

import Link from "next/link"
import { useGetPublicForms } from "~/hooks/api/form"
import { IconLoader2, IconLock, IconArrowRight } from "@tabler/icons-react"
import { Reveal } from "~/components/reveal"

export default function ExplorePage() {
  const { forms, isLoading } = useGetPublicForms(50)

  return (
    <main className="min-h-screen bg-[#FBFBFA] text-[#111111] [font-family:'Geist_Sans','SF_Pro_Display','Helvetica_Neue',sans-serif]">
      {/* Header (same as landing page) */}
      <header className="sticky top-0 z-20 border-b border-[#EAEAEA] bg-[#FBFBFA]/88 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">
            SagaForms
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#787774] md:flex">
            <Link href="/explore" className="text-[#111111] font-medium">
              Explore
            </Link>
            <Link href="/#features" className="hover:text-[#111111]">
              Features
            </Link>
            <Link href="/#pricing" className="hover:text-[#111111]">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-[#111111]">
              Login
            </Link>
          </div>

          <Link
            href="/signup"
            className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333333] active:scale-[0.98]"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-12 md:px-6 md:pt-32 md:pb-16 text-center">
        <Reveal className="max-w-3xl mx-auto">
          <div className="mb-6 w-fit mx-auto rounded-full bg-[#EDF3EC] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#346538]">
            Public Gallery
          </div>
          <h1 className="text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
            Explore community forms.
          </h1>
          <p className="mt-5 text-base leading-[1.65] text-[#787774] md:text-lg">
            Discover public surveys, event registrations, and feedback forms created by the SagaForms community.
          </p>
        </Reveal>
      </section>

      {/* Gallery Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-32 md:px-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 className="h-8 w-8 animate-spin text-[#787774]" />
          </div>
        ) : !forms || forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-[#EAEAEA] bg-white text-center px-4">
            <p className="text-lg font-semibold text-[#111111]">No public forms found.</p>
            <p className="text-sm text-[#787774] mt-2">Check back later or create your own!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form, index) => (
              <Reveal key={form.id} delay={index * 50}>
                <Link
                  href={`/form/${form.slug}`}
                  className="group flex h-full flex-col justify-between rounded-xl border border-[#EAEAEA] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D8D8D8] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] block"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-xl font-semibold tracking-[-0.02em] line-clamp-2">
                        {form.title}
                      </h3>
                      {form.isPasswordProtected && (
                        <div className="rounded-full bg-[#FBF3DB] p-1.5 text-[#956400] shrink-0" title="Password Protected">
                          <IconLock size={16} />
                        </div>
                      )}
                    </div>
                    {form.description ? (
                      <p className="text-sm leading-[1.6] text-[#787774] line-clamp-3">
                        {form.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-[#787774]/60">
                        No description provided.
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-6 flex items-center text-sm font-medium text-[#111111] opacity-60 transition group-hover:opacity-100">
                    View form <IconArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
