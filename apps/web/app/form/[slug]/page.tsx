"use client"

import { use, useState } from "react"
import { useGetFormBySlug, useSubmitForm } from "~/hooks/api/form"

// ── Types ──────────────────────────────────────────────────────────────────

type FieldOption = { label: string; value: string }

type FormField = {
  id: string
  label: string
  labelKey: string
  description?: string | null
  placeholder?: string | null
  isRequired: boolean
  orderIndex: string
  fieldType: string
  options?: unknown
  validations?: unknown
  conditionalLogic?: unknown
}

// ── Field renderer ─────────────────────────────────────────────────────────

function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: string
  onChange: (val: string) => void
}) {
  const options = (field.options as FieldOption[] | null) ?? []
  const placeholder = field.placeholder ?? ""

  const baseInput =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"

  switch (field.fieldType) {
    case "TEXTAREA":
      return (
        <textarea
          id={field.id}
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInput} resize-none`}
        />
      )

    case "SELECT":
      return (
        <select
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInput} cursor-pointer`}
        >
          <option value="">Select an option…</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )

    case "RADIO":
      return (
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )

    case "CHECKBOX":
      return (
        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const checked = value.split(",").includes(opt.value)
            return (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={checked}
                  onChange={() => {
                    const current = value ? value.split(",") : []
                    const next = checked
                      ? current.filter((v) => v !== opt.value)
                      : [...current, opt.value]
                    onChange(next.filter(Boolean).join(","))
                  }}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      )

    case "YES_NO":
      return (
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                value === opt
                  ? "border-primary bg-primary text-primary-foreground shadow"
                  : "border-border bg-card text-foreground hover:border-primary/60"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )

    case "RATING":
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(String(star))}
              className={`text-2xl transition-transform hover:scale-110 ${
                Number(value) >= star ? "text-yellow-400" : "text-muted-foreground/30"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      )

    case "DATE":
      return (
        <input
          type="date"
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      )

    case "NUMBER":
      return (
        <input
          type="number"
          id={field.id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      )

    case "EMAIL":
      return (
        <input
          type="email"
          id={field.id}
          placeholder={placeholder || "you@example.com"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      )

    case "PASSWORD":
      return (
        <input
          type="password"
          id={field.id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      )

    case "FILE":
      return (
        <label
          className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-border bg-card py-8 cursor-pointer hover:border-primary/60 transition-colors"
        >
          <svg
            className="mb-2 w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="text-sm text-muted-foreground text-center">
            {value ? (
              <span className="font-medium text-foreground">{value}</span>
            ) : (
              "Click to upload a file"
            )}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      )

    // TEXT + default
    default:
      return (
        <input
          type="text"
          id={field.id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      )
  }
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function FormSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      <div className="h-8 bg-muted rounded-lg w-2/3" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="flex flex-col gap-8 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
      <div className="h-11 bg-muted rounded-lg mt-2" />
    </div>
  )
}

// ── Submitted screen ───────────────────────────────────────────────────────

function SubmittedScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Thank you!</h2>
        <p className="mt-2 text-muted-foreground">
          Your response to <span className="font-medium text-foreground">{title}</span> has been submitted.
        </p>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [password, setPasswordInput] = useState<string>("")
  const [submittedPassword, setSubmittedPassword] = useState<string>("")
  
  const { formData, isLoading, isFetching } = useGetFormBySlug(slug, submittedPassword || undefined)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const setAnswer = (labelKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [labelKey]: value }))
    setErrors((prev) => ({ ...prev, [labelKey]: "" }))
  }

  const {
    submitFormAsync,
    status: submitStatus,
    error: submitError,
    isError: isSubmitError,
  } = useSubmitForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    const newErrors: Record<string, string> = {}

    formData.fields.forEach((field) => {
      if (field.isRequired && !answers[field.labelKey]) {
        newErrors[field.labelKey] = "This field is required"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Transform { labelKey: value } → { fieldId, value }[]
    const values = formData.fields
      .filter((field) => answers[field.labelKey])
      .map((field) => ({
        fieldId: field.id,
        value: answers[field.labelKey]!,
      }))

    try {
      await submitFormAsync({ formId: formData.id, values })
      setSubmitted(true)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-xl">

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

          <div className="px-8 py-8">
            {(isLoading || isFetching) && !formData && <FormSkeleton />}

            {!isLoading && !formData && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <p className="text-lg font-semibold text-foreground">Form not found</p>
                <p className="text-sm text-muted-foreground">
                  This form may not exist or is no longer published.
                </p>
              </div>
            )}

            {formData && formData.isPasswordProtected && (!formData.fields || formData.fields.length === 0) && (
              <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Password Required</h2>
                  <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                    This form is protected. Please enter the password to access it.
                  </p>
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmittedPassword(password)
                  }}
                  className="w-full max-w-sm flex flex-col gap-4 mt-4"
                >
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                  />
                  <button
                    type="submit"
                    disabled={isFetching}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    {isFetching ? "Checking..." : "Unlock Form"}
                  </button>
                  {submittedPassword && !isFetching && (!formData.fields || formData.fields.length === 0) && (
                    <p className="text-sm text-destructive mt-2">Incorrect password.</p>
                  )}
                </form>
              </div>
            )}

            {!isLoading && formData && submitted && (
              <SubmittedScreen title={formData.title} />
            )}

            {!isLoading && formData && !submitted && (!formData.isPasswordProtected || (formData.fields && formData.fields.length > 0)) && (
              <form onSubmit={handleSubmit} noValidate>
                {/* Form header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-foreground leading-tight">
                    {formData.title}
                  </h1>
                  {formData.description && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {formData.description}
                    </p>
                  )}
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-7">
                  {formData.fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      This form has no fields yet.
                    </p>
                  )}

                  {formData.fields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      {/* Label */}
                      <label
                        htmlFor={field.id}
                        className="text-sm font-medium text-foreground flex items-center gap-1"
                      >
                        {field.label}
                        {field.isRequired && (
                          <span className="text-destructive">*</span>
                        )}
                      </label>

                      {/* Description */}
                      {field.description && (
                        <p className="text-xs text-muted-foreground -mt-0.5">
                          {field.description}
                        </p>
                      )}

                      {/* Input */}
                      <FormFieldInput
                        field={field}
                        value={answers[field.labelKey] ?? ""}
                        onChange={(val) => setAnswer(field.labelKey, val)}
                      />

                      {/* Validation error */}
                      {errors[field.labelKey] && (
                        <p className="text-xs text-destructive mt-0.5">
                          {errors[field.labelKey]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit */}
                {formData.fields.length > 0 && (
                  <div className="mt-8 flex flex-col gap-2">
                    {isSubmitError && (
                      <p className="text-sm text-destructive text-center">
                        {submitError?.message ?? "Something went wrong. Please try again."}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitStatus === "pending"}
                      className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {submitStatus === "pending" ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Powered by <span className="font-medium text-muted-foreground">Sagaforms</span>
        </p>

      </div>
    </div>
  )
}
