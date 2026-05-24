"use client"

import { use, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import Link from "next/link"
import { DashboardLayout } from "~/components/dashboard-layout"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ResponsesTab } from "./responses-tab"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"

import {
  useCreateFormField,
  useUpdateFormField,
  useDeleteFormField,
  useListFormFields,
} from "~/hooks/api/form-field"

import {
  IconArrowLeft,
  IconPlus,
  IconEdit,
  IconTrash,
  IconGripVertical,
  IconInbox,
} from "@tabler/icons-react"

// ── Types ──────────────────────────────────────────────

const FIELD_TYPES = [
  "TEXT",
  "TEXTAREA",
  "SELECT",
  "CHECKBOX",
  "RADIO",
  "DATE",
  "NUMBER",
  "EMAIL",
  "PASSWORD",
  "FILE",
  "YES_NO",
  "RATING",
] as const

type FieldType = (typeof FIELD_TYPES)[number]

type CreateFormFieldData = {
  label: string
  description?: string
  placeholder?: string
  isRequired: boolean
  fieldType: FieldType
  optionsString?: string
}

type UpdateFormFieldData = {
  label?: string
  description?: string
  placeholder?: string
  isRequired?: boolean
  fieldType?: FieldType
  orderIndex?: string
  optionsString?: string
}

// ── Field type display helpers ─────────────────────────

const fieldTypeLabels: Record<FieldType, string> = {
  TEXT: "Text",
  TEXTAREA: "Text Area",
  SELECT: "Select",
  CHECKBOX: "Checkbox",
  RADIO: "Radio",
  DATE: "Date",
  NUMBER: "Number",
  EMAIL: "Email",
  PASSWORD: "Password",
  FILE: "File Upload",
  YES_NO: "Yes / No",
  RATING: "Rating",
}

const fieldTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "TEXT":
    case "TEXTAREA":
    case "EMAIL":
    case "PASSWORD":
      return "default" as const
    case "SELECT":
    case "CHECKBOX":
    case "RADIO":
    case "YES_NO":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

// ── Add Field Dialog ───────────────────────────────────

