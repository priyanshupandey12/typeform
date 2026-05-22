import { DashboardLayout } from "~/components/dashboard-layout"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Create form</CardTitle>
            <CardDescription>
              Build a new form from the dashboard layout.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="form-title">Form title</FieldLabel>
                  <Input id="form-title" name="title" placeholder="Customer feedback" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-description">Description</FieldLabel>
                  <Textarea
                    id="form-description"
                    name="description"
                    placeholder="Tell people what this form is for."
                  />
                  <FieldDescription>
                    This appears at the top of the form.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="first-question">First question</FieldLabel>
                  <Input
                    id="first-question"
                    name="question"
                    placeholder="How was your experience?"
                  />
                </Field>
              </FieldGroup>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Save draft
                </Button>
                <Button type="submit">Create form</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}