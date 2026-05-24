"use client"

import { useListFormFields } from "~/hooks/api/form-field"
import { useGetSubmissionsByFormId } from "~/hooks/api/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts"
import { IconUsers, IconClock } from "@tabler/icons-react"

export function ResponsesTab({ formId }: { formId: string }) {
  const { listFormFieldsData: fields, isLoading: fieldsLoading } = useListFormFields(formId)
  const { submissionsData: submissions, isLoading: submissionsLoading } = useGetSubmissionsByFormId(formId)

  const isLoading = fieldsLoading || submissionsLoading

  // Build a lookup: fieldId → label
  const orderedFields: { id: string; label: string; type: string; options: any }[] = []
  
  if (fields) {
    for (const f of fields) {
      orderedFields.push({ id: f.id, label: f.label, type: f.fieldType, options: f.options })
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
    if (entry.value === null || entry.value === undefined || entry.value === "") return "—"
    return String(entry.value)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalResponses = submissions?.length || 0
  const latestResponse = totalResponses > 0 ? submissions?.[0]?.createdAt : null
  
  // Data for charts (find the first SELECT/RADIO field to visualize)
  const chartField = orderedFields.find(f => ["SELECT", "RADIO"].includes(f.type) && Array.isArray(f.options))
  let chartData: any[] = []
  
  if (chartField && submissions) {
    const counts: Record<string, number> = {}
    chartField.options.forEach((opt: any) => counts[opt.value] = 0)
    
    submissions.forEach(sub => {
      const val = getValue(sub.values as any, chartField.id)
      if (val !== "—" && counts[val] !== undefined) {
        counts[val]++
      }
    })
    
    chartData = Object.entries(counts).map(([name, value]) => ({ name, value }))
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="flex flex-col gap-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : "Total submissions collected"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Response</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestResponse ? formatDate(latestResponse) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : totalResponses > 0 ? "Time of most recent submission" : "No responses yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      {chartField && chartData.length > 0 && totalResponses > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Response Distribution: {chartField.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <div className="rounded-lg border-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12 text-center border-r border-border/50">#</TableHead>
                {orderedFields.map((f) => (
                  <TableHead key={f.id} className="min-w-[150px] border-r border-border/50">
                    {f.label}
                  </TableHead>
                ))}
                <TableHead className="min-w-[150px]">Submitted At</TableHead>
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

              {!isLoading && totalResponses === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={orderedFields.length + 2}
                    className="text-center text-muted-foreground py-16"
                  >
                    No submissions yet. Share your form to collect some!
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                submissions?.map((submission, index) => (
                  <TableRow key={submission.id} className="hover:bg-muted/30">
                    <TableCell className="text-center text-muted-foreground font-mono text-xs border-r border-border/50">
                      {index + 1}
                    </TableCell>
                    {orderedFields.map((f) => {
                      const val = getValue(
                        submission.values as { fieldId: string; value: unknown }[] | null,
                        f.id
                      )
                      return (
                        <TableCell key={f.id} className="max-w-[250px] truncate border-r border-border/50" title={val}>
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
      </Card>
    </div>
  )
}
