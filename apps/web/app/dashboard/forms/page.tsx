"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { DashboardLayout } from "~/components/dashboard-layout"
import { Button } from "~/components/ui/button"
import { useListFormsByUserId } from "~/hooks/api/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"

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
import { IconExternalLink } from "@tabler/icons-react"
import Link  from "next/link"

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
  const { listFormsByUserIdData, isLoading } = useListFormsByUserId()

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Forms</h1>
            <p className="text-muted-foreground">Manage your forms</p>
          </div>
          <CreateFormButton />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    Loading forms...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && listFormsByUserIdData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No forms yet. Create your first one!
                  </TableCell>
                </TableRow>
              )}

              {listFormsByUserIdData?.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell className="text-muted-foreground">{form.slug}</TableCell>
                  <TableCell>
                    <Badge variant={form.status === "published" ? "default" : "secondary"}>
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{form.visibility}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Edit <IconExternalLink className="size-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}