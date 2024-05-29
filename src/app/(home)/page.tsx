import { SummarizeForm } from "@/components/summarize-form";

const HomePage = async () => {
  return (
    <section>
      <div>
        <h1>SUMMARIZE YOUTUBE VIDEO</h1>

        <div>
          <SummarizeForm />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
