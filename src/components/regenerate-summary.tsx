// "use client";

// import { Bot, Loader } from "lucide-react";
// import { toast } from "sonner";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Button } from "./ui/button";
// import { Form, FormField, FormItem } from "./ui/form";
// import { handleRegenerateSummary } from "@/app/actions";

// export const RegenerateSummaryFormSchema = z.object({
//   videoId: z.string().describe("the youtube video you would like to summarize"),
//   model: z.enum(["gpt-3.5-turbo", "gpt-4o"]),
// });

// export const RegenerateSummary = ({ videoId }: { videoId: string }) => {
//   const regenerateForm = useForm<z.infer<typeof RegenerateSummaryFormSchema>>({
//     resolver: zodResolver(RegenerateSummaryFormSchema),
//     defaultValues: {
//       videoId: videoId,
//       model: "gpt-3.5-turbo",
//     },
//   });

//   const onSubmit = async (
//     data: z.infer<typeof RegenerateSummaryFormSchema>
//   ) => {
//     await handleRegenerateSummary(data).then(async (res) => {
//       // NOTE: res is boolean. (go see function definition)
//       if (!res) {
//         return toast.error("An error occurred while regenerating the summary");
//       }

//       return toast.success("Summary regenerated successfully");
//     });
//   };

//   return (
//     <Form {...regenerateForm}>
//       <form
//         className="flex gap-2"
//         onSubmit={regenerateForm.handleSubmit(onSubmit)}
//       >
//         <FormField
//           disabled={regenerateForm.formState.isSubmitting}
//           control={regenerateForm.control}
//           name="model"
//           render={({ field }) => (
//             <FormItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button>
//                     <Bot />
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="start">
//                   <DropdownMenuLabel>Choose your AI model</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuRadioGroup
//                     value={field.value}
//                     onValueChange={field.onChange}
//                   >
//                     <DropdownMenuRadioItem
//                       value="gpt-3.5-turbo"
//                       className="cursor-pointer"
//                     >
//                       GPT-3.5 Turbo
//                     </DropdownMenuRadioItem>
//                     <DropdownMenuRadioItem
//                       value="gpt-4o"
//                       className="cursor-pointer"
//                     >
//                       GPT-4o
//                     </DropdownMenuRadioItem>
//                   </DropdownMenuRadioGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </FormItem>
//           )}
//         />

//         <Button
//           type="submit"
//           variant={"secondary"}
//           disabled={regenerateForm.formState.isSubmitting}
//         >
//           {regenerateForm.formState.isSubmitting ? (
//             <>
//               <Loader className="animate-spin" />
//             </>
//           ) : (
//             <div>Regenerate</div>
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// };
