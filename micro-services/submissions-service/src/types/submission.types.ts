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
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  submittedAt: Date;
  updatedAt: Date;
}
