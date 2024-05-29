"use client";

import { useRouter } from "next/navigation";
import { ListVideo, Loader, Settings2 } from "lucide-react";
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
  model: z.enum(["gpt-3.5-turbo", "gpt-4o", "llama3"]),
});

export const SummarizeForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "gpt-3.5-turbo",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full items-start gap-2 md:flex-row"
        onSubmit={form.handleSubmit(async (data) => {
          await handleInitialFormSubmit(data).then((value: string | null) => {
            if (value) {
              toast.info("Redirecting...");

              return router.push(`/${value}`);
            }
            toast.error("error generating summary, please try again later.");
            return router.refresh(); // REVIEW: does this revalidate cache?
          });
        })}
      >
        <div className="flex w-full gap-2 md:max-w-2xl">
          <FormField
            disabled={form.formState.isSubmitting}
            control={form.control}
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
            disabled={form.formState.isSubmitting}
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={form.formState.isSubmitting}
                      className="group"
                      variant={"secondary"}
                      size={"icon"}
                    >
                      <Settings2 className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>choose a model</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <DropdownMenuRadioItem value="gpt-3-turbo">
                        gpt-3-turbo
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="gpt-4o">
                        gpt-4o
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="llama3">
                        llama3
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={form.formState.isSubmitting}
          className="group w-full md:max-w-fit"
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader className="size-4 animate-spin duration-1000" />
            </>
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
