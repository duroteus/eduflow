export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Submission {
  id: string;
  title: string;
  description: string;
  studentId: string;
  courseId: string;
  file: {
    url: string;
    name: string;
    type: string;
  };
  status: SubmissionStatus;
  feedback?: string;
  grade?: number;
  submittedAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
  };
}
