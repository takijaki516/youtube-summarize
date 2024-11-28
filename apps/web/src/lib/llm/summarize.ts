import { openai } from "./openai";

const SYSTEMPROMPT = `You are an expert at summarizing and structuring content into a comprehensive guide.
Below is a script from a video that I am making into a companion guide blog post first.
- This is a continuation of a guide so include chapters, key summaries, and incorporate visual aids and direct links to relevant parts of the video however do not include any conclusion or overarching title.
- For direct links, portions of the text should be hyperlinked to their corresponding times in the video.
- To indicate that a sentence should be hyperlinked, insert the raw text of the transcript next to the word with the indicator <HYPERLINK: "corresponding transcript text">.
- It is crucial to use the raw text from the transcript that will be used, as the additional tools that will be inserting the hyperlinks need this to know where in the video to look.
- You must to match to language of the transcript AT ALL COSTS!!! If transcript is korean, you must to write korean!!!
- Follow these instructions to create a structured guide from the transcript AT ALL COSTS!!! This is very important for blog post!!!
- I will tip you extra if you do this well.

In this blog post, in addition to the paragraphs:

Create titles or headings that encapsulate main points and ideas!!

Format your response in markdown, ensuring distinction and clean styling between titles and paragraphs.
Be sure to include the image placeholders, and hyperlinks with enough distinguishable text WITHOUT ANY QUOTATIONS, as the placeholders will be fed into a semantic search algorithm.
This structured approach will be applied to the entire transcript.
The example below only shows one style, but use multiple styles including different headings, bullet points, and other markdown elements when needed.

Here are shortened example of the input and shortened expected output:

example input:

Hi everyone. So in this video I'd like us to cover the process of tokenization in large language models. Now you see here that I have a sad face and that's because tokenization is my least favorite part of working with large language models but unfortunately it is necessary to understand in some detail because it is fairly hairy, gnarly and there's a lot of hidden foot gums to be aware of and a lot of oddness with large language models typically traces back to tokenization. So what is tokenization? Now in my previous video Let's Build GPT from Scratch we actually already did tokenization but we did a very naive simple version of tokenization. So when you go to the Google Colab for that video you see here that we loaded our training set and our training set was this Shakespeare dataset. Now in the beginning the Shakespeare dataset is just a large string in Python it's just text and so the question is how do we plug text into large language models and in this case here we created a vocabulary of 65 possible characters that we saw occur in this string. These were the possible characters and we saw that there are 65 of them and then we created a lookup table for converting from every possible character a little string piece into a token an integer. So here for example we tokenized the string hi there and we received this sequence of tokens and here we took the first 1000 characters of our dataset and we encoded it into tokens and because this is character level we received 1000 tokens in a sequence so token 18, 47, etc. Now later we saw that the way we plug these tokens into the language model is by using an embedding table and so basically if we have 65 possible tokens then this embedding table is going to have 65 rows and roughly speaking we're taking the integer associated with every single token we're using that as a lookup into this table and we're plucking out the corresponding row and this row is trainable parameters that we're going to train using backpropagation and this is the vector that then feeds into the transformer and that's how the transformer sort of perceives every single token. So here we had a very naive tokenization process that was a character level tokenizer

example output:

Introduction to Tokenization
----------------------------

Welcome to our comprehensive guide on tokenization in large language models (LLMs). Tokenization is a critical yet complex aspect of working with LLMs, essential for understanding how these models process text data. Despite its challenges, tokenization is foundational, as it converts strings of text into sequences of tokens, small units of text that LLMs can manage more effectively.

Understanding the Basics of Tokenization
----------------------------------------

Tokenization involves creating a vocabulary from all unique characters or words in a dataset and converting each into a corresponding integer token. This process was briefly introduced in our "Let's Build GPT from Scratch" video, where we tokenized a Shakespeare dataset at a character level, creating a vocabulary of 65 possible characters.

<HYPERLINK: So what is tokenization? Now in my previous video Let's Build GPT from Scratch we actually already did tokenization but we did a very naive simple version of tokenization. So when you go to the Google Colab for that video you see here that we loaded>

The Role of Embedding Tables in Tokenization
--------------------------------------------

After tokenization, the next step involves using an embedding table, where each token's integer is used as a lookup to extract a row of trainable parameters. These parameters, once trained, feed into the transformer model, allowing it to perceive each token effectively.

end examples.

Remember to Create titles or headings that encapsulate main points and ideas!!!
Also remember to match the language of the transcript AT ALL COSTS!!!
`;

export async function generateSummary(transcript: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEMPROMPT,
        },
        {
          role: "user",
          content: `Here is the transcript: ${transcript}. This is very important to me!! TRY YOUR BEST!!!`,
        },
      ],
      temperature: 0,
    });

    const generatedSummary =
      response.choices[0]?.message?.content || "Unable to generate summary.";

    return generatedSummary;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
}
