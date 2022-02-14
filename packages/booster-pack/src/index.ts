import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { Handler } from "aws-lambda";
import { getPostImage, getPostInsights, getPosts, postImage } from "./posts";

const MIN_REACTS = 5;

export const handler: Handler = async () => {
  const ssmClient = new SSMClient({ region: process.env.AWS_REGION });
  const getParameterCommand = new GetParameterCommand({
    Name: process.env.SSM_NAME,
    WithDecryption: true,
  });

  const { Parameter } = await ssmClient.send(getParameterCommand);
  const token = Parameter?.Value;

  if (!token) {
    console.warn("No Facebook Token found");
    throw new Error("No Facebook Token found");
  }

  const posts = await getPosts({ token });
  const reactions = [];

  for (let i = 0; i < posts.length; i++) {
    const id = posts[i].id;
    const title = posts[i].message.split("\n")[0].split(":")[1].trim();
    reactions.push({
      id,
      title,
      reactions: await getPostInsights({ token, id }),
    });
  }

  reactions.sort((a, b) => b.reactions - a.reactions);
  const cardsToPost = reactions.filter(
    ({ reactions }) => reactions >= MIN_REACTS
  );

  for (let i = 0; i < cardsToPost.length; i++) {
    const card = cardsToPost[i];
    const message = `Card Name: ${card.title}\nTotal Reactions: ${card.reactions}`;
    const url = await getPostImage({ token, id: card.id });
    const { post_id } = await postImage({ token, url, message });

    console.log(`Posted ${post_id}, ${card.reactions} Reactions`);
  }
};
