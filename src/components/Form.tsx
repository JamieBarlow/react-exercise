import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  TextField,
  Select,
  ErrorText,
} from "@cruk/cruk-react-components";
import { Dispatch, SetStateAction } from "react";
import { NasaSearchParams } from "../types";

export const formSchema = z.object({
  keywords: z
    .string()
    .min(2, { message: "keywords must have at least 2 characters." })
    .max(50, { message: "keywords must have at most 50 characters." }),
  mediaType: z.enum(["audio", "video", "image"], {
    message: "Please select a media type.",
  }),
  yearStart: z.union([
    z.coerce
      .number()
      .int({ message: "Please enter a valid number." })
      .gte(1900, { message: "Year start must be after 1900." })
      .lte(new Date().getFullYear(), {
        message: "Year start must not be in the future.",
      }),
    z.string().refine((value) => value === "", {
      message: "Please enter a valid number.",
    }),
  ]),
});

export type FormValues = z.infer<typeof formSchema>;

export const initialData = {
  keywords: "",
  mediaType: "",
  yearStart: "",
} as unknown as FormValues;

export function Form({
  setValues,
}: {
  setValues: Dispatch<SetStateAction<NasaSearchParams | undefined>>;
}) {
  const formProps = useForm<FormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    register,
  } = formProps;

  const onSubmit: SubmitHandler<FormValues> = async (data): Promise<void> => {
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setValues(data);
    } catch (error) {
      setError("root", {
        message: "Form has encountered error.",
      });
    }
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom="m">
          <TextField
            {...register("keywords")}
            errorMessage={errors.keywords?.message}
            label="Keywords"
            required
          />
        </Box>
        <Box marginBottom="m">
          <Select
            {...register("mediaType")}
            errorMessage={errors.mediaType?.message}
            label="Media Type"
            required
          >
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
          </Select>
        </Box>
        <Box marginBottom="m">
          <TextField
            {...register("yearStart")}
            errorMessage={errors.yearStart?.message}
            label="Year start"
          />
        </Box>
        <Box marginBottom="m">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Loading..." : "Submit"}
          </Button>
        </Box>
        {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
      </form>
    </>
  );
}
