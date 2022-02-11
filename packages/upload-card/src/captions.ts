const randomElement = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const createCaption = (title: string) => {
  const options = [
    `Wow! I can't believe I found ${title}.`,
    `I SUMMON THE ALL-POWERFUL ${title}!`,
    `HAH! Your monsters may be powerful, Kaiba, but they are no match for the heart of the cards! My grandfather gave me this card, and I will use it wisely. Go, ${title}!`,
    `Oh no! How will Joey win when he's facing ${title}?!`,
    `${title}? What's that? I've never seen that card before!`,
    `Let's Duel! ${title}!`,
    `It's time to d-d-d-d-d-duel!`,
    `With this ${title}, you're finished!`,
    `My latest creation! ${title}!`,
    `Welp, this one's going on the ban list...`,
    `Aha! ${title} is just what my deck needed!`,
  ];

  return randomElement<string>(options);
};
