import Link from "next/link"
import { Reveal } from "~/components/reveal"

const useCases = [
  ["Customer feedback", "Learn what people liked, what felt unclear, and what should change next."],
  ["Event registration", "Collect names, emails, dates, preferences, and special requests in one place."],
  ["Community surveys", "Ask members what they need and keep every answer organized."],
  ["Applications", "Receive structured submissions for programs, clubs, roles, or private groups."],
]

const templates = [
  ["Feedback form", "For reviews, product ideas, and customer follow-up."],
  ["Event signup", "For registrations, attendance, meals, and preferences."],
  ["Waitlist", "For launches, early access, and audience interest."],
  ["Community poll", "For votes, member questions, and planning decisions."],
]

const features = [
  ["Build without code", "Add questions, choices, ratings, dates, and email fields in minutes."],
  ["Share one link", "Send your form by chat, email, social media, or embed it in a page."],
  ["Public or private", "List a form publicly, or keep it hidden for people with the direct link."],
  ["Read clear results", "See responses, popular choices, ratings, and recent submissions."],
]

const pricingPlans = [
  {
    name: "Free",
    price: "Rs 0",
    description: "For trying your first forms.",
    cta: "Start free",
    href: "/register",
    features: {
      Forms: "3",
      "Responses/mo": "100",
      "File uploads": false,
      "Custom themes": false,
      "Email notifications": false,
      Analytics: "Basic",
      "CSV export": false,
      "Custom slug": false,
      "Password protection": false,
      "API access": false,
      "Priority support": false,
    },
  },
  {
    name: "Pro",
    price: "Rs 1000",
    description: "For creators and growing teams.",
    cta: "Choose Pro",
    href: "/register",
    featured: true,
    features: {
      Forms: "Unlimited",
      "Responses/mo": "10,000",
      "File uploads": true,
      "Custom themes": true,
      "Email notifications": true,
      Analytics: "Advanced",
      "CSV export": true,
      "Custom slug": true,
      "Password protection": true,
      "API access": true,
      "Priority support": false,
    },
  },
  {
    name: "Enterprise",
    price: "Rs 4999",
    description: "For teams that need scale and support.",
    cta: "Contact sales",
    href: "/contact",
    features: {
      Forms: "Unlimited",
      "Responses/mo": "Unlimited",
      "File uploads": true,
      "Custom themes": true,
      "Email notifications": true,
      Analytics: "Advanced",
      "CSV export": true,
      "Custom slug": true,
      "Password protection": true,
      "API access": true,
      "Priority support": true,
    },
  },
]

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-right text-[#111111]">{value}</span>
  }

  return (
    <span
      className={[
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium",
        value
          ? "bg-[#EDF3EC] text-[#346538]"
          : "bg-[#F7F6F3] text-[#787774]",
      ].join(" ")}
    >
      {value ? "✓" : "–"}
    </span>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-[#FBFBFA] text-[#111111] [font-family:'Geist_Sans','SF_Pro_Display','Helvetica_Neue',sans-serif]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(149,100,0,0.035),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(31,108,159,0.03),transparent_30%)]" />

      <header className="sticky top-0 z-20 border-b border-[#EAEAEA] bg-[#FBFBFA]/88 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">
            SagaForms
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#787774] md:flex">
            <Link href="/explore" className="text-[#111111] font-medium">
              Explore
            </Link>
            <Link href="#features" className="hover:text-[#111111]">
              Features
            </Link>
            <Link href="#templates" className="hover:text-[#111111]">
              Templates
            </Link>
            <Link href="#pricing" className="hover:text-[#111111]">
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

      <section
        id="hero"
        className="relative mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 gap-12 px-4 py-24 md:grid-cols-[1.08fr_0.92fr] md:px-6 md:py-32"
      >
        <div className="pointer-events-none absolute right-8 top-24 h-72 w-72 rounded-full bg-[#EDF3EC] opacity-60 blur-3xl animate-hero-slow-glow" />

        <Reveal className="flex flex-col justify-center animate-soft-enter">
          <div className="mb-6 w-fit rounded-full bg-[#FBF3DB] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#956400]">
            Form builder for clear answers
          </div>

          <h1 className="max-w-4xl text-5xl font-medium leading-[1.03] tracking-[-0.045em] text-[#111111] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-7xl">
            Create forms people understand and finish.
          </h1>

          <p className="mt-6 max-w-[62ch] text-base leading-[1.65] text-[#2F3437] md:text-lg">
            Build surveys, registrations, feedback forms, and applications in minutes.
            Share one simple link and collect answers from anyone, without making them create an account.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-md bg-[#111111] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#333333] active:scale-[0.98]"
            >
              Create a form
            </Link>
            <Link
              href="#templates"
              className="rounded-md border border-[#EAEAEA] bg-white px-5 py-3 text-center text-sm font-medium text-[#111111] transition hover:bg-[#F7F6F3] active:scale-[0.98]"
            >
              View templates
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="flex items-center animate-soft-enter [animation-delay:160ms]">
          <div className="w-full rounded-xl border border-[#EAEAEA] bg-white">
            <div className="flex h-11 items-center gap-2 border-b border-[#EAEAEA] px-4">
              <span className="size-2.5 rounded-full bg-[#EAEAEA]" />
              <span className="size-2.5 rounded-full bg-[#EAEAEA]" />
              <span className="size-2.5 rounded-full bg-[#EAEAEA]" />
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#787774]">
                    Live form
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Customer feedback
                  </h2>
                </div>
                <span className="rounded-full bg-[#EDF3EC] px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-[#346538]">
                  Public
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    How was your experience?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Excellent", "Good", "Okay", "Poor"].map((item) => (
                      <button
                        key={item}
                        className="rounded-lg border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-3 text-left text-sm transition hover:bg-[#F7F6F3] active:scale-[0.98]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[#EAEAEA] pt-5">
                  <div>
                    <p className="[font-family:'Geist_Mono','SF_Mono',monospace] text-3xl font-semibold">
                      327
                    </p>
                    <p className="mt-1 text-sm text-[#787774]">responses</p>
                  </div>
                  <div>
                    <p className="[font-family:'Geist_Mono','SF_Mono',monospace] text-3xl font-semibold">
                      82%
                    </p>
                    <p className="mt-1 text-sm text-[#787774]">completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative border-y border-[#EAEAEA] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
          <Reveal className="max-w-4xl">
            <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
              Ask better questions without adding more work.
            </h2>
            <p className="mt-5 max-w-[65ch] text-base leading-[1.65] text-[#787774]">
              SagaForms gives you a calm place to create forms, share them, and understand the answers.
              It is made for business owners, event teams, creators, and communities.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
            {useCases.map(([title, text], index) => (
              <Reveal key={title} delay={index * 80}>
                <div className="h-full rounded-xl border border-[#EAEAEA] bg-[#F9F9F8] p-6 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-3 text-sm leading-[1.6] text-[#787774]">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-24 md:grid-cols-[0.8fr_1.2fr] md:px-6 md:py-32">
        <Reveal>
          <div className="rounded-full bg-[#E1F3FE] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#1F6C9F]">
            How it works
          </div>
          <h2 className="mt-5 text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
            From question to decision.
          </h2>
        </Reveal>

        <div className="divide-y divide-[#EAEAEA]">
          {[
            ["01", "Build your form", "Add text, email, rating, choice, date, and longer answer fields."],
            ["02", "Share the link", "Make it public for discovery or private for people with the direct link."],
            ["03", "Collect responses", "Respondents can answer from any device without logging in."],
            ["04", "Read the results", "Review answers, ratings, choices, and recent activity in one dashboard."],
          ].map(([number, title, text], index) => (
            <Reveal key={number} delay={index * 80}>
              <div className="grid grid-cols-[4rem_1fr] gap-4 py-7">
                <span className="[font-family:'Geist_Mono','SF_Mono',monospace] text-sm text-[#787774]">
                  {number}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-2 max-w-[58ch] text-sm leading-[1.65] text-[#787774]">
                    {text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="features" className="relative border-y border-[#EAEAEA] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
          <Reveal className="max-w-4xl">
            <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
              Everything needed to collect answers.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
            {features.map(([title, text], index) => (
              <Reveal key={title} delay={index * 80}>
                <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-7 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-3 text-sm leading-[1.65] text-[#787774]">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="relative mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <Reveal className="max-w-4xl">
          <div className="rounded-full bg-[#FBF3DB] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#956400]">
            Templates
          </div>
          <h2 className="mt-5 text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
            Start with a form that already makes sense.
          </h2>
          <p className="mt-5 max-w-[65ch] text-base leading-[1.65] text-[#787774]">
            Choose a template, change the questions, adjust the look, and publish when you are ready.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_0.9fr]">
          {templates.map(([title, text], index) => (
            <Reveal key={title} delay={index * 80}>
              <div className="rounded-xl border border-[#EAEAEA] bg-white p-7 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-[1.65] text-[#787774]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <Link
            href="#pricing"
            className="mt-10 inline-flex rounded-md bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333] active:scale-[0.98]"
          >
            Compare plans
          </Link>
        </Reveal>
      </section>

      <section id="pricing" className="relative border-y border-[#EAEAEA] bg-[#F7F6F3]">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
          <Reveal className="max-w-4xl">
            <div className="w-fit rounded-full bg-[#EDF3EC] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#346538]">
              Pricing
            </div>

            <h2 className="mt-5 text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
              Simple plans for every form journey.
            </h2>

            <p className="mt-5 max-w-[65ch] text-base leading-[1.65] text-[#787774]">
              Start small, grow with better themes and analytics, then scale with API access,
              password protection and priority support.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 80}>
                <div
                  className={[
                    "flex h-full flex-col rounded-xl border border-[#EAEAEA] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D8D8D8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                    plan.featured ? "bg-[#FBFBFA]" : "",
                  ].join(" ")}
                >
                  {plan.featured ? (
                    <div className="mb-5 w-fit rounded-full bg-[#F7F6F3] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#787774]">
                      Most chosen
                    </div>
                  ) : (
                    <div className="mb-5 h-6" />
                  )}

                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                    {plan.name}
                  </h3>

                  <p className="mt-2 min-h-11 text-sm leading-[1.6] text-[#787774]">
                    {plan.description}
                  </p>

                  <div className="mt-8">
                    <p className="text-5xl font-medium tracking-[-0.05em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif]">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-sm text-[#787774]">per month</p>
                  </div>

                  <div className="my-8 h-px bg-[#EAEAEA]" />

                  <div className="flex-1 space-y-0">
                    {Object.entries(plan.features).map(([feature, value]) => (
                      <div
                        key={feature}
                        className="grid min-h-11 grid-cols-[1fr_auto] items-center gap-4 border-b border-[#EAEAEA] py-3 text-sm transition hover:bg-[#F7F6F3] last:border-b-0"
                      >
                        <span className="text-[#787774]">{feature}</span>
                        <FeatureValue value={value} />
                      </div>
                    ))}
                  </div>

                  <Link
                    href={plan.href}
                    className={[
                      "mt-9 inline-flex w-full justify-center rounded-md px-5 py-3 text-sm font-medium transition active:scale-[0.98]",
                      plan.featured
                        ? "bg-[#111111] text-white hover:bg-[#333333]"
                        : "border border-[#EAEAEA] bg-white text-[#111111] hover:bg-[#F7F6F3]",
                    ].join(" ")}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-[#EAEAEA] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-6 md:py-32">
          <Reveal>
            <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.04em] [font-family:'Newsreader','Instrument_Serif','Playfair_Display',serif] md:text-6xl">
              Public when you want reach. Private when you need control.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-4">
            <Reveal>
              <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-7">
                <span className="rounded-full bg-[#EDF3EC] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#346538]">
                  Public
                </span>
                <p className="mt-5 text-lg font-semibold">Best for open surveys, event signups, polls, and applications.</p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-7">
                <span className="rounded-full bg-[#FDEBEC] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#9F2F2D]">
                  Private link
                </span>
                <p className="mt-5 text-lg font-semibold">Best for client feedback, invite-only events, internal surveys, and private reviews.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#EAEAEA] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-6">
          <div>
            <p className="text-lg font-semibold tracking-[-0.03em]">SagaForms</p>
            <p className="mt-3 max-w-[34ch] text-sm leading-[1.65] text-[#787774]">
              Create forms, share links, and collect responses without complicated setup.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Product</p>
            <div className="mt-3 space-y-2 text-sm text-[#787774]">
              <p><Link href="#features">Features</Link></p>
              <p><Link href="#templates">Templates</Link></p>
              <p><Link href="#pricing">Pricing</Link></p>
              <p><Link href="/login">Login</Link></p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Use cases</p>
            <div className="mt-3 space-y-2 text-sm text-[#787774]">
              <p>Customer feedback</p>
              <p>Event registration</p>
              <p>Applications</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-8 text-sm text-[#787774] md:px-6">
          Copyright 2026 SagaForms. All rights reserved.
        </div>
      </footer>
    </main>
  )
}