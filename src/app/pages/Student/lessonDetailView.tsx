import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { House, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getLessonFunction,
  getQuizFunction,
  getQuizResultFunction,
  submitQuizAnswersFunction,
} from "@/functions/apiFunctions";
import ImageWithAuth from "@/components/imageWithAuth";
import { API_URL } from "@/functions/networkFunctions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Answer, QuizJson, SubmitQuizRequest } from "@/lib/types";

export default function ViewLesson() {
  const navigate = useNavigate();
  const params = useParams();
  const goToHomePage = () => {
    navigate("/");
  };
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  console.log("🚀 ~ ViewLesson ~ selectedAnswers:", selectedAnswers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  console.log("🚀 ~ ViewLesson ~ quizStartTime:", quizStartTime);

  console.log("🚀 ~ ViewLesson ~ questions:", questions);

  if (params.lessonId === undefined) {
    navigate("/");
  } else {
    if (Number.isNaN(+params.lessonId)) {
      navigate("/");
    }
  }

  const {
    data: lesson,
    isSuccess,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["lesson", params.lessonId], // Unique key for lesson
    queryFn: () =>
      getLessonFunction(
        localStorage.getItem("access_token") as string,
        +params.lessonId!
      ),
  });
  console.log("🚀 ~ ViewLesson ~ lesson:", lesson);

  const {
    data: quiz,
    isSuccess: quizSuccess,
    isLoading: quizisLoading,
  } = useQuery({
    queryKey: ["quiz", params.lessonId],
    queryFn: () =>
      getQuizFunction(
        localStorage.getItem("access_token") as string,
        +params.lessonId!
      ),
  });
  console.log("🚀 ~ ViewLesson ~ quiz:", quiz);

  const { data: quizResult, refetch: quizAnswerRefetch } = useQuery({
    queryKey: ["quizResult", params.lessonId],
    queryFn: () => {
      if (quizSuccess) {
        return getQuizResultFunction(
          localStorage.getItem("access_token") as string,
          +params.lessonId!
        );
      }
    },
  });

  console.log("🚀 ~ ViewLesson ~ quiz:", quizResult);

  useEffect(() => {
    if (quiz?.quiz_json) {
      try {
        const quizList = JSON.parse(quiz.quiz_json.replace(/'/g, '"'));
        setQuestions(
          Array.isArray(quizList.questions) ? quizList.questions : []
        );
      } catch (error) {
        console.error("Error parsing quiz JSON:", error);
        setQuestions([]); // Fallback to an empty array
      }
    } else {
      setQuestions([]); // Ensure questions is always an array
    }

    if (isError) {
      navigate("/");
    }

    if (isDialogOpen) {
      setQuizStartTime(new Date());

      setTimeLeft((quiz?.duration ?? 0) * 60); // Convert minutes to seconds

      const timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            submitQuiz();
            setIsDialogOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [quiz, isError, navigate, isDialogOpen, quiz?.duration]);

  const handleSingleChoiceChange = (qIndex: number, aIndex: number) => {
    const questionId = qIndex + 1;
    const answer = aIndex + 1;

    setSelectedAnswers((prev) => {
      const existing = prev.find((a) => a.question_id === questionId);
      return existing
        ? prev.map((a) => (a.question_id === questionId ? { ...a, answer } : a))
        : [...prev, { question_id: questionId, answer }];
    });
  };

  const handleMultipleChoiceChange = (
    qIndex: number,
    aIndex: number,
    isChecked: boolean
  ) => {
    const questionId = qIndex + 1;
    const answerValue = aIndex + 1;

    setSelectedAnswers((prev) => {
      const existing = prev.find((a) => a.question_id === questionId);
      if (!existing) {
        return isChecked
          ? [...prev, { question_id: questionId, answer: [answerValue] }]
          : prev;
      }

      const currentAnswers = Array.isArray(existing.answer)
        ? existing.answer
        : [];
      const updatedAnswers = isChecked
        ? [...currentAnswers, answerValue]
        : currentAnswers.filter((a) => a !== answerValue);

      return prev.map((a) =>
        a.question_id === questionId ? { ...a, answer: updatedAnswers } : a
      );
    });
  };

  const submitQuiz = () => {
    if (!quiz || !quizStartTime) {
      // Add validation for start time
      toast.error("Quiz data or start time missing");
      return;
    }

    // Validation 1: Check all questions are answered
    const unansweredQuestions = questions
      .map((_, index) => index + 1)
      .filter(
        (questionId) =>
          !selectedAnswers.some((a) => a.question_id === questionId)
      );

    if (unansweredQuestions.length > 0) {
      toast.error(
        `Please answer all questions. Unanswered: ${unansweredQuestions.join(
          ", "
        )}`
      );
      return;
    }

    // Validation 2: Check answer types and validity
    const validationErrors: string[] = [];
    selectedAnswers.forEach((answer) => {
      const questionIndex = answer.question_id - 1;
      const question = questions[questionIndex] as QuizJson;

      if (!question) {
        validationErrors.push(`Question ${answer.question_id} not found`);
        return;
      }

      // Type checks
      if (question.type === "single_choice") {
        if (typeof answer.answer !== "number") {
          validationErrors.push(
            `Question ${answer.question_id}: Select one answer`
          );
        }
        // Value range check
        else if (answer.answer < 1 || answer.answer > question.answers.length) {
          validationErrors.push(
            `Question ${answer.question_id}: Invalid answer selected`
          );
        }
      } else if (question.type === "multiple_choice") {
        if (!Array.isArray(answer.answer)) {
          validationErrors.push(
            `Question ${answer.question_id}: Invalid answer format`
          );
        } else if (answer.answer.length === 0) {
          validationErrors.push(
            `Question ${answer.question_id}: Select at least one answer`
          );
        }
        // Validate each selected option
        else if (
          answer.answer.some((a) => a < 1 || a > question.answers.length)
        ) {
          validationErrors.push(
            `Question ${answer.question_id}: Contains invalid choices`
          );
        }
      }
    });

    if (validationErrors.length > 0) {
      toast.error(`Validation errors: ${validationErrors.join(", ")}`);
      return;
    }

    // Proceed with submission if validations pass
    const formattedAnswers = {
      quiz_id: quiz.id,
      start_time: quizStartTime,
      end_time: new Date(),
      submitted_answers: {
        answers: selectedAnswers.map(({ question_id, answer }) => ({
          question_id,
          answer: Array.isArray(answer) ? answer.map(String) : [String(answer)],
        })),
      },
    } as unknown as SubmitQuizRequest;

    console.log("Submitting answers:", formattedAnswers);
    toast.success("Quiz submitted successfully!");

    try {
      setIsSubmit(true);
      toast.promise(
        submitQuizAnswersFunction(
          localStorage.getItem("access_token") as string,
          formattedAnswers
        ),
        {
          loading: "Start Quiz",
          success: () => {
            setInterval(() => {
              quizAnswerRefetch();
            }, 2000);
            setQuestions([]);
            setIsSubmit(false);
            return "Succesfully Added Quiz";
          },
          error: () => {
            setIsSubmit(false);
            return "Failed to submit quiz";
          },
        }
      );
    } catch (error) {
      setIsSubmit(false);
      console.error("Error submitting quiz:", error);
    }

    setIsDialogOpen(false);
  };

  const extractFileName = (url: string) => {
    const segments = url.split("/");
    return segments[segments.length - 1];
  };

  const downloadFile = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      toast.error("Failed to download file", {
        position: "bottom-left",
      });
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      {isLoading && quizisLoading && <div>Loading...</div>}
      {isSuccess && lesson !== null ? (
        <Card className="relative w-full h-screen rbg-cove bg-center z-10  sm:p-10 md:p-20">
          <CardContent className=" p-0 border  rounded-xl bg-background mx-auto w-full sm:w-8/12 md:w-6/12 lg:w-7/12">
            <div className=" p-[15px]">
              <House className="cursor-pointer" onClick={goToHomePage} />
              <CardHeader className="flex">
                <div className="flex p-[15px]">
                  <div>
                    <ImageWithAuth
                      image_url={`${API_URL}/${lesson.thumbnail_image}`}
                      alt={`Lesson ${lesson.id}`}
                      imgClassName="h-auto w-[200px] rounded-xl border border-slate-400"
                    />
                  </div>
                  <div className="text-[25px] font-bold ml-[20px]">
                    {lesson.name}
                  </div>
                </div>
              </CardHeader>

              <div className="mt-[10px] rounded-xl border p-[15px] ml-[22px] mr-[22px]">
                <div className="ml-[20px] space-y-4">
                  <div className="flex items-center">
                    <Label className="text-lg font-semibold">Theory : </Label>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() =>
                        downloadFile(`${API_URL}/${lesson.theory_file}`)
                      }
                    >
                      <Download className="h-6 w-6 ml-2 mr-2" />
                      <span className="text-gray-700">
                        {extractFileName(lesson.theory_file)}
                      </span>
                    </div>
                  </div>
                  {lesson.practical_file && (
                    <div className="flex items-center">
                      <Label className="text-lg font-semibold">
                        Practical :{" "}
                      </Label>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() =>
                          downloadFile(`${API_URL}/${lesson.practical_file}`)
                        }
                      >
                        <Download className="h-6 w-6 ml-2 mr-2" />
                        <span className="text-gray-700">
                          {extractFileName(lesson.practical_file)}
                        </span>
                      </div>
                    </div>
                  )}
                  {lesson.consultation_sheet && (
                    <div className="flex items-center">
                      <Label className="text-lg font-semibold">
                        Consultation Sheets :{" "}
                      </Label>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() =>
                          downloadFile(
                            `${API_URL}/${lesson.consultation_sheet}`
                          )
                        }
                      >
                        <Download className="h-6 w-6 ml-2 mr-2" />
                        <span className="text-gray-700">
                          {extractFileName(lesson.consultation_sheet)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {quiz === undefined ? (
                <div></div>
              ) : (
                <div className="mt-[10px] rounded-xl border p-[15px] ml-[22px] mr-[22px]">
                  {quizResult !== undefined ? (
                    <div className="flex">
                      <div>Quiz - Already done </div>
                      <div>[ Quiz Result : {quizResult?.score} / 100 ] </div>
                    </div>
                  ) : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="flex">
                          <div>Start Quiz : </div>
                          <Button className="ml-2 w-[300x]" variant="outline">
                            Quiz
                          </Button>
                          {quiz.duration > 0 ? (
                            <div className="ml-2 text-red-600">
                              You have only {quiz.duration} minutes to complete
                              this Quiz
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </DialogTrigger>

                      <DialogContent
                        className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-red-200 max-h-[80vh] overflow-y-auto"
                        onInteractOutside={(e) => e.preventDefault()}
                      >
                        <DialogHeader>
                          <DialogTitle>
                            <div className="flex justify-between">
                              <div>Quiz Name: {quiz?.name}</div>

                              {quiz?.duration > 0 && (
                                <div className="border rounded-md bg-white p-2">
                                  Time Left:{formatTime(timeLeft)}
                                </div>
                              )}
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div>
                          {questions?.map(
                            (question: QuizJson, index: number) => (
                              <div
                                key={index}
                                className="mt-4 p-4 border rounded-md bg-white"
                              >
                                <p className="text-lg font-semibold mt-4 p-4 border rounded-md">{`Q${
                                  index + 1
                                } : ${question.question}`}</p>
                                <ul className="list-disc ml-6">
                                  {question.type === "single_choice"
                                    ? question.answers?.map(
                                        (answer: string, idx: number) => (
                                          <li
                                            key={idx}
                                            className="flex items-center gap-2 mt-4 p-2 border rounded-md"
                                          >
                                            <input
                                              type="radio"
                                              name={`question-${index}`}
                                              onChange={() =>
                                                handleSingleChoiceChange(
                                                  index,
                                                  idx
                                                )
                                              }
                                              className="cursor-pointer"
                                            />
                                            <label className="cursor-pointer">
                                              {answer}
                                            </label>
                                          </li>
                                        )
                                      )
                                    : question.type === "multiple_choice"
                                    ? question.answers?.map(
                                        (answer: string, idx: number) => (
                                          <li
                                            key={idx}
                                            className="flex items-center gap-2 mt-4 p-2 border rounded-md"
                                          >
                                            <input
                                              type="checkbox"
                                              onChange={(e) =>
                                                handleMultipleChoiceChange(
                                                  index,
                                                  idx,
                                                  e.target.checked
                                                )
                                              }
                                              className="cursor-pointer"
                                            />
                                            <label className="cursor-pointer">
                                              {answer}
                                            </label>
                                          </li>
                                        )
                                      )
                                    : null}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={submitQuiz}
                          disabled={isSubmit}
                        >
                          {isSubmit ? "Submitting..." : "Submit"}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div></div>
      )}
    </div>
  );
}
