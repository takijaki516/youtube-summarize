import { SummarizeForm } from "@/components/summarize-form";

const HomePage = async () => {
  return (
    <div className="container mt-10 flex items-center justify-center md:mt-28">
      <div className="w-full md:w-auto flex flex-col items-start gap-5">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-800">
          SUMMARIZE YOUTUBE VIDEO
        </h1>

        <SummarizeForm />
      </div>
    </div>
  );
};

export default HomePage;
