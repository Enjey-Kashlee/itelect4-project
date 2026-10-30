import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createItem, fetchStudentReporters } from "../api/client";
import { itemSchema } from "../schemas/itemSchema";
import useAuthStore from "../store/authStore";
import type { NewItem } from "../types/index";

export default function AddItemPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const students = useQuery({
    queryKey: ["admin", "students", userId],
    queryFn: fetchStudentReporters,
  });
  const navigate = useNavigate();
  const client = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewItem>({
    resolver: zodResolver(
      itemSchema.refine(
        (values) =>
          students.data?.some((student) => student.id === values.reportedById),
        {
          path: ["reportedById"],
          message: "Choose an active student reporter.",
        },
      ),
    ),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      reportedById: "",
    },
  });
  const create = useMutation({
    mutationFn: createItem,
    retry: false,
    onSuccess: (item) => {
      void client.invalidateQueries({ queryKey: ["items"] });
      client.setQueryData(["items", item.id], item);
      navigate(`/items/${item.id}`, { state: { itemCreated: true } });
    },
  });

  return (
    <div className="max-w-2xl text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold">Add item</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Record an item handed to the office. It will appear as Lost so students
        can submit ownership claims.
      </p>
      <form
        onSubmit={handleSubmit((values) => create.mutate(values))}
        className="mt-6"
      >
        <fieldset disabled={create.isPending} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="item-title" className="text-foreground">
              Title
            </Label>
            <Input
              id="item-title"
              maxLength={120}
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
              aria-describedby="item-title-error"
            />
            {errors.title && (
              <p
                id="item-title-error"
                role="alert"
                className="text-sm text-red-700 dark:text-red-300"
              >
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="item-description" className="text-foreground">
              Description
            </Label>
            <textarea
              id="item-description"
              rows={4}
              maxLength={1000}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
              aria-describedby="item-description-error"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus-visible:outline-blue-400"
            />
            {errors.description && (
              <p
                id="item-description-error"
                role="alert"
                className="text-sm text-red-700 dark:text-red-300"
              >
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="item-location" className="text-foreground">
              Location
            </Label>
            <Input
              id="item-location"
              maxLength={200}
              {...register("location")}
              aria-invalid={Boolean(errors.location)}
              aria-describedby="item-location-help item-location-error"
            />
            <p
              id="item-location-help"
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              Where the item was found or reported. Pickup is at the office.
            </p>
            {errors.location && (
              <p
                id="item-location-error"
                role="alert"
                className="text-sm text-red-700 dark:text-red-300"
              >
                {errors.location.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="item-reporter" className="text-foreground">
              Reported by
            </Label>
            <select
              id="item-reporter"
              {...register("reportedById")}
              disabled={!students.data?.length || students.isFetching}
              aria-invalid={Boolean(errors.reportedById)}
              aria-describedby="item-reporter-help item-reporter-error"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus-visible:outline-blue-400"
            >
              <option value="">Choose a student</option>
              {students.data?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
            <p
              id="item-reporter-help"
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              Choose the student who handed this item to the office.
            </p>
            {errors.reportedById && (
              <p
                id="item-reporter-error"
                role="alert"
                className="text-sm text-red-700 dark:text-red-300"
              >
                {errors.reportedById.message}
              </p>
            )}
            {students.isPending && (
              <p role="status">Loading student reporters...</p>
            )}
            {students.isError && (
              <div role="alert">
                <p>{students.error.message}</p>
                <Button type="button" onClick={() => void students.refetch()}>
                  Retry loading students
                </Button>
              </div>
            )}
            {students.data?.length === 0 && (
              <p role="status">
                A student must register before an item can be attributed to
                them.
              </p>
            )}
          </div>
          {create.isError && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              {create.error.message}
            </p>
          )}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={!students.data?.length || students.isFetching}
            >
              {create.isPending ? "Creating..." : "Create item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/items")}
            >
              Cancel
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
