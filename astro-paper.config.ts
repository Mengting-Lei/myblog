import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://leimengting.com/",
    title: "梦婷 | 品牌邮件营销增长顾问",
    description: "品牌邮件营销增长顾问 | 邮件营销咨询、自由职业辅导、品牌邮件营销增长全案",
    author: "雷梦婷",
    profile: "https://leimengting.com/",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/6305693a0000000012003aae", linkTitle: "梦婷的小红书" },
    { name: "zhihu",       url: "https://www.zhihu.com/people/0cb656775a71a49f4515318ff41663ae", linkTitle: "梦婷的知乎" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
