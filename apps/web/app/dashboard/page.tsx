"use client"

import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { RecentSubmissionsTable } from "~/components/recent-submissions-table"
import { DashboardLayout } from "~/components/dashboard-layout"
import { SectionCards } from "~/components/section-cards"
import { useGetDashboardAnalytics } from "~/hooks/api/form"
import { IconLoader2 } from "@tabler/icons-react"

export default function Page() {
  const { analyticsData, isLoading } = useGetDashboardAnalytics()

  return (
    <DashboardLayout>
      {isLoading || !analyticsData ? (
        <div className="flex h-[400px] w-full items-center justify-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <SectionCards
            totalForms={analyticsData.totalForms}
            activeForms={analyticsData.activeForms}
            totalSubmissions={analyticsData.totalSubmissions}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={analyticsData.chartData} />
          </div>
          <div className="px-4 lg:px-6">
            <RecentSubmissionsTable submissions={analyticsData.recentSubmissions} />
          </div>
        </>
      )}
    </DashboardLayout>
  )
}