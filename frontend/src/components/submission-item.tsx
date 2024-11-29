import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Submission {
  id: string;
  title: string;
  subject: string;
  submittedAt: string;
  status: string;
  grade: number | null;
  feedback: string | null;
}

interface SubmissionItemProps {
  submission: Submission;
}

export function SubmissionItem({ submission }: SubmissionItemProps) {
  return (
    <Card className="overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={submission.id}>
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium leading-none">
                    {submission.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {submission.subject}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  submission.status === "Avaliado" ? "default" : "secondary"
                }
                className="ml-auto"
              >
                {submission.status}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Data de submissão:</strong> {submission.submittedAt}
                </p>
                {submission.grade !== null && (
                  <p className="text-sm">
                    <strong>Nota:</strong> {submission.grade}
                  </p>
                )}
                {submission.feedback && (
                  <div className="text-sm">
                    <strong>Feedback:</strong>
                    <p className="mt-1 text-muted-foreground">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
