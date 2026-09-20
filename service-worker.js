const CACHE='fcc-greenlight-v5';
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest']).catch(()=>{})))});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let payload={title:'Family Command Center',body:'You have a new family update.',data:{url:'./'}};
  try{payload=Object.assign(payload,event.data?.json()||{})}catch{}
  const options={body:payload.body,icon:'./icon-192.png',badge:'./icon-192.png',data:payload.data||{},tag:payload.data?.notification_id||undefined,renotify:false};
  event.waitUntil(self.registration.showNotification(payload.title||'Family Command Center',options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification.data?.url||'./';
  event.waitUntil((async()=>{
    const all=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of all){if('focus' in client){client.navigate(url);return client.focus()}}
    if(clients.openWindow)return clients.openWindow(url);
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
});
