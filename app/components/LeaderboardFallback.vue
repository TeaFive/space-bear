<template>
  <div
    class="relative bg-neutral-900 shadow-xs sub_feature_card mb-4 rounded-lg">
    <h3
      class="text-h6 text-neutral-100 flex justify-between items-start hover:text-neutral-200 py-4 lg:py-6 px-6">
      Leaderboard
    </h3>
    <div class="p-6 pt-0">
      <div
        class="grid w-full border-t border-solid border-neutral-700 pt-4"></div>
      <div class="grid grid-cols-1 gap-1.5">
        <div class="grid grid-cols-3 pl-6 pr-4 py-3">
          <div class="col-span-2 flex items-center justify-start">
            <p class="text-sm text-neutral-300 w-9 text-center mr-6">#</p>
            <p class="text-sm text-neutral-300">User</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3">
            <p class="text-sm text-neutral-300 text-center hidden lg:block">
              Messages
            </p>
            <p class="text-sm text-neutral-300 text-center hidden lg:block">
              XP
            </p>
            <p class="text-sm text-neutral-300 text-center">Level</p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1.5">
          <div class="loader flex justify-center items-center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .loader::after {
    content: '';
    width: 4rem;
    height: 4rem;
    border: 0.25rem solid white;
    border-top-color: #3b82f6;
    border-radius: 100%;
    animation: loading 2s linear infinite;
  }

  @keyframes loading {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
</style>
