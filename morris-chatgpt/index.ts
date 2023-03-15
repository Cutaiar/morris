export async function promptForMorris(): Promise<string> {
  const openAIAPIKey = undefined; // Get this from https://platform.openai.com/account/api-keys but to not commit

  if (openAIAPIKey === undefined) {
    console.error(
      "No OpenAI API Key defined. Get it from https://platform.openai.com/account/api-keys."
    );
    return Promise.resolve("No OpenAI API Key defined.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "We are playing a game of 9 mans morris. It's my turn first, and we will play until there is a winner or a draw. Board locations are denoted  from inner ring to outer ring, starting at 0 for the top left node in the inner most ring and moving clockwise around it. Then moving to the next ring out until all the locations are numbered.",
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${openAIAPIKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = await response.json();

  if (response.ok) {
    console.log(data);
    const reply = data?.choices?.[0]?.message?.content;
    if (reply) {
      return Promise.resolve(reply);
    } else {
      return Promise.reject(new Error("Issue with ChatGPT Response"));
    }
  } else {
    return Promise.reject(response.status);
  }
}
