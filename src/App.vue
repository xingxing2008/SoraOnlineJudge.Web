<script setup lang="ts">
import { RouterView } from "vue-router";
import PageHeader from "./components/PageHeader.vue";
import PageFooter from "./components/PageFooter.vue";
import MessageContainer from "./components/MessageContainer.vue";

import "@fluentui/web-components/button.js";
import { initThemeService } from "./services/ThemeService";
import {
  DrawerDefinition,
  DrawerBodyDefinition,
  TabDefinition,
  TablistDefinition,
  MenuDefinition,
  MenuButtonDefinition,
  MenuItemDefinition,
  TooltipDefinition,
  ButtonDefinition,
  DividerDefinition,
  FluentDesignSystem,
  MenuListDefinition,
  TextInputDefinition,
  DialogDefinition,
  FieldDefinition,
  ProgressBarDefinition,
  AvatarDefinition,
  BadgeDefinition,
  TextAreaDefinition,
  DialogBodyDefinition,
  CheckboxDefinition,
  MessageBarDefinition,
  DropdownDefinition,
  DropdownOptionDefinition,
  ListboxDefinition,
  
} from "@fluentui/web-components";
import AnnounceBar from "./components/AnnounceBar.vue";

DropdownDefinition.define(FluentDesignSystem.registry);
DropdownOptionDefinition.define(FluentDesignSystem.registry);
ListboxDefinition.define(FluentDesignSystem.registry);
MessageBarDefinition.define(FluentDesignSystem.registry)
CheckboxDefinition.define(FluentDesignSystem.registry);
DialogBodyDefinition.define(FluentDesignSystem.registry);
ProgressBarDefinition.define(FluentDesignSystem.registry);
FieldDefinition.define(FluentDesignSystem.registry);
ButtonDefinition.define(FluentDesignSystem.registry);
MenuDefinition.define(FluentDesignSystem.registry);
MenuListDefinition.define(FluentDesignSystem.registry);
MenuButtonDefinition.define(FluentDesignSystem.registry);
MenuItemDefinition.define(FluentDesignSystem.registry);
TooltipDefinition.define(FluentDesignSystem.registry);
ButtonDefinition.define(FluentDesignSystem.registry);
DividerDefinition.define(FluentDesignSystem.registry);
DrawerDefinition.define(FluentDesignSystem.registry);
DrawerBodyDefinition.define(FluentDesignSystem.registry);
TabDefinition.define(FluentDesignSystem.registry);
TablistDefinition.define(FluentDesignSystem.registry);
TextInputDefinition.define(FluentDesignSystem.registry);
DialogDefinition.define(FluentDesignSystem.registry);
AvatarDefinition.define(FluentDesignSystem.registry);
BadgeDefinition.define(FluentDesignSystem.registry);
TextAreaDefinition.define(FluentDesignSystem.registry);

initThemeService(document.documentElement);
</script>

<template>
  <main class="flex flex-col h-screen">
    <div class="flex flex-col grow">
      <div class="bg-neutral-50 dark:bg-neutral-900 h-16"></div>
      <RouterView class="min-w-full min-h-[95vh] bg-neutral-50 dark:bg-neutral-900" />
      <PageFooter />
    </div>
    <div class="fixed" style="width: 100%">
      <PageHeader />
    </div>
    <!-- 添加全局消息容器 -->
    <MessageContainer />
  </main>
</template>
