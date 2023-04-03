<template>
  <div class="flex justify-center items-center">
    <img
      v-if="gData.icon"
      class="rounded-3xl border-4 border-white max-w-[12rem]"
      src="https://cdn.discordapp.com/icons/{{ gData.id }}/{{ gdata.icon }}.webp?size=512"
      alt="" />
    <div
      v-else
      class="rounded-3xl border-4 border-white bg-neutral-900 min-w-[12rem] aspect-square flex justify-center items-center text-6xl">
      <p>{{ gData.name[0] }}</p>
    </div>
  </div>
  <h1 class="text-3xl text-center my-3 font-bold">{{ gData.name }}</h1>
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
          <LeaderboardItem
            v-for="(user, index) in arr"
            :place="index + 1"
            :avatarURL="user.avatarURL"
            :username="user.username"
            :messages="user.messages"
            :xp="user.xp"
            :level="user.level" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '~/src/lib/supabaseClient';

  const props = defineProps({
    id: { type: String, required: true },
  });

  const arr = ref<
    {
      avatarURL: string;
      username: string;
      messages: number;
      xp: number;
      level: number;
    }[]
  >([]);

  const guild = await useFetch(`/api/discordGuild?id=${props.id}`);
  const gData = toRaw(guild.data.value);

  async function fetchData() {
    const result = await supabase
      .from('member')
      .select()
      .eq('server_id', props.id);

    if (result.error) {
      throw createError({
        statusCode: result.status,
        statusMessage: result.statusText,
        fatal: true,
      });
    }

    if (result.data.length < 1) {
      throw createError({
        statusCode: 404,
        statusMessage: `Looks like this leaderboard was not found! Or maybe no one has talked in that server yet :(`,
        fatal: true,
      });
    }

    const data = await Promise.all(
      result.data.map(async (v) => {
        const user = await useFetch(`/api/discordUser?user=${v.member_id}`);

        return {
          avatarURL: `https://cdn.discordapp.com/avatars/${v.member_id}/${user.data.value.avatar}.webp`,
          username: user.data.value.username,
          messages: v.message,
          xp: v.xp,
          level: v.level,
        };
      })
    );

    arr.value = data;

    arr.value.sort((a, b) => {
      if (a.level === b.level) return b.xp - a.xp;

      return b.level - a.level;
    });
  }

  fetchData();
</script>
