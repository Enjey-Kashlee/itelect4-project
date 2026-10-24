import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { askAi } from "../api/client";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "../schemas/reviewSchema";
import type { AiReview } from "../types/index";

const READINESS_STYLE: Record<AiReview["readiness"], string> = {
  ready: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  almost:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  "not-yet": "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
};

function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });
  const review = useMutation({ mutationFn: askAi, retry: false });

  return (
    <div className="max-w-2xl text-gray-900 dark:text-white">
      <h1 className="mb-2 text-2xl font-bold">AI Claim Review</h1>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Get suggestions for your ownership description before submitting a
        claim. AI feedback can be wrong and does not approve a claim. Staff
        decide ownership.
      </p>
      <form
        onSubmit={handleSubmit(({ prompt }) => review.mutate(prompt))}
        className="grid gap-4"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="review-prompt" className="text-foreground">
            Item and ownership evidence
          </Label>
          <textarea
            id="review-prompt"
            rows={6}
            {...register("prompt")}
            aria-invalid={Boolean(errors.prompt)}
            aria-describedby="review-help review-input-error"
            placeholder="What did you lose? Describe identifying marks, when and where you lost it, and any existing photo or receipt."
            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <p
            id="review-help"
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            Use 20–2000 characters. This description is sent to Google Gemini.
            Leave out passwords, full ID numbers, and other sensitive personal
            details.
          </p>
          <p
            id="review-input-error"
            role="alert"
            className="text-sm text-red-700 dark:text-red-300"
          >
            {errors.prompt?.message}
          </p>
        </div>
        <Button
          type="submit"
          disabled={review.isPending}
          className="justify-self-start"
        >
          {review.isPending ? "Reviewing..." : "Review my description"}
        </Button>
      </form>
      <div aria-live="polite" aria-busy={review.isPending} className="mt-4">
        {review.isPending && (
          <p className="text-sm">Reviewing your description...</p>
        )}
        {review.isError && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {review.error.message}
          </p>
        )}
        {review.isSuccess && (
          <section
            aria-label="AI review result"
            className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <span
              className={`justify-self-start rounded px-2 py-1 text-sm font-semibold ${READINESS_STYLE[review.data.readiness]}`}
            >
              Description readiness: {review.data.readiness}
            </span>
            <p className="break-words">{review.data.summary}</p>
            <div>
              <h2 className="font-semibold">Useful details</h2>
              <ul className="list-disc space-y-1 break-words pl-5 text-sm">
                {review.data.strengths.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold">Before you submit a claim</h2>
              <ul className="list-disc space-y-1 break-words pl-5 text-sm">
                {review.data.improvements.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ReviewPage;
