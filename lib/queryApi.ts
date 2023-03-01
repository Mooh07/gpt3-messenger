import openAi from "./openAi";

export const query = async (prompt: string, chatId: string, model: string) => {
  try {
    const completion = await openAi.createCompletion({
      model: model,
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // TODO: ADD STREAM
    });
    return completion.data.choices[0].text;
  } catch (error: any) {
    return `chatGPT was unable to find an answer! ERROR: ${error.message}`;
  }
};

export default query