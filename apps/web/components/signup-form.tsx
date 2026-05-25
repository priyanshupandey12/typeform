"use client"

import { useForm } from "react-hook-form"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useSignUpForm } from "~/hooks/api/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import form from "../../../packages/services/form"

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    createUserWithEmailAndPasswordAsync,
    isError,
    error,
    status,
  } = useSignUpForm()
    const router=useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>()

  const isLoading = status === "pending"

  const onSubmit = async (data: SignupFormValues) => {
    const { id } = await createUserWithEmailAndPasswordAsync({
      email: data.email,
      fullName: data.name,
      password: data.password,
    })
       router.replace('/dashboard')
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name", { required: "Full name is required" })}
          />
          {errors.name && (
            <FieldDescription className="text-destructive">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email ? (
            <FieldDescription className="text-destructive">
              {errors.email.message}
            </FieldDescription>
          ) : (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Must be at least 8 characters long",
              },
            })}
          />
          {errors.password ? (
            <FieldDescription className="text-destructive">
              {errors.password.message}
            </FieldDescription>
          ) : (
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
           {...register("confirmPassword", {
  required: "Please confirm your password",
  validate: (value) =>
    value === watch("password") || "Passwords do not match",
})}
          />
          {errors.confirmPassword ? (
            <FieldDescription className="text-destructive">
              {errors.confirmPassword.message}
            </FieldDescription>
          ) : (
            <FieldDescription>Please confirm your password.</FieldDescription>
          )}
        </Field>
           {isError && (
        <FieldDescription className="text-destructive text-center">
          {error?.message ?? "Something went wrong. Please try again."}
        </FieldDescription>
      )}
        <Field>
            <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        </Field>
 <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}