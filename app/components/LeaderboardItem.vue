<template>
  <div>
    <div class="block">
      <div
        class="rounded-lg py-3 pl-6 pr-4 w-full grid grid-cols-3 bg-neutral-800">
        <div class="flex items-center justify-start col-span-2">
          <p
            class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-6 font-bold text-dark-100 bg-dark-500 text-base">
            {{ place }}
          </p>
          <img class="h-8 w-8 rounded-full min-w-[2rem]" :src="avatarURL" />
          <p class="ml-3 font-semibold text-neutral-100">{{ username }}</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3">
          <p
            class="text-neutral-300 hidden lg:flex items-center justify-center">
            {{ messages }}
          </p>
          <p
            class="text-neutral-300 hidden lg:flex items-center justify-center">
            {{ xp }}
          </p>
          <div class="flex items-center justify-center">
            <div
              class="leaderboardPlayerStat flex flex-col justify-center lg:items-center rounded-full p-px w-[40px] h-[40px] min-w-[40px] min-h-[40px] relative p72">
              <div class="flex flex-col items-center justify-center -mt-px">
                <p class="font-bold text-white text-base">{{ level }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    place: { type: Number, required: true },
    avatarURL: { type: String, required: true },
    username: { type: String, required: true },
    messages: { type: Number, required: true },
    xp: { type: Number, required: true },
    level: { type: Number, required: true },
  });
</script>