function AddFieldDialog({ formId }: { formId: string }) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
  } = useForm<CreateFormFieldData>({
    defaultValues: {
      label: "",
      description: "",
      placeholder: "",
      isRequired: false,
      fieldType: "TEXT",
      optionsString: "",
    },
  })

  const currentFieldType = watch("fieldType")

  const {
    createFormFieldAsync,
    status,
    error,
    isError,
  } = useCreateFormField()

  const onSubmit = async (data: CreateFormFieldData) => {
    try {
      const options =
        data.optionsString && ["SELECT", "RADIO", "CHECKBOX"].includes(data.fieldType)
          ? data.optionsString.split(",").map((opt) => ({ label: opt.trim(), value: opt.trim() })).filter(opt => opt.value !== "")
          : undefined

      await createFormFieldAsync({
        formId,
        ...data,
        options,
      })
      reset()
      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="size-4" />
          Add Field
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
          <DialogDescription>
            Configure a new field for your form.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-6"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Label</FieldLabel>
              <Input
                placeholder="e.g. Full Name"
                {...register("label")}
              />
            </Field>

            <Field>
              <FieldLabel>Field Type</FieldLabel>
              <Select
                defaultValue="TEXT"
                onValueChange={(value) =>
                  setValue("fieldType", value as FieldType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {fieldTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Help text shown below the field..."
                {...register("description")}
              />
            </Field>

            <Field>
              <FieldLabel>Placeholder</FieldLabel>
              <Input
                placeholder="Placeholder text inside the field..."
                {...register("placeholder")}
              />
            </Field>

            {["SELECT", "RADIO", "CHECKBOX"].includes(currentFieldType) && (
              <Field>
                <FieldLabel>Options (comma separated)</FieldLabel>
                <Textarea
                  placeholder="e.g. Option A, Option B, Option C"
                  {...register("optionsString")}
                />
              </Field>
            )}

            <Field orientation="horizontal">
              <FieldLabel>Required</FieldLabel>
              <Controller
                name="isRequired"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
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
                ? "Adding..."
                : "Add Field"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Field Dialog ──────────────────────────────────

function EditFieldDialog({
  field,
}: {
  field: {
    id: string
    label: string
    description?: string | null
    placeholder?: string | null
    isRequired: boolean
    fieldType: string
    orderIndex: string
    options?: any
  }
}) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
  } = useForm<UpdateFormFieldData>({
    defaultValues: {
      label: field.label,
      description: field.description ?? "",
      placeholder: field.placeholder ?? "",
      isRequired: field.isRequired,
      fieldType: field.fieldType as FieldType,
      optionsString: Array.isArray(field.options) ? field.options.map(opt => opt.value).join(", ") : "",
    },
  })

  const currentFieldType = watch("fieldType")

  const {
    updateFormFieldAsync,
    status,
    error,
    isError,
  } = useUpdateFormField()

  const onSubmit = async (data: UpdateFormFieldData) => {
    try {
      const options =
        data.optionsString && data.fieldType && ["SELECT", "RADIO", "CHECKBOX"].includes(data.fieldType)
          ? data.optionsString.split(",").map((opt) => ({ label: opt.trim(), value: opt.trim() })).filter(opt => opt.value !== "")
          : undefined

      await updateFormFieldAsync({
        id: field.id,
        ...data,
        options,
      })
      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <IconEdit className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
          <DialogDescription>
            Update the configuration for this field.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-6"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Label</FieldLabel>
              <Input
                placeholder="e.g. Full Name"
                {...register("label")}
              />
            </Field>

            <Field>
              <FieldLabel>Field Type</FieldLabel>
              <Select
                defaultValue={field.fieldType}
                onValueChange={(value) =>
                  setValue("fieldType", value as FieldType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {fieldTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Help text shown below the field..."
                {...register("description")}
              />
            </Field>

            <Field>
              <FieldLabel>Placeholder</FieldLabel>
              <Input
                placeholder="Placeholder text inside the field..."
                {...register("placeholder")}
              />
            </Field>

            {currentFieldType && ["SELECT", "RADIO", "CHECKBOX"].includes(currentFieldType) && (
              <Field>
                <FieldLabel>Options (comma separated)</FieldLabel>
                <Textarea
                  placeholder="e.g. Option A, Option B, Option C"
                  {...register("optionsString")}
                />
              </Field>
            )}

            <Field orientation="horizontal">
              <FieldLabel>Required</FieldLabel>
              <Controller
                name="isRequired"
                control={control}
                render={({ field: f }) => (
                  <Switch
                    checked={f.value}
                    onCheckedChange={f.onChange}
                  />
                )}
              />
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
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete Field Alert ─────────────────────────────────

function DeleteFieldAlert({
  fieldId,
  fieldLabel,
}: {
  fieldId: string
  fieldLabel: string
}) {
  const { deleteFormFieldAsync, status } = useDeleteFormField()

  const handleDelete = async () => {
    try {
      await deleteFormFieldAsync({ id: fieldId })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
          <IconTrash className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete field</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&quot;{fieldLabel}&quot;</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={status === "pending"}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Field Card ─────────────────────────────────────────

function FieldCard({
  field,
  index,
}: {
  field: {
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
  index: number
}) {
  return (
    <div className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      {/* Drag handle / index */}
      <div className="flex flex-col items-center gap-1 pt-0.5 text-muted-foreground">
        <IconGripVertical className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-xs font-medium tabular-nums">{index + 1}</span>
      </div>

      {/* Field info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{field.label}</span>

          <Badge variant={fieldTypeBadgeVariant(field.fieldType)}>
            {fieldTypeLabels[field.fieldType as FieldType] ?? field.fieldType}
          </Badge>

          {field.isRequired && (
            <Badge variant="outline" className="text-destructive border-destructive/30">
              Required
            </Badge>
          )}
        </div>

        {field.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {field.description}
          </p>
        )}

        <p className="mt-1 text-xs text-muted-foreground/70 font-mono">
          key: {field.labelKey}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <EditFieldDialog field={field} />
        <DeleteFieldAlert fieldId={field.id} fieldLabel={field.label} />
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────

export default function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { listFormFieldsData, isLoading } = useListFormFields(id)

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 flex flex-col gap-6">
        <Tabs defaultValue="builder" className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/forms">
                  <IconArrowLeft className="size-4" />
                  Back to Forms
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold">Form Management</h1>
            </div>

            <div className="flex items-center gap-3">
              <TabsList>
                <TabsTrigger value="builder">Builder</TabsTrigger>
                <TabsTrigger value="responses">Responses</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="builder" className="flex flex-col gap-3 mt-0">
            <div className="flex justify-end mb-2">
              <AddFieldDialog formId={id} />
            </div>

            {/* Fields list */}
            {isLoading && (
              <div className="rounded-lg border border-dashed flex items-center justify-center h-48 text-muted-foreground">
                Loading fields...
              </div>
            )}

            {!isLoading && (!listFormFieldsData || listFormFieldsData.length === 0) && (
              <div className="rounded-lg border border-dashed flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                <p>No fields yet. Add your first field to get started.</p>
                <AddFieldDialog formId={id} />
              </div>
            )}

            {listFormFieldsData?.map((field, index) => (
              <FieldCard key={field.id} field={field} index={index} />
            ))}
          </TabsContent>

          <TabsContent value="responses" className="mt-0">
            <ResponsesTab formId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}