"use client";

import Link from "next/link";
import { Loader, ShieldCheck, ShieldX } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FactCheckerResponse, checkFacts } from "@/app/actions";

export const FactCheckFormSchema = z.object({
  summary: z.string(),
});

export const FactCheck = ({ summary }: { summary: string }) => {
  const [isAccurate, setIsAccurate] = useState<"true" | "false" | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);

  const factCheckForm = useForm<z.infer<typeof FactCheckFormSchema>>({
    resolver: zodResolver(FactCheckFormSchema),
    defaultValues: {
      summary: summary,
    },
  });

  const onSubmit = async (data: z.infer<typeof FactCheckFormSchema>) => {
    await checkFacts(data).then((value: FactCheckerResponse) => {
      if (!value) {
        return toast.error("An error occurred while checking the facts");
      }

      setIsAccurate(value.isAccurate);
      setSource(value.source);
      setOutput(value.text);
      return;
    });
  };

  return (
    <Form {...factCheckForm}>
      <form
        className="flex flex-col w-full gap-5 rounded-xl border
        p-5 outline-dashed outline-2 outline-muted"
        onSubmit={factCheckForm.handleSubmit(onSubmit)}
      >
        <div className="text-justify text-xs md:text-left">
          {output ? (
            <div className="flex flex-col gap-2">
              <Badge className="max-w-fit">
                {isAccurate === "true" ? (
                  <>
                    <ShieldCheck className="mr-2 size-4" />
                    Accurate
                  </>
                ) : (
                  <>
                    <ShieldX className="mr-2 size-4" />
                    InAccurate
                  </>
                )}
              </Badge>
              <div className="mt-4">{output}</div>
              <Link
                className="mt-2 text-xs text-muted-foreground"
                href={source!}
              >
                {source?.slice(0, 40).concat("...")}
              </Link>
            </div>
          ) : (
            `search to check if the summary is accurate or not.`
          )}
        </div>

        {!output && (
          <Button
            type="submit"
            className="group w-full"
            disabled={factCheckForm.formState.isSubmitting}
          >
            {factCheckForm.formState.isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin duration-1000" />
              </>
            ) : (
              <>Check for Truth</>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};
