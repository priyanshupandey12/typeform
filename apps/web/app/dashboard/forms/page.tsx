"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { DashboardLayout } from "~/components/dashboard-layout"
import { Button } from "~/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
 DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"

import { Input } from "~/components/ui/input"

import { Textarea } from "~/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { useCreateForm } from "~/hooks/api/form"

type CreateFormData = {
  title: string
  description?: string
  slug: string
  status: "draft" | "published"
  visibility: "public" | "unlisted"
}

export function CreateFormButton() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<CreateFormData>({
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      status: "draft",
      visibility: "public",
    },
  })

  const {
    createFormAsync,
    status,
    error,
    isError,
  } = useCreateForm()

  const onSubmit = async (data: CreateFormData) => {
    try {
      await createFormAsync(data)

      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create Form
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Create New Form
          </DialogTitle>

          <DialogDescription>
            Create and manage your form.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-6"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>
                Title
              </FieldLabel>

              <Input
                placeholder="Feedback Form"
                {...register("title")}
              />
            </Field>

            <Field>
              <FieldLabel>
                Description
              </FieldLabel>

              <Textarea
                placeholder="Write something about your form..."
                {...register("description")}
              />
            </Field>

            <Field>
              <FieldLabel>
                Slug
              </FieldLabel>

              <Input
                placeholder="feedback-form"
                {...register("slug")}
              />
            </Field>

            <Field>
              <FieldLabel>
                Status
              </FieldLabel>

              <Select
                defaultValue="draft"
                onValueChange={(value) =>
                  setValue(
                    "status",
                    value as "draft" | "published"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="draft">
                    Draft
                  </SelectItem>

                  <SelectItem value="published">
                    Published
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>
                Visibility
              </FieldLabel>

              <Select
                defaultValue="public"
                onValueChange={(value) =>
                  setValue(
                    "visibility",
                    value as "public" | "unlisted"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="public">
                    Public
                  </SelectItem>

                  <SelectItem value="unlisted">
                    Unlisted
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {isError && (
              <p className="text-sm text-red-500">
                {error?.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={status === "pending"}
            >
              {status === "pending"
                ? "Creating..."
                : "Create Form"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Page() {
  return (
    <DashboardLayout>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Forms
          </h1>

          <p className="text-muted-foreground">
            Manage your forms
          </p>
        </div>

        <CreateFormButton />
      </div>
    </div>
  </DashboardLayout>
  )
}