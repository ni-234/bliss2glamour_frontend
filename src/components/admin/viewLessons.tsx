import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLessonFunction,
  getAllLessonsFunction,
} from "@/functions/apiFunctions";
import { toast } from "sonner";

export function ViewLessons() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleEditClick = (id: number) => {
    navigate(`/admin/lesson/edit/${id}`);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteLessonFunction(
        localStorage.getItem("access_token") as string,
        id
      );
      toast.success("Lesson deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    } catch (error) {
      console.error(error);
      toast.error("Error deleting lesson");
    }
  };

  const {
    isError,
    isSuccess,
    data: lessonData,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: () =>
      getAllLessonsFunction(localStorage.getItem("access_token") as string),
  });

  return (
    <div>
      <div className="text-center font-bold text-indigo-950 mt-12">Lessons</div>
      {isError && <div>Error fetching data</div>}
      {isSuccess && lessonData.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lesson Name</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessonData.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.name}</TableCell>
                <TableCell>
                  <Pencil
                    className="cursor-pointer "
                    onClick={() => handleEditClick(lesson.id)}
                  />
                </TableCell>
                <TableCell>
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => handleDeleteClick(lesson.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>No lessons found</div>
      )}
    </div>
  );
}
