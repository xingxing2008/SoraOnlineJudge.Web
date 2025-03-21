import { ref } from 'vue'

export interface User {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  // 不添加 role 字段，而是使用 permissions 数组判断角色
  permissions: string[];
  solved: number;
  rating: number;
  ranking: number;
  recentSubmissions?: Array<{
    id: string;
    questionId: string;
    status: string;
    time: string;
    memory: string;
    language: string;
    submitTime: string;
  }>;
}

// 创建全局状态
export const isLoggedIn = ref(false)
export const userInfo = ref<User | null>(null)

// 通过 permissions 判断用户权限
export function hasPermission(permission: string): boolean {
  return isLoggedIn.value && userInfo.value?.permissions?.includes(permission) || false;
}

// 判断是否为管理员
export function isAdmin(): boolean {
  return hasPermission('admin') || hasPermission('superadmin');
}

// 判断是否为团队管理员
export function isTeamAdmin(): boolean {
  return hasPermission('group.admin') || isAdmin();
} 

// 登录
export function setLoginState(user: User) {
  // 确保 permissions 数组存在
  if (!user.permissions) {
    user.permissions = [];
  }
  
  userInfo.value = user;
  isLoggedIn.value = true;
  localStorage.setItem('userInfo', JSON.stringify(user));
}

// 设置用户详细信息，包括最近提交
export function setUserDetail(detail: any) {
  if (!userInfo.value) return;
  
  // 保留原有基本信息
  const updatedUser = {
    ...userInfo.value,
    // 更新用户统计信息
    solved: detail.stats?.solved || userInfo.value.solved,
    rating: detail.rating || userInfo.value.rating,
    ranking: detail.ranking || userInfo.value.ranking,
  };
  
  // 添加最近提交记录
  if (detail.recentSubmissions && detail.recentSubmissions.length > 0) {
    updatedUser.recentSubmissions = detail.recentSubmissions.map((sub: any) => ({
      id: sub.id,
      questionId: sub.questionId,
      status: sub.status,
      time: sub.time,
      memory: sub.memory,
      language: sub.language,
      submitTime: sub.submitTime
    }));
  }
  
  // 更新状态
  userInfo.value = updatedUser;
  localStorage.setItem('userInfo', JSON.stringify(updatedUser));
}

// 登出
export function clearLoginState() {
  isLoggedIn.value = false
  userInfo.value = null
  localStorage.removeItem('userInfo');
}

// 检查登录状态
export function checkLoginState(): boolean {
  try {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      
      // 确保 permissions 数组存在
      if (!user.permissions) {
        user.permissions = [];
      }
      
      userInfo.value = user;
      isLoggedIn.value = true;
      return true;
    }
  } catch (error) {
    console.error('检查登录状态失败', error);
    clearLoginState();
  }
  return false;
}

// 初始化时检查登录状态
checkLoginState()
