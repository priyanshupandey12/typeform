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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

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

import { useCreateForm, useUpdateForm, useDeleteForm } from "~/hooks/api/form"
import { IconExternalLink, IconTrash, IconEdit, IconShare } from "@tabler/icons-react"
import Link  from "next/link"

type CreateFormData = {
  title: string
  description?: string
  slug: string
  status: "draft" | "published"
  visibility: "public" | "unlisted"
  password?: string
  responseLimit?: number
  expiresAt?: string
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
      expiresAt: "",
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
      const shortId = Math.random().toString(36).substring(2, 7)
      const submitData = {
        ...data,
        slug: `${data.slug}-${shortId}`,
        password: data.password || undefined,
        responseLimit: Number.isNaN(data.responseLimit) || !data.responseLimit ? undefined : data.responseLimit,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      }
      await createFormAsync(submitData)

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

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
              <FieldLabel>Title <span className="text-destructive">*</span></FieldLabel>
              <Input placeholder="Feedback Form" {...register("title")} required />
            </Field>

            <Field>
              <FieldLabel>Description (Optional)</FieldLabel>
              <Textarea placeholder="Write something about your form..." {...register("description")} />
            </Field>

            <Field>
              <FieldLabel>Slug <span className="text-destructive">*</span></FieldLabel>
              <Input placeholder="feedback-form" {...register("slug")} required />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select defaultValue="draft" onValueChange={(value) => setValue("status", value as "draft" | "published")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Visibility</FieldLabel>
              <Select defaultValue="public" onValueChange={(value) => setValue("visibility", value as "public" | "unlisted")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Password (Optional)</FieldLabel>
              <Input type="password" placeholder="Protect your form" {...register("password")} />
            </Field>

            <Field>
              <FieldLabel>Response Limit (Optional)</FieldLabel>
              <Input type="number" placeholder="Max responses allowed" {...register("responseLimit", { valueAsNumber: true })} />
            </Field>

            <Field>
              <FieldLabel>Expires At (Optional)</FieldLabel>
              <Input type="datetime-local" {...register("expiresAt")} />
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

export function UpdateFormButton({ form }: { form: any }) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<CreateFormData>({
    defaultValues: {
      title: form.title,
      description: form.description || "",
      slug: form.slug,
      status: form.status,
      visibility: form.visibility,
      password: form.password || "",
      responseLimit: form.responseLimit || undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString().slice(0, 16) : "",
    },
  })

  const {
    updateFormAsync,
    status,
    error,
  } = useUpdateForm()

  const onSubmit = async (data: CreateFormData) => {
    try {
      const submitData = {
        id: form.id,
        ...data,
        password: data.password || undefined,
        responseLimit: Number.isNaN(data.responseLimit) || !data.responseLimit ? undefined : data.responseLimit,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      }
      await updateFormAsync(submitData)
      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <IconEdit className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Form</DialogTitle>
          <DialogDescription>Update your form details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Title <span className="text-destructive">*</span></FieldLabel>
              <Input placeholder="Feedback Form" {...register("title")} required />
            </Field>

            <Field>
              <FieldLabel>Description (Optional)</FieldLabel>
              <Textarea placeholder="Write something about your form..." {...register("description")} />
            </Field>

            <Field>
              <FieldLabel>Slug <span className="text-destructive">*</span></FieldLabel>
              <Input placeholder="feedback-form" {...register("slug")} required />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select defaultValue={form.status} onValueChange={(value) => setValue("status", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Visibility</FieldLabel>
              <Select defaultValue={form.visibility} onValueChange={(value) => setValue("visibility", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Password (Optional)</FieldLabel>
              <Input type="password" placeholder="Protect your form" {...register("password")} />
            </Field>

            <Field>
              <FieldLabel>Response Limit (Optional)</FieldLabel>
              <Input type="number" placeholder="Max responses allowed" {...register("responseLimit", { valueAsNumber: true })} />
            </Field>

            <Field>
              <FieldLabel>Expires At (Optional)</FieldLabel>
              <Input type="datetime-local" {...register("expiresAt")} />
            </Field>

            {error && <p className="text-sm text-red-500">{error?.message}</p>}

            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? "Updating..." : "Update Form"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteFormButton({ formId }: { formId: string }) {
  const { deleteFormAsync, status } = useDeleteForm()

  const handleDelete = async () => {
    try {
      await deleteFormAsync({ id: formId })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
          <IconTrash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the form and all its submissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={status === "pending"} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            {status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
                <TableHead>Expires At</TableHead>
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
                  <TableCell className="text-muted-foreground text-sm">
                    {form.expiresAt ? new Date(form.expiresAt).toISOString().split('T')[0] : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                        <Link href={`/form/${form.slug}`} target="_blank">
                          <IconShare className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                        <Link href={`/dashboard/forms/${form.id}`}>
                          <IconExternalLink className="size-4" />
                        </Link>
                      </Button>
                      <UpdateFormButton form={form} />
                      <DeleteFormButton formId={form.id} />
                    </div>
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