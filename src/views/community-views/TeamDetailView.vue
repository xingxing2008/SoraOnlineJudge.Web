<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { userInfo, isLoggedIn } from '@/stores/userStore';

document.title = "Sora Online Judge • 团队详情";

const router = useRouter();
const route = useRoute();
const teamId = route.params.id;

// 模拟数据
const team = ref({
  id: teamId,
  name: '算法竞赛小队',
  description: '专注于算法竞赛训练和准备的小团队，欢迎有志于参加ACM-ICPC的同学加入！',
  createdAt: '2023-12-15',
  owner: 'alice',
  memberCount: 15,
  isPublic: true,
  contests: [
    { id: 1, title: '团队周赛 #1', startTime: '2024-03-15 19:00', status: '即将开始' },
    { id: 2, title: '算法基础训练', startTime: '2024-02-28 14:00', status: '已结束' }
  ]
});

const members = ref([
  { id: 1, username: 'alice', nickname: 'Alice', role: '管理员', joinDate: '2023-12-15', solved: 120, rating: 1800 },
  { id: 2, username: 'bob', nickname: 'Bob', role: '成员', joinDate: '2023-12-16', solved: 95, rating: 1650 },
  { id: 3, username: 'charlie', nickname: 'Charlie', role: '成员', joinDate: '2023-12-17', solved: 85, rating: 1580 }
]);

const discussions = ref([
  { id: 1, title: '讨论本周比赛题目', author: 'alice', replies: 8, createdAt: '2024-03-10 15:30' },
  { id: 2, title: '分享一个DP问题的新解法', author: 'bob', replies: 3, createdAt: '2024-03-08 12:15' }
]);

const activeTab = ref('overview');
const isJoined = ref(false);
const isLoading = ref(false);

// 检查当前用户是否为团队成员
const userRole = computed(() => {
  if (!isLoggedIn.value || !userInfo.value) return null;
  const member = members.value.find(m => m.username === userInfo.value?.username);
  return member ? member.role : null;
});

// 检查是否有管理权限
const canManage = computed(() => {
  return userRole.value === '管理员';
});

onMounted(() => {
  // 这里可以添加获取团队信息的API调用
  checkMembership();
});

const checkMembership = () => {
  if (isLoggedIn.value && userInfo.value) {
    // 模拟检查用户是否在团队中
    isJoined.value = members.value.some(member => member.username === userInfo.value?.username);
  }
};

const joinTeam = async () => {
  try {
    if (!isLoggedIn.value) {
      router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath));
      return;
    }
    
    isLoading.value = true;
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 成功后更新状态
    isJoined.value = true;
    
    // 添加当前用户到成员列表
    if (userInfo.value) {
      members.value.push({
        id: members.value.length + 1,
        username: userInfo.value.username || '',
        nickname: userInfo.value.nickname || userInfo.value.username || '',
        role: '成员',
        joinDate: new Date().toISOString().split('T')[0],
        solved: userInfo.value.solved || 0,
        rating: userInfo.value.rating || 0
      });
    }
  } catch (error) {
    console.error('加入团队失败', error);
  } finally {
    isLoading.value = false;
  }
};

