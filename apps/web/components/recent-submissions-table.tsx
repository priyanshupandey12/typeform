"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"

interface RecentSubmissionsTableProps {
  submissions: {
    id: string;
    formId: string;
    formTitle: string;
    createdAt: Date | string | null;
  }[];
}

export function RecentSubmissionsTable({ submissions }: RecentSubmissionsTableProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>
          The latest responses received across all your forms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground border rounded-md border-dashed">
            No submissions found yet.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="text-right">Submission ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.formTitle}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "Unknown"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-mono text-xs">
                      {sub.id.split("-")[0]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
