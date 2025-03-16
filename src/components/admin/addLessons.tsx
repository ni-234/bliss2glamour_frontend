import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ACCEPTED_DOCUMENT_TYPES,
  ACCEPTED_IMAGE_TYPES,
  lessonFormSchema,
  LessonFormType,
} from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLessonFunction } from "@/functions/apiFunctions";
import { toast } from "sonner";

const getImageData = (event: ChangeEvent<HTMLInputElement>) => {
  const dataTransfer = new DataTransfer();

  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
};

export function AddLesson() {
  const [preview, setPreview] = useState<string>("");
  const [showConsultant, setShowConsultant] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<LessonFormType>({
    resolver: zodResolver(lessonFormSchema),
  });

  const addLessonMutation = useMutation({
    mutationKey: ["addLesson"],
    mutationFn: (values: LessonFormType) =>
      addLessonFunction(localStorage.getItem("access_token")!, values),
    onSuccess: () => {
      form.reset();
      setPreview("");
      setShowConsultant(false);
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });

  const onSubmit = (values: LessonFormType) => {
    // console.log(values);
    // setPreview("");
    // setShowConsultant(false);
    // form.reset();
    toast.promise(() => addLessonMutation.mutateAsync(values), {
      loading: "Creating Lesson",
      success: "Lesson Created Successfully",
      error: "Failed to Create Lesson",
    });
  };

  const onReset = () => {
    setPreview("");
    setShowConsultant(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-center gap-4 w-80"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>Lesson Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="space-y-2 text-sm">
              <FormLabel>Lesson Thumbnail Image</FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(event) => {
                    const { files, displayUrl } = getImageData(event);
                    setPreview(displayUrl);
                    onChange(files);
                  }}
                />
              </FormControl>
              <FormMessage />
              {preview !== "" && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Uploaded Preview"
                    className="h-auto rounded border w-24"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theory"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Upload Theory</FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="practical"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Upload Practical</FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                  onChange={(event) => {
                    if (!showConsultant) {
                      setShowConsultant(true);
                    }
                    onChange(event.target.files && event.target.files[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showConsultant && (
          <FormField
            control={form.control}
            name="consultation"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Upload Consultation Sheet</FormLabel>
                <FormControl>
                  <Input
                    {...rest}
                    type="file"
                    accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                    onChange={(event) => {
                      onChange(event.target.files && event.target.files[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex gap-2">
          <Button type="submit" className="w-3/4">
            Create Your Lesson
          </Button>
          <Button
            onClick={onReset}
            variant={"destructive"}
            type="reset"
            className="w-1/4"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
