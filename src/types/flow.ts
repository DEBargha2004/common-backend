export type TFlowBrief = {
  id: number;
  title: string;
  prompt: string;
  lastExecuted: Date | null;
  totalExecutions: number;
};

export type TWebContent = {
  title: string;
  content: string;
  url: string;
  image_url: string | null;
};