const leaveTeam = async () => {
  if (confirm('确定要离开该团队吗？')) {
    try {
      isLoading.value = true;
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功后更新状态
      isJoined.value = false;
      
      // 从成员列表中移除当前用户
      if (userInfo.value) {
        members.value = members.value.filter(member => member.username !== userInfo.value?.username);
      }
    } catch (error) {
      console.error('离开团队失败', error);
    } finally {
      isLoading.value = false;
    }
  }
};

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <!-- 团队标题和基本信息 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold">{{ team.name }}</h1>
        <p class="text-neutral-600 dark:text-neutral-400 mt-1">
          创建于 {{ team.createdAt }} · {{ team.memberCount }} 名成员 · 
          <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" @click="router.push(`/profile/${team.owner}`)">
            {{ team.owner }}
          </span> 创建
        </p>
      </div>
      <div class="flex gap-2">
        <fluent-button v-if="!isJoined" appearance="accent" @click="joinTeam" :disabled="isLoading">
          <Icon v-if="isLoading" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin" />
          <Icon v-else icon="fluent:people-team-add-20-filled" class="w-5 h-5 mr-2" />
          加入团队
        </fluent-button>
        <fluent-button v-if="isJoined && !canManage" appearance="outline" @click="leaveTeam" :disabled="isLoading">
          <Icon v-if="isLoading" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin" />
          <Icon v-else icon="fluent:people-team-delete-20-filled" class="w-5 h-5 mr-2" />
          离开团队
        </fluent-button>
        <fluent-button v-if="canManage" appearance="accent" @click="router.push(`/teams/${teamId}/manage`)">
          <Icon icon="fluent:settings-20-filled" class="w-5 h-5 mr-2" />
          管理团队
        </fluent-button>
      </div>
    </div>

    <!-- 标签页切换 -->
    <fluent-tablist>
      <fluent-tab 
        v-for="tab in [
          { id: 'overview', label: '概览', icon: 'fluent:home-20-filled' },
          { id: 'members', label: '成员', icon: 'fluent:people-20-filled' },
          { id: 'contests', label: '比赛', icon: 'fluent:calendar-20-filled' },
          { id: 'discussions', label: '讨论', icon: 'fluent:chat-20-filled' }
        ]"
        :key="tab.id"
        :id="tab.id"
        :selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        <div class="flex items-center gap-2">
          <Icon :icon="tab.icon" class="w-5 h-5" />
          {{ tab.label }}
        </div>
      </fluent-tab>
    </fluent-tablist>
      
    <!-- 概览标签页 -->
    <div v-show="activeTab === 'overview'" class="mt-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <fluent-card class="p-6 rounded-2xl">
            <h2 class="text-xl font-semibold mb-4">关于团队</h2>
            <p class="whitespace-pre-line">{{ team.description }}</p>
            
            <h3 class="text-lg font-medium mt-6 mb-3">即将举行的比赛</h3>
            <div v-if="team.contests.some(c => c.status === '即将开始')" class="flex flex-col gap-3">
              <fluent-card v-for="contest in team.contests.filter(c => c.status === '即将开始')" :key="contest.id"
                class="p-4 cursor-pointer hover:border-blue-500 transition-colors rounded-2xl"
                @click="router.push(`/contests/${contest.id}`)">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium">{{ contest.title }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {{ contest.status }}
                  </span>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">开始时间：{{ contest.startTime }}</p>
              </fluent-card>
            </div>
            <p v-else class="text-neutral-600 dark:text-neutral-400">暂无即将举行的比赛</p>
          </fluent-card>
        </div>
        
        <div>
          <fluent-card class="p-6 rounded-2xl">
            <h2 class="text-xl font-semibold mb-4">团队统计</h2>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between">
                <span class="text-neutral-600 dark:text-neutral-400">成员数</span>
                <span class="font-medium">{{ team.memberCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-600 dark:text-neutral-400">团队比赛</span>
                <span class="font-medium">{{ team.contests.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-600 dark:text-neutral-400">团队讨论</span>
                <span class="font-medium">{{ discussions.length }}</span>
              </div>
            </div>
            
            <h3 class="text-lg font-medium mt-6 mb-3">顶尖成员</h3>
            <div class="flex flex-col gap-2">
              <div v-for="(member, index) in members.slice(0, 3)" :key="member.id"
                class="flex items-center justify-between py-2 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold w-4">{{ index + 1 }}</span>
                  <div v-if="false" class="w-8 h-8">
                    <fluent-avatar image="avatar-url" :title="member.nickname" />
                  </div>
                  <div v-else class="w-8 h-8">
                    <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(member.nickname) }}
                    </fluent-badge>
                  </div>
                  <a class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" @click="router.push(`/profile/${member.username}`)">
                    {{ member.nickname }}
                  </a>
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                  Rating: {{ member.rating }}
                </div>
              </div>
            </div>
          </fluent-card>
        </div>
      </div>
    </div>
    
    <!-- 成员标签页 -->
    <div v-show="activeTab === 'members'" class="mt-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead class="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">用户名</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">昵称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">角色</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">加入日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">已解决</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            <tr v-for="member in members" :key="member.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <a class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" @click="router.push(`/profile/${member.username}`)">
                  {{ member.username }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.nickname }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-0.5 rounded-full text-xs': true,
                  'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': member.role === '管理员',
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': member.role === '成员'
                }">
                  {{ member.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.joinDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.solved }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.rating }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 比赛标签页 -->
    <div v-show="activeTab === 'contests'" class="mt-6">
      <div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fluent-card v-for="contest in team.contests" :key="contest.id"
            class="p-6 cursor-pointer hover:border-blue-500 transition-colors rounded-2xl"
            @click="router.push(`/contests/${contest.id}`)">
            <div class="flex justify-between items-start">
              <h3 class="font-medium">{{ contest.title }}</h3>
              <span :class="{
                'px-2 py-0.5 rounded-full text-xs': true,
                'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': contest.status === '即将开始',
                'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': contest.status === '进行中',
                'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200': contest.status === '已结束'
              }">
                {{ contest.status }}
              </span>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">开始时间：{{ contest.startTime }}</p>
          </fluent-card>
          
          <!-- 创建比赛卡片 (仅管理员可见) -->
          <fluent-card v-if="canManage" 
            class="p-6 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors rounded-2xl"
            @click="router.push(`/workspace/contests/create?team=${teamId}`)">
            <div class="flex flex-col items-center">
              <Icon icon="fluent:calendar-add-20-filled" class="w-10 h-10 text-neutral-400 dark:text-neutral-600 mb-2" />
              <p class="text-neutral-600 dark:text-neutral-400">创建团队比赛</p>
            </div>
          </fluent-card>
        </div>
      </div>
    </div>
    
    <!-- 讨论标签页 -->
    <div v-show="activeTab === 'discussions'" class="mt-6">
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">团队讨论</h3>
          <fluent-button appearance="accent" @click="router.push(`/community/create-post?team=${teamId}`)">
            <Icon icon="fluent:add-20-filled" class="w-5 h-5 mr-2" />
            发起讨论
          </fluent-button>
        </div>
        
        <div v-if="discussions.length > 0">
          <fluent-card v-for="discussion in discussions" :key="discussion.id"
            class="mb-4 p-5 hover:border-blue-500 transition-colors cursor-pointer rounded-2xl"
            @click="router.push(`/community/post/${discussion.id}`)">
            <div class="flex justify-between">
              <h4 class="text-lg font-medium">{{ discussion.title }}</h4>
              <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ discussion.createdAt }}</span>
            </div>
            <div class="flex gap-6 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <div class="flex items-center gap-1">
                <Icon icon="fluent:person-20-regular" class="w-4 h-4" />
                <span>{{ discussion.author }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="fluent:comment-20-regular" class="w-4 h-4" />
                <span>{{ discussion.replies }} 回复</span>
              </div>
            </div>
          </fluent-card>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center py-10">
          <Icon icon="fluent:chat-empty-20-regular" class="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" />
          <p class="text-neutral-600 dark:text-neutral-400">暂无讨论</p>
          <fluent-button appearance="accent" class="mt-4" @click="router.push(`/community/create-post?team=${teamId}`)">
            发起第一个讨论
          </fluent-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(fluent-tablist) {
  --background-color: var(--neutral-layer-1);
  border-bottom: 1px solid var(--neutral-stroke-divider-rest);
}

:deep(fluent-tab) {
  --background-color: var(--neutral-layer-1);
  --hover-background-color: var(--neutral-layer-2);
  padding: 8px 16px;
}

:deep(fluent-tab[selected]) {
  --background-color: var(--neutral-layer-2);
  border-bottom: 2px solid var(--accent-fill-rest);
}

/* 添加表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.5rem;
}

thead tr:first-child th:first-child {
  border-top-left-radius: 0.5rem;
}

thead tr:first-child th:last-child {
  border-top-right-radius: 0.5rem;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 0.5rem;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 0.5rem;
}
</style>
