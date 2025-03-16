import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SquarePlus, House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useFetchedQuery } from "@/hooks/use-fetched-query";
import { CreateQuizRequest, UserResponse } from "@/lib/types";
import {
  addQuizFunction,
  getLessonFunction,
  getQuizFunction,
} from "@/functions/apiFunctions";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type EditLessonParams = {
  lessonId: string;
};

type Question = {
  questions: {
    question_id: number;
    question: string;
    type: "single_choice" | "multiple_choice";
    answers: { text: string; isCorrect: boolean }[];
    quiz_answers: {
      quiz_answers: {
        question_id: number;
        correct_answer: string;
      };
    }[];
  }[];
};

export default function EditLesson() {
  const navigate = useNavigate();
  const params = useParams();
  const user = useFetchedQuery(["me"]) as UserResponse;

  if (!user) {
    navigate("/login");
  } else if (user.role !== "admin") {
    navigate("/");
  }
  const { lessonId } = useParams<EditLessonParams>();

  if (lessonId) {
    const lId = parseInt(lessonId);
    if (isNaN(lId)) {
      navigate(`/admin`);
    }
  }

  const goToHomePage = () => {
    navigate(`/admin`);
  };

  const [questions, setQuestions] = useState<Question["questions"]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  console.log("🚀 ~ EditLesson ~ questions:", questions);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [quiz_name, setQuiz_name] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id:
          questions.length === 0
            ? 1
            : questions[questions.length - 1].question_id + 1,
        question: "",
        type: "single_choice",
        answers: [],
        quiz_answers: [],
      },
    ]);
  };

  if (params.lessonId === undefined) {
    navigate("/");
  } else {
    if (Number.isNaN(+params.lessonId)) {
      navigate("/");
    }
  }

  const { data: lesson } = useQuery({
    queryKey: ["lesson", params.lessonId], // Unique key for lesson
    queryFn: () =>
      getLessonFunction(
        localStorage.getItem("access_token") as string,
        +params.lessonId!
      ),
  });

  const { data: quizDetails, refetch: quizRefetch } = useQuery({
    queryKey: ["quizDetails", params.lessonId], // Unique key for quiz
    queryFn: () =>
      getQuizFunction(
        localStorage.getItem("access_token") as string,
        +params.lessonId!
      ),
  });
  console.log("🚀 ~ EditLesson ~ quizDetails:", quizDetails);

  const updateQuestionText = (id: number, question: string) => {
    setQuestions(
      questions.map((q) => (q.question_id === id ? { ...q, question } : q))
    );
  };

  const updateQuestionType = (
    id: number,
    type: "single_choice" | "multiple_choice"
  ) => {
    setQuestions(
      questions.map((q) => (q.question_id === id ? { ...q, type } : q))
    );
  };

  const updateOptionText = (qId: number, index: number, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === qId
          ? {
              ...q,
              answers: q.answers.map((opt, i) =>
                i === index ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  const toggleCorrectAnswer = (qId: number, index: number) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === qId
          ? {
              ...q,
              answers: q.answers.map((opt, i) =>
                i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
              ),
            }
          : q
      )
    );
  };

  const addOption = (qId: number) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === qId
          ? { ...q, answers: [...q.answers, { text: "", isCorrect: false }] }
          : q
      )
    );
  };

  const clearQuestions = () => {
    setQuestions([]);
  };

  const extractFileName = (url: string) => {
    const segments = url.split("/");
    return segments[segments.length - 1];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!quiz_name || !timeLimit || !lessonId) return;

    // Structure the data according to the required format
    const formattedData: CreateQuizRequest = {
      name: quiz_name,
      lesson_id: parseInt(lessonId),
      quiz_json: {
        questions: questions.map((question) => ({
          type: question.type,
          question_id: question.question_id,
          question: question.question,
          answers: question.answers.map((answer) => answer.text),
        })),
      },
      quiz_answers: {
        quiz_answers: questions.map((question) => ({
          question_id: question.question_id,
          correct_answer: question.answers
            .filter((answer) => answer.isCorrect)
            .map((answer) => answer.text),
        })),
      },
      duration: timeLimit as number,
    };

    // Add your API submission logic here

    try {
      setIsSubmit(true);
      toast.promise(
        addQuizFunction(
          localStorage.getItem("access_token") as string,
          formattedData
        ),
        {
          loading: "Adding Quiz",
          success: () => {
            quizRefetch();
            setQuestions([]);
            setIsSubmit(false);
            return "Succesfully Added Quiz";
          },
          error: "Error Adding Quiz",
        }
      );
    } catch (error) {
      setIsSubmit(false);
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Card className="relative w-full h-screen rbg-cove bg-center z-10 p-5 sm:p-10 md:p-20 bg-red-900">
          <CardContent className="border border-slate-900 rounded-lg bg-white mx-auto w-full sm:w-8/12 md:w-6/12 lg:w-7/12 p-4 max-h-[80vh] overflow-y-auto">
            <House className="cursor-pointer" onClick={goToHomePage} />
            <div className="mt-10">
              <img
                src="/img/login.jpg"
                alt="Image"
                className="h-auto rounded border mx-auto w-32 sm:w-40 md:w-48"
              />
              <div className="flex flex-col mx-10">
                <div>
                  <Label className="text-lg font-semibold mr-2">
                    Lesson Name:{" "}
                  </Label>
                  <span className="text-gray-700">{lesson?.name}</span>
                </div>
                <div className="flex">
                  <Label className="text-lg font-semibold mr-2">Theory: </Label>
                  <div>
                    <span className="text-gray-700">
                      {lesson?.theory_file
                        ? extractFileName(lesson.theory_file)
                        : ""}
                    </span>
                  </div>
                </div>
                {quizDetails === undefined ? (
                  <div>
                    <div className="grid grid-cols-3 gap-2 content-center">
                      <div>
                        <Label className="text-lg font-semibold">
                          Enter Quiz name:{" "}
                        </Label>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="text"
                          placeholder="Enter quiz name"
                          className="border p-1"
                          value={quiz_name}
                          onChange={(e) => setQuiz_name(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-lg font-semibold">
                          Time Limit (Minutes):
                        </Label>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={timeLimit}
                          onChange={(e) =>
                            setTimeLimit(parseInt(e.target.value))
                          }
                          className="border p-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div></div>
                    </div>
                    <div className="flex items-center gap-2 mt-2"></div>
                    {questions.map((q) => (
                      <div
                        key={q.question_id}
                        className="border p-2 rounded mt-4"
                      >
                        <Label className="text-lg font-semibold">
                          Enter your question:{" "}
                        </Label>

                        <Input
                          type="text"
                          placeholder="Enter question"
                          className="border p-1 w-full"
                          value={q.question}
                          onChange={(e) =>
                            updateQuestionText(q.question_id, e.target.value)
                          }
                        />

                        <div className="mt-2 gap-4">
                          <Label className="text-lg font-semibold">
                            Select your question type:{" "}
                          </Label>

                          <div>
                            <label className="mr-4">
                              <input
                                type="radio"
                                name={`type-${q.question_id}`}
                                checked={q.type === "single_choice"}
                                onChange={() =>
                                  updateQuestionType(
                                    q.question_id,
                                    "single_choice"
                                  )
                                }
                                className="mr-2"
                              />
                              Radio Type
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`type-${q.question_id}`}
                                checked={q.type === "multiple_choice"}
                                onChange={() =>
                                  updateQuestionType(
                                    q.question_id,
                                    "multiple_choice"
                                  )
                                }
                                className="mr-2"
                              />
                              Checkbox Type
                            </label>
                          </div>
                        </div>
                        <Label className="text-lg font-semibold">
                          Enter your answers:{" "}
                        </Label>
                        {q.answers.map((opt, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mt-2"
                          >
                            <input
                              type={
                                q.type === "single_choice"
                                  ? "radio"
                                  : "checkbox"
                              }
                              name={`correct-${q.question_id}`}
                              checked={opt.isCorrect}
                              onChange={() =>
                                toggleCorrectAnswer(q.question_id, index)
                              }
                            />
                            <Input
                              type="text"
                              placeholder={`Option ${index + 1}`}
                              className="border p-1 w-full"
                              value={opt.text}
                              onChange={(e) =>
                                updateOptionText(
                                  q.question_id,
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          className=" mt-2"
                          onClick={() => addOption(q.question_id)}
                        >
                          + Add Option
                        </Button>
                      </div>
                    ))}
                    <div></div>
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      Add Questions:{" "}
                      <SquarePlus
                        className="cursor-pointer"
                        onClick={addQuestion}
                      />
                    </Label>
                    {questions.length > 0 && (
                      <div className="flex ">
                        <Button
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded mr-4"
                          type="submit"
                          disabled={isSubmit}
                        >
                          {isSubmit ? <LoaderCircle /> : "Submit Quiz"}
                        </Button>
                        <Button
                          type="button"
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                          onClick={clearQuestions}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-[50px]">
                    <Label className="text-lg font-semibold">
                      Quiz Name: {quizDetails.name}
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
