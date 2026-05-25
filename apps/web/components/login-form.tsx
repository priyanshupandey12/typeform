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
import { useSignInForm } from "~/hooks/api/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

type LoginFormData = {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()
  const router=useRouter()

    const {signInUserWithEmailAndPasswordAsync,
      error,
      failureCount,
      isError,
      isIdle,
      status} = useSignInForm()

  const onSubmit = async(data: LoginFormData) => {
         const { id } = await signInUserWithEmailAndPasswordAsync({
      email: data.email,
      password: data.password,
    })
     router.replace('/dashboard')
  
  }

  const handleDemoLogin = async () => {
    await signInUserWithEmailAndPasswordAsync({
      email: "demo@sagaforms.com",
      password: "demo1234",
    })
    router.replace('/dashboard')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email is required",
            })}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>


          </div>

          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </Field>

       <Field>
  <Button type="submit" className="w-full">
    Login
  </Button>
  
  <FieldSeparator>Or for Hackathon Judges</FieldSeparator>
  
  <Button type="button" variant="secondary" className="w-full" onClick={handleDemoLogin}>
    Log in as Demo User
  </Button>

  <FieldDescription className="text-center mt-4">
    Don&apos;t have an account?{" "}
    <Link href="/signup" className="underline underline-offset-4">
      Sign up
    </Link>
  </FieldDescription>
</Field>
      </FieldGroup>
    </form>
  )
}