"use client"

import { use } from "react"
import Link from "next/link"
import { DashboardLayout } from "~/components/dashboard-layout"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useListFormFields } from "~/hooks/api/form-field"
import { useGetSubmissionsByFormId } from "~/hooks/api/form"
import { IconArrowLeft } from "@tabler/icons-react"

export default function SubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { listFormFieldsData: fields, isLoading: fieldsLoading } = useListFormFields(id)
  const { submissionsData: submissions, isLoading: submissionsLoading } = useGetSubmissionsByFormId(id)

  const isLoading = fieldsLoading || submissionsLoading

  // Build a lookup: fieldId → label
  const fieldMap = new Map<string, { label: string; orderIndex: string }>()
  const orderedFields: { id: string; label: string }[] = []

  if (fields) {
    for (const f of fields) {
      fieldMap.set(f.id, { label: f.label, orderIndex: f.orderIndex })
      orderedFields.push({ id: f.id, label: f.label })
    }
  }

  // Get the value for a field from a submission's values array
  const getValue = (
    values: { fieldId: string; value: unknown }[] | null | undefined,
    fieldId: string
  ): string => {
    if (!values) return "—"
    const entry = values.find((v) => v.fieldId === fieldId)
    if (!entry) return "—"
    if (Array.isArray(entry.value)) return entry.value.join(", ")
    if (entry.value === null || entry.value === undefined) return "—"
    return String(entry.value)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/forms/${id}`}>
                <IconArrowLeft className="size-4" />
                Back to Builder
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold">Submissions</h1>
              <p className="text-sm text-muted-foreground">
                {!isLoading && submissions
                  ? `${submissions.length} response${submissions.length !== 1 ? "s" : ""}`
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                {orderedFields.map((f) => (
                  <TableHead key={f.id} className="min-w-[150px]">
                    {f.label}
                  </TableHead>
                ))}
                <TableHead className="min-w-[180px]">Submitted At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={orderedFields.length + 2}
                    className="text-center text-muted-foreground py-16"
                  >
                    Loading submissions...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && (!submissions || submissions.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={orderedFields.length + 2}
                    className="text-center text-muted-foreground py-16"
                  >
                    No submissions yet.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                submissions?.map((submission, index) => (
                  <TableRow key={submission.id}>
                    <TableCell className="text-center text-muted-foreground font-mono text-xs">
                      {index + 1}
                    </TableCell>
                    {orderedFields.map((f) => {
                      const val = getValue(
                        submission.values as { fieldId: string; value: unknown }[] | null,
                        f.id
                      )
                      return (
                        <TableCell key={f.id} className="max-w-[300px] truncate">
                          {val}
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(submission.createdAt)}
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
