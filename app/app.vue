<script setup>
useHead({
  title: 'Instagram',
  meta: [
    { name: 'theme-color', content: '#000000' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/gh/xTracky/static@latest/utm-handler.js',
      async: true,
      'data-token': '24ae3bea-1356-4d65-8380-b64d3ee28f44'
    },
    {
      innerHTML: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1356708019716752');
fbq('track', 'PageView');`
    },
    {
      innerHTML: `window.pixelId = "6a3c8ccf52330e6daca02a99";
  var a = document.createElement("script");
  a.setAttribute("async", "");
  a.setAttribute("defer", "");
  a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  document.head.appendChild(a);`
    },
    {
      src: 'https://cdn.utmify.com.br/scripts/utms/latest.js',
      async: true,
      defer: true,
      'data-utmify-prevent-xcod-sck': '',
      'data-utmify-prevent-subids': ''
    }
  ],
  noscript: [
    {
      innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1356708019716752&ev=PageView&noscript=1" />`
    }
  ]
})
</script>

<template>
  <NuxtPage />
</template>
