export type PostType = {
  id: string;
  name: string;
  createdAt: string;
  imageUrl: string;
  userId: string;
  editorState: string;
}

export type AnalysisType = {
  id: string;
  postId: string;
  mood: string;
  summary: string;
  subject: string;
  negative: boolean;
  color: string;
  sentimentScore: number;
}