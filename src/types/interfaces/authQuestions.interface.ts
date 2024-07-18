export interface IQuestionData {
  _id: string;
  title: string;
  answers: string[];
  role: string;
  showOrder: 1;
}
export interface IQuestionAnswered {
  question: string;
  answers: string[];
}
