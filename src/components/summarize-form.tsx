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
        className="flex flex-col"
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
        <div>
          <FormField
            disabled={form.formState.isSubmitting}
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch"
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
                      <Settings2 />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
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
                        <DropdownMenuRadioItem value="llama3"></DropdownMenuRadioItem>
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
          className="group"
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              Summarize
              <ListVideo />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
