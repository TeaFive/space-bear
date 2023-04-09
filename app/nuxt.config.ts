if (!process.env.DISCORD_BOT_TOKEN)
  throw Error('Could not find "DISCORD_BOT_TOKEN" in .env file');
if (!process.env.SUPABASE_URL)
  throw Error('Could not find "SUPABASE_URL" in .env file');
if (!process.env.SUPABASE_ANON_KEY)
  throw Error('Could not find "SUPABASE_ANON_KEY" in .env file');
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/devtools', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: 'sbWave.png' }],
    },
  },
  googleFonts: {
    families: {
      Poppins: [400, 500, 700],
    },
  },
});

