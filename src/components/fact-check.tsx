"use client";

import Link from "next/link";
import { Loader, ShieldCheck, ShieldX } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "react-hook-form";
import { useState } from "react";

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

  return (
    <Form {...factCheckForm}>
      <form
        className="flex flex-col"
        onSubmit={factCheckForm.handleSubmit(async (data) => {
          await checkFacts(data).then((value: FactCheckerResponse) => {
            if (!value) {
              return toast.error("An error occurred while checking the facts");
            }

            setIsAccurate(value.isAccurate);
            setSource(value.source);
            setOutput(value.text);
            return;
          });
        })}
      >
        <p>
          {output ? (
            <div>
              <Badge>
                {isAccurate === "true" ? (
                  <>
                    <ShieldCheck />
                    Accurate
                  </>
                ) : (
                  <>
                    <ShieldX />
                    InAccurate
                  </>
                )}
              </Badge>
              <Link href={source!}>{source?.slice(0, 40).concat("...")}</Link>
            </div>
          ) : (
            `fact check the summary`
          )}
        </p>

        {!output && (
          <Button type="submit" disabled={factCheckForm.formState.isSubmitting}>
            {factCheckForm.formState.isSubmitting ? (
              <>
                <Loader />
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
