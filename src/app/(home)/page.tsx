import { SummarizeForm } from "@/components/summarize-form";

const HomePage = async () => {
  return (
    <section className="container mt-10 flex items-center justify-center md:mt-28">
      <div className="flex flex-col max-w-5xl items-start gap-5">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          SUMMARIZE YOUTUBE VIDEO
        </h1>

        <div className="mt-4 w-full">
          <SummarizeForm />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
