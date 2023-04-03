export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const result = await fetch(`https://discord.com/api/users/${query.user}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });

  return await result.json();
});
