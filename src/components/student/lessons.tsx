import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllLessonsFunction } from "@/functions/apiFunctions";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ImageWithAuth from "../imageWithAuth";
import { API_URL } from "@/functions/networkFunctions";

export function Lesson() {
  const navigate = useNavigate();

  const goToLessonDetail = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  const {
    isError,
    isSuccess,
    data: lessonsList,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: () =>
      getAllLessonsFunction(localStorage.getItem("access_token") as string),
  });

  return (
    <div>
      <div className="text-center font-bold text-indigo-950 mt-12 m-[60px]">
        Lessons
      </div>
      {isError && <div>Error fetching data</div>}
      {isSuccess && lessonsList.length !== 0 ? (
        <Carousel className="relative w-full max-w-[900px] mx-auto overflow-hidden">
          {/* Left Arrow */}
          <CarouselPrevious className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
            <button className="bg-indigo-500 text-white p-2 rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none">
              ←
            </button>
          </CarouselPrevious>

          <CarouselContent className="flex gap-4">
            {lessonsList.map((lesson) => (
              <CarouselItem
                key={lesson.id}
                className="flex-[0_0_33.33%] cursor-pointer"
                onClick={() => goToLessonDetail(lesson.id)}
              >
                <Card className="w-full">
                  <CardHeader>
                    <CardDescription>
                      <ImageWithAuth
                        alt={`Lesson ${lesson.id}`}
                        imgClassName=" rounded border mx-auto w-32 sm:w-40 md:w-48 aspect-square"
                        image_url={`${API_URL}/${lesson.thumbnail_image}`}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent
                    className="text-center"
                    // onClick={() => goToLessonDetail(lesson.id)}
                  >
                    {lesson.name}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Right Arrow */}
          <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <button className="bg-indigo-500 text-white p-2 rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none">
              →
            </button>
          </CarouselNext>
        </Carousel>
      ) : (
        <div>There are no lessons</div>
      )}
    </div>
  );
}
