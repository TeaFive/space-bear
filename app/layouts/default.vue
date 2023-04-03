<template>
  <div
    class="grid min-h-[100vh] min-h-[100dvh]"
    style="grid-template-rows: auto 1fr auto">
    <header class="mb-5 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
      <nav
        class="container m-auto p-8 flex justify-between text-2xl items-center h-8">
        <NuxtLink class="flex items-center cursor-pointer" to="/" id="nav-logo">
          <Logo class="mr-1 w-full" />
          Space Bear
        </NuxtLink>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
        </ul>
      </nav>
    </header>
    <main class="container m-auto h-full">
      <slot />
    </main>
    <footer class="container flex justify-end mt-auto m-2">
      <p>
        Made with 💜 by
        <a
          class="underline"
          href="https://github.com/FroggyPanda"
          target="_blank">
          Panda
        </a>
      </p>
    </footer>
  </div>
</template>

<style>
  * {
    font-family: 'Poppins', sans-serif;
  }

  body {
    @apply bg-neutral-800 text-white min-h-screen;
  }

  a:hover:not(#nav-logo) {
    @apply text-slate-400;
  }

  .router-link-exact-active:not(#nav-logo) {
    @apply font-bold;
  }
</style>
