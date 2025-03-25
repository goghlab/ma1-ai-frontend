// 这个文件由next-pwa自动管理
// 你可以在这里添加额外的自定义代码

self.addEventListener('install', function(event) {
  console.log('MA-1 Service Worker 安装完成');
  // 强制激活，不等待旧的Service Worker终止
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('MA-1 Service Worker 激活');
  // 立即接管所有页面
  event.waitUntil(clients.claim());
});

// 默认处理方式由next-pwa提供
// 你可以在这里添加自定义缓存策略 