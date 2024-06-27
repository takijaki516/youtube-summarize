"use client";

import { useRouter } from "next/navigation";
import { ListVideo, Loader, Bot } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { handleInitialFormSubmit } from "@/app/actions";

export const formSchema = z.object({
  link: z.string().describe("the youtube video you would like to summarize"),
  model: z.enum(["gpt-3.5-turbo", "gpt-4o"]),
});

export const SummarizeForm = () => {
  const router = useRouter();

  const summaryForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "gpt-3.5-turbo",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await handleInitialFormSubmit(data).then((value: string | null) => {
      if (value) {
        toast.success("generated summary successfully, redirecting...");
        return router.push(`/${value}`);
      }

      toast.error("error generating summary, please try again later.");
      return router.refresh(); // REVIEW: does this revalidate cache?
    });
  };

  return (
    <Form {...summaryForm}>
      <form
        className="flex flex-col w-full items-start gap-4"
        onSubmit={summaryForm.handleSubmit(onSubmit)}
      >
        <div className="flex w-full gap-2">
          <FormField
            disabled={summaryForm.formState.isSubmitting}
            control={summaryForm.control}
            name="link"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/....."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            disabled={summaryForm.formState.isSubmitting}
            control={summaryForm.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={summaryForm.formState.isSubmitting}
                      className="group"
                      variant={"secondary"}
                      size={"icon"}
                    >
                      <Bot className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>choose a model</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <DropdownMenuRadioItem value="gpt-3.5-turbo">
                        gpt-3-turbo
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="gpt-4o">
                        gpt-4o
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={summaryForm.formState.isSubmitting}
          // REVIEW:
          className="group w-full"
          type="submit"
        >
          {summaryForm.formState.isSubmitting ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <>
              Summarize
              <ListVideo className="ml-2 size-4 transition-all duration-200 group-hover:ml-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
