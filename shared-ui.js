// Shared UI injection for Paired (hamburger sidebar + dynamic top nav / chat header)
// Load this early in <head> so we can pre-reserve header space and avoid content shifting under it.
(function(){
  const path = window.location.pathname.toLowerCase();
  const isHome = /homepage\.html$/.test(path);
  const isMessages = /messages\.html$/.test(path); // only messages list
  const isChatList = /chat\.html$/.test(path); // simplified chat list page
  const isDM = /dm\.html$/.test(path);

  // Decide header height before DOM ready and reserve space
  const headerHeight = isHome ? 190 : isMessages ? 190 : isChatList ? 72 : isDM ? 72 : 112;
  if(!document.getElementById('pre-header-style')){
    const s=document.createElement('style');
    s.id='pre-header-style';
    s.textContent=`body{padding-top:${headerHeight}px !important}`; // reserve space immediately
    document.head.appendChild(s);
  }
  // Add query param parsing for DM user slug
  const params = new URLSearchParams(window.location.search);
  const dmUserSlug = params.get('u') || '';
  function formatDisplayName(slug){
    if(!slug) return 'Ama Kusi';
    const base = decodeURIComponent(slug).replace(/[_+-]+/g,' ').trim();
    return base.split(/\s+/).map(s=> s.charAt(0).toUpperCase()+s.slice(1)).join(' ');
  }
  function buildTopNav(){
    if(isChatList){
      return `<div id="fixed-ui" class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50"><div class="backdrop-blur-md bg-black/60 border-b border-white/15 shadow-lg"><div class="px-2 py-2 flex items-center gap-3"><button onclick="history.back()" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Back"><i data-lucide="chevron-left" class="w-5 h-5"></i></button><h1 class="text-base font-semibold">Chats</h1></div></div></div>`;
    }
    if(isDM){
      const displayName = formatDisplayName(dmUserSlug);
      let seed = 1012; if(dmUserSlug){ let hash=0; for(let i=0;i<dmUserSlug.length;i++){ hash = (hash*31 + dmUserSlug.charCodeAt(i))>>>0; } seed = 1000 + (hash % 50); }
      const avatarUrl = `https://picsum.photos/id/${seed}/80/80`;
      return `<div id="fixed-ui" class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50"><div class="backdrop-blur-md bg-black/50 border-b border-white/15 shadow-lg"><div class="px-2 py-2 flex items-center gap-2"><button onclick=\"history.back()\" aria-label=\"Back\" class=\"w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10\"><i data-lucide=\"chevron-left\" class=\"w-5 h-5\"></i></button><div class=\"w-9 h-9 rounded-full overflow-hidden border border-white/20\"><img src=\"${avatarUrl}\" class=\"w-full h-full object-cover\" alt=\"avatar\"/></div><div class=\"flex-1 leading-tight min-w-0\"><p class=\"text-sm font-semibold truncate\">${displayName}</p><p class=\"text-[10px] text-green-400\">online</p></div><div class=\"flex items-center gap-1\"><button class=\"w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10\" aria-label=\"Call\"><i data-lucide=\"phone\" class=\"w-5 h-5\"></i></button><button class=\"w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10\" aria-label=\"More\"><i data-lucide=\"more-vertical\" class=\"w-5 h-5\"></i></button></div></div></div></div>`;
    }
    const active = (name)=> window.PAGE_ACTIVE===name ? 'text-orange-400':'hover:text-orange-400';
    let extra='';
    if(isHome){
      extra = `<div class=\"px-4 pb-3 pt-1\"><div class=\"px-3 pt-2 flex items-center space-x-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur\"><div class=\"w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500\"><img src=\"https://picsum.photos/id/1019/40/40\" class=\"w-full h-full object-cover\" alt=\"me\"></div><input id=\"openComposerModal\" readonly placeholder=\"What's on your mind?\" class=\"flex-1 bg-black/30 text-white placeholder-gray-300 rounded-full px-3 py-2 text-sm cursor-pointer focus:outline-none\"><button id=\"composerMediaBtn\" class=\"p-2 rounded-full bg-black/30 border border-gray-600 hover:bg-orange-500 hover:text-white transition\" aria-label=\"Add media\"><i data-lucide=\"image\" class=\"w-5 h-5\"></i></button><input id=\"composerFile\" type=\"file\" accept=\"image/*,video/*\" class=\"hidden\" /></div></div>`;
    } else if(isMessages){
      extra = `<div class=\"px-4 pt-2\"><div class=\"flex items-center gap-2\"><a href=\"Homepage.html\" aria-label=\"Back\" class=\"w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10\"><i data-lucide=\"chevron-left\" class=\"w-5 h-5\"></i></a><h1 class=\"text-lg font-semibold\">Messages</h1></div></div><div class=\"px-3 pb-3 pt-2\" id=\"global-statuses\"><div class=\"overflow-x-auto no-scrollbar -mx-1 px-1\" style=\"-webkit-overflow-scrolling:touch;\"><div class=\"flex space-x-3 w-max\"><div class=\"flex-shrink-0 w-16 h-24 flex flex-col items-center\" title=\"Add Status\"><button class=\"w-14 h-14 rounded-full border-2 border-dashed border-orange-400 text-orange-400 flex items-center justify-center\"><i data-lucide=\"plus\" class=\"w-6 h-6\"></i></button><span class=\"mt-1 text-[10px] text-gray-300\">New</span></div><div class=\"flex-shrink-0 w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600\"><div class=\"w-full h-full rounded-full overflow-hidden bg-black\"><img src=\"https://picsum.photos/id/1011/56/56\" class=\"w-full h-full object-cover\"/></div></div><div class=\"flex-shrink-0 w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600\"><div class=\"w-full h-full rounded-full overflow-hidden bg-black\"><img src=\"https://picsum.photos/id/1012/56/56\" class=\"w-full h-full object-cover\"/></div></div><div class=\"flex-shrink-0 w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600\"><div class=\"w-full h-full rounded-full overflow-hidden bg-black\"><img src=\"https://picsum.photos/id/1013/56/56\" class=\"w-full h-full object-cover\"/></div></div></div></div></div>`;
    }
    return `<div id=\"fixed-ui\" class=\"fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50\"><div class=\"backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg overflow-hidden\"><div class=\"px-4 py-3\"><nav class=\"flex items-center justify-between\"><div class=\"flex items-center space-x-2\"><button id=\"openSidebarBtn\" class=\"text-gray-300 hover:text-white\" aria-label=\"Menu\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 6h16M4 12h16m-7 6h7\"/></svg></button><span class=\"text-2xl font-bold text-orange-500\">Paired</span></div><div class=\"flex items-center space-x-2\"><button id=\"openSearch\" class=\"flex items-center justify-center w-9 h-9 rounded-full bg-gray-400/10 backdrop-blur-md border border-gray-600 hover:bg-white/10\" aria-label=\"Search\"><i data-lucide=\"search\" class=\"w-5 h-5 text-white\"></i></button><a href=\"chat.html\" class=\"flex items-center justify-center w-9 h-9 rounded-full bg-gray-400/10 backdrop-blur-md border border-gray-600 hover:bg-white/10\" aria-label=\"Messages\"><i data-lucide=\"send\" class=\"w-5 h-5 text-white -rotate-45\"></i></a></div></nav>${!isMessages ? `<nav id=\"mainNavIcons\" class=\"flex justify-around mt-3 text-white font-medium space-x-9 text-sm\"><a href=\"Homepage.html\" class=\"${active('home')}\" title=\"Home\"><i data-lucide=\"home\"></i></a><a href=\"friends.html\" class=\"${active('friends')}\" title=\"Friends\"><i data-lucide=\"users\"></i></a><a href=\"market.html\" class=\"${active('market')}\" title=\"Marketplace\"><i data-lucide=\"shopping-bag\"></i></a><a href=\"Notification.html\" class=\"${active('notifications')}\" title=\"Notifications\"><i data-lucide=\"bell\"></i></a><a href=\"profile.html\" class=\"${active('profile')}\" title=\"Profile\"><i data-lucide=\"user\"></i></a></nav>`:''}</div>${extra}</div></div>`;
  }
  function buildSidebar(){
    return `\n  <div id="sidebar-container" class="fixed inset-0 z-[1001] pointer-events-none">\n    <div id="sidebar-overlay" class="absolute inset-0 bg-black/60 opacity-0 hidden transition-opacity"></div>\n    <div id="sidebar" style="transform:translateX(-100%);" class="relative z-10 w-64 h-full bg-black/60 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">\n        <div class="flex items-center gap-3 mb-8">\n            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">\n                <img src="https://picsum.photos/id/1019/80/80" alt="user" class="w-full h-full object-cover">\n            </div>\n            <div>\n                <p class="font-semibold flex items-center">You <span data-premium-badge></span></p>\n                <p class="text-xs text-gray-400">@your_username</p>\n            </div>\n        </div>\n        <nav class="flex flex-col space-y-1 text-gray-300 text-sm">\n            <a href="profile.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition"><i data-lucide="user" class="w-5 h-5"></i><span>Profile</span></a>\n            <a href="upgradeTopremium.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition"><i data-lucide="crown" class="w-5 h-5 text-yellow-400"></i><span>${window.PairedState?.isPremium()? 'Manage Premium':'Go Premium'}</span></a>\n            <a href="market.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition"><i data-lucide="shopping-bag" class="w-5 h-5"></i><span>Marketplace</span></a>\n            <a href="Bookmarks.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition"><i data-lucide="bookmark" class="w-5 h-5"></i><span>Bookmarks</span></a>\n            <a href="postAd.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition"><i data-lucide="megaphone" class="w-5 h-5"></i><span>Post Ad or Event</span></a>\n            <a href="Settings.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition"><i data-lucide="settings" class="w-5 h-5"></i><span>Settings</span></a>\n            <div class="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition">\n              <div class="flex items-center gap-3">\n                <i data-lucide="moon" class="w-5 h-5"></i><span>Theme</span>\n              </div>\n              <label class="inline-flex items-center cursor-pointer select-none">\n                <input type="checkbox" data-theme-toggle class="sr-only peer" />\n                <span class="w-10 h-5 bg-white/15 peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-pink-600 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-5"></span>\n              </label>\n            </div>\n        </nav>\n        <div class="mt-auto pt-6 border-t border-white/10">\n            <a href="index.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"><i data-lucide="log-out" class="w-5 h-5"></i><span>Logout</span></a>\n        </div>\n    </div>\n  </div>`;
  }
  function inject(){
    if(document.getElementById('fixed-ui')) return;
    document.body.insertAdjacentHTML('afterbegin', buildTopNav()+buildSidebar());
    // Inject global tabbed search modal once
    if(!document.getElementById('globalSearchModal')){
      document.body.insertAdjacentHTML('beforeend', `\n      <div id="globalSearchModal" class="fixed inset-0 z-[1300] hidden">\n        <div class=\"absolute inset-0 bg-black/70 backdrop-blur-sm\"></div>\n        <div class=\"absolute inset-x-0 top-0 mx-auto w-full max-w-sm p-4 animate-fade-in\">\n          <div class=\"bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl relative flex flex-col max-h-[90vh]\">\n            <div class=\"flex items-center gap-2\">\n              <i data-lucide=\"search\" class=\"w-5 h-5 text-gray-300\"></i>\n              <input id=\"globalSearchInput\" type=\"text\" placeholder=\"Search...\" class=\"flex-1 bg-transparent outline-none text-sm placeholder-gray-400\" />\n              <button id=\"closeGlobalSearch\" class=\"w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10\" aria-label=\"Close search\"><i data-lucide=\"x\" class=\"w-5 h-5\"></i></button>\n            </div>\n            <div class=\"mt-3 flex items-center text-[11px] font-medium bg-white/5 rounded-full p-1 gap-1\" id=\"searchTabs\">\n              <button data-tab=\"people\" class=\"flex-1 py-1.5 rounded-full bg-orange-600 text-white transition-colors\">People</button>\n              <button data-tab=\"events\" class=\"flex-1 py-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors\">Events</button>\n              <button data-tab=\"ads\" class=\"flex-1 py-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors\">Ads</button>\n            </div>\n            <div id=\"globalSearchResults\" class=\"mt-3 overflow-y-auto text-sm space-y-2 flex-1\"></div>\n            <div id=\"globalSearchEmpty\" class=\"mt-6 text-center text-xs text-gray-400\">Type to start searching</div>\n          </div>\n        </div>\n      </div>`);
      if(window.lucide) lucide.createIcons();
      setupGlobalSearch();
    }
    // Toast container
    if(!document.getElementById('toastHost')){
      const host=document.createElement('div'); host.id='toastHost'; host.className='fixed z-[1400] inset-x-0 top-3 flex flex-col items-center gap-2 pointer-events-none'; document.body.appendChild(host);
    }
    // Ensure sidebar transition styles exist globally (were only on Homepage before)
    if(!document.getElementById('sidebar-global-style')){
      const st = document.createElement('style');
      st.id='sidebar-global-style';
      st.textContent = `#sidebar{transition:transform .3s ease;} .sidebar-open{transform:translateX(0)!important;}`;
      document.head.appendChild(st);
    }
    attachSidebarLogic();
    if(window.lucide) lucide.createIcons();
    // Recalculate actual header height (avoid layout shift / overlap on Homepage)
    requestAnimationFrame(()=>{
      const ui=document.getElementById('fixed-ui');
      if(!ui) return;
      const real=ui.getBoundingClientRect().height;
      const current=parseInt(getComputedStyle(document.body).paddingTop)||0;
      if(real && Math.abs(real-current)>2){
        document.body.style.paddingTop = real + 'px';
      }
      // If the pre-reserved space was far larger than real header, drop preload style to prevent large empty gap
      if(current - real > 40){
        const pre=document.getElementById('pre-header-style');
        if(pre) pre.remove();
      }
    });
    // Ensure theme toggle checkbox reflects current theme (in case theme.js DOMContentLoaded already passed)
    try{
      document.querySelectorAll('input[data-theme-toggle][type="checkbox"]').forEach(cb=>{
        cb.checked = window.PairedTheme?.isDark?.() || false;
        // ensure listener exists (theme.js only wires on DOMContentLoaded which may have passed)
        if(!cb._pairedThemeBound){
          cb.addEventListener('change', ()=> window.PairedTheme?.setDark?.(cb.checked));
          cb._pairedThemeBound = true;
        }
      });
    }catch(e){}
  }

  function attachSidebarLogic(){
    const openSidebarBtn=document.getElementById('openSidebarBtn');
    const sidebar=document.getElementById('sidebar');
    const overlay=document.getElementById('sidebar-overlay');
    const container=document.getElementById('sidebar-container');
    function openSidebar(){
      container.classList.remove('pointer-events-none');
      overlay.classList.remove('hidden');
      requestAnimationFrame(()=>{
        sidebar.style.transform='translateX(0)';
        overlay.style.opacity='1';
      });
    }
    function closeSidebar(){
      sidebar.style.transform='translateX(-100%)';
      overlay.style.opacity='0';
      setTimeout(()=>{ overlay.classList.add('hidden'); container.classList.add('pointer-events-none'); },300);
    }
    openSidebarBtn?.addEventListener('click', openSidebar); overlay?.addEventListener('click', closeSidebar);
  }

  function safeInject(){
    if(document.getElementById('fixed-ui')) return;
    if(!document.body){
      document.addEventListener('DOMContentLoaded', inject, { once:true });
      return;
    }
    inject();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeInject);
  else safeInject();

  // --- Global Tabbed Search Logic ---
  function setupGlobalSearch(){
    const modal=document.getElementById('globalSearchModal');
    const input=document.getElementById('globalSearchInput');
    const closeBtn=document.getElementById('closeGlobalSearch');
    const results=document.getElementById('globalSearchResults');
    const empty=document.getElementById('globalSearchEmpty');
    const tabs=document.getElementById('searchTabs');
    let activeTab='people';
    const data={
      people:['Ama Kusi','Kwame Boateng','Esi Nyarko','Yaw Ofori','Aisha M.','Kojo Mensah'],
      events:['SRC Week Launch','Hack Night','Movie Night','Tech Summit','Career Fair'],
      ads:['MacBook Air M1','Gaming Laptop','Toyota Corolla','Noise Cancelling Headphones','Book Set']
    };
    function open(){ modal.classList.remove('hidden'); document.body.classList.add('no-scroll'); setTimeout(()=>input.focus(),50); }
    function close(){ modal.classList.add('hidden'); document.body.classList.remove('no-scroll'); input.value=''; results.innerHTML=''; empty.classList.remove('hidden'); }
    document.getElementById('openSearch')?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', e=>{ if(e.target===modal) close(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !modal.classList.contains('hidden')) close(); });
    tabs?.addEventListener('click', e=>{
      const btn=e.target.closest('button[data-tab]');
      if(!btn) return;
      activeTab=btn.dataset.tab;
      tabs.querySelectorAll('button').forEach(b=>{
        b.classList.remove('bg-orange-600','text-white');
        b.classList.add('text-gray-300');
      });
      btn.classList.add('bg-orange-600','text-white');
      btn.classList.remove('text-gray-300');
      performSearch();
    });
    function performSearch(){
      const q=input.value.trim().toLowerCase();
      results.innerHTML='';
      if(!q){ empty.classList.remove('hidden'); return; }
      empty.classList.add('hidden');
      const source=data[activeTab]||[];
      const filtered=source.filter(s=> s.toLowerCase().includes(q));
      if(!filtered.length){ results.innerHTML='<div class="text-xs text-gray-400 text-center py-4">No matches</div>'; return; }
      filtered.forEach(item=>{
        const div=document.createElement('div');
        div.className='px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer flex items-center gap-2';
        let icon='user'; if(activeTab==='events') icon='calendar'; else if(activeTab==='ads') icon='shopping-bag';
        div.innerHTML=`<i data-lucide="${icon}" class="w-4 h-4 text-gray-300"></i><span>${item}</span>`;
        div.addEventListener('click', ()=>{
          // simple contextual navigation stub
          if(activeTab==='people') window.location.href='PeopleProfile.html?u='+encodeURIComponent(item.toLowerCase().replace(/\s+/g,'_'));
          else if(activeTab==='events') showToast('Open event: '+item);
          else showToast('Open ad: '+item);
          close();
        });
        results.appendChild(div);
      });
      if(window.lucide) lucide.createIcons();
    }
    // debounce input
    let searchTimer; input.addEventListener('input', ()=>{ clearTimeout(searchTimer); searchTimer=setTimeout(performSearch,250); });
  }

  // --- Toast helper ---
  window.showToast = function(msg, opts={}){
    const host=document.getElementById('toastHost'); if(!host) return alert(msg);
    const div=document.createElement('div');
    div.className='pointer-events-auto text-xs px-3 py-2 rounded-lg bg-black/80 backdrop-blur border border-white/15 shadow-sm animate-fade-in';
    div.textContent=msg; host.appendChild(div);
    setTimeout(()=>{ div.style.opacity='0'; div.style.transform='translateY(-4px)'; div.style.transition='all .3s'; setTimeout(()=>div.remove(),320); }, opts.duration||2400);
  };

  // --- Simple data layer ---
  const DATA_KEY='paired.data.v1';
  function readData(){ try{return JSON.parse(localStorage.getItem(DATA_KEY)||'{}');}catch(e){return {};} }
  function writeData(d){ localStorage.setItem(DATA_KEY, JSON.stringify(d)); }
  window.PairedData={
    addComposerPost(post){ const d=readData(); d.posts=d.posts||[]; d.posts.unshift(post); writeData(d); },
    getPosts(){ return (readData().posts)||[]; },
    saveDraft(draft){ const d=readData(); d.draft=draft; writeData(d); },
    getDraft(){ return readData().draft||null; },
    clearDraft(){ const d=readData(); delete d.draft; writeData(d); },
    toggleBookmark(item){ const d=readData(); d.bookmarks=d.bookmarks||[]; const idx=d.bookmarks.findIndex(b=>b.type===item.type && b.id===item.id); if(idx>=0) d.bookmarks.splice(idx,1); else d.bookmarks.push(item); writeData(d); return idx<0; },
    isBookmarked(type,id){ const d=readData(); return (d.bookmarks||[]).some(b=>b.type===type && b.id===id); },
    counts(){ const d=readData(); return { posts:(d.posts||[]).length, bookmarks:(d.bookmarks||[]).length }; }
  };
  // Show bookmark count as small badge on profile icon if any
  function updateNavBadges(){
    try{
      const c=window.PairedData?.counts?.(); if(!c) return; const nav=document.getElementById('mainNavIcons'); if(!nav) return;
      // Reuse / attach badge to profile link last anchor
      const profileLink=nav.querySelector('a[href*="profile"]'); if(profileLink){
        let badge=profileLink.querySelector('.nav-badge');
        if(c.bookmarks>0){
          if(!badge){ badge=document.createElement('span'); badge.className='nav-badge absolute -top-1 -right-2 bg-orange-600 text-[9px] leading-none px-1.5 py-0.5 rounded-full font-semibold shadow'; profileLink.classList.add('relative'); profileLink.appendChild(badge); }
          badge.textContent = c.bookmarks>9? '9+': String(c.bookmarks);
        } else if(badge){ badge.remove(); }
      }
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', updateNavBadges);
  window.addEventListener('storage', updateNavBadges);
  window.PairedUpdateBadges = updateNavBadges;

  // After existing badge logic, add hashtag/mention navigation & service worker
  document.addEventListener('click', e=>{
    const tag=e.target.closest('.hashtag');
    if(tag){
      const raw=tag.dataset.tag||tag.textContent||''; const clean=raw.replace(/^#/, '');
      // Treat coarse pointer or narrow viewport as mobile
      const isMobile = window.innerWidth <= 700 || window.matchMedia('(max-width:700px)').matches || window.matchMedia('(pointer:coarse)').matches;
      if(isMobile){
        e.preventDefault(); e.stopPropagation();
        setTimeout(()=>{ window.location.href='search.html?tag='+encodeURIComponent(clean); },20);
        return;
      }
      // Fire custom event so pages (Homepage) can filter locally without navigation
      window.dispatchEvent(new CustomEvent('PairedFilterHashtag',{ detail:{ tag: clean } }));
      return;
    }
    const men=e.target.closest('.mention');
    if(men){ const raw=men.dataset.mention||men.textContent||''; const user=raw.replace(/^@/,'').toLowerCase(); window.location.href='PeopleProfile.html?u='+encodeURIComponent(user); return; }
  });
  if('serviceWorker' in navigator){ window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(err=>console.warn('[SW] registration failed', err)); }); }
  // --- Content parsing (hashtags, mentions, links) available globally ---
  if(!window.parseTextContent){
    window.parseTextContent = function(raw){
      try{
        let text = (raw||'').toString();
        // escape basic HTML
        text = text.replace(/[&<>]/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
        // simple URL auto-link (http/https)
        text = text.replace(/(https?:\/\/[^\s]+)(?=\s|$)/g, m=>`<a href="${m}" target="_blank" rel="noopener" class="underline text-orange-400 break-all">${m}</a>`);
        // hashtags (#word)
        text = text.replace(/(^|\s)#(\w{2,30})/g, (m, pre, tag)=> `${pre}<span class="hashtag text-orange-300 cursor-pointer font-medium" data-tag="${tag}">#${tag}</span>`);
        // mentions (@word)
        text = text.replace(/(^|\s)@(\w{2,30})/g, (m, pre, user)=> `${pre}<span class="mention text-purple-300 cursor-pointer" data-mention="${user}">@${user}</span>`);
        // newlines
        text = text.replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br>');
        return `<p>${text}</p>`;
      }catch(e){ return raw || ''; }
    };
  }
  // --- Fallback delegated post action handler (like/comment/share) if page omitted one ---
  if(!window._pairedPostActionsBound){
    document.addEventListener('click', function(e){
      const likeBtn = e.target.closest('.post-like');
      if(likeBtn && !likeBtn._pairedBound){
        const post = likeBtn.closest('.post');
        const countEl = post?.querySelector('.like-count');
        let count = parseInt(countEl?.textContent||'0',10);
        const active = likeBtn.classList.toggle('text-orange-400');
        likeBtn.classList.toggle('font-semibold', active);
        const icon = likeBtn.querySelector('i,svg');
        icon?.classList.toggle('fill-orange-500', active);
        if(countEl){ count += active ? 1 : -1; if(count<0) count=0; countEl.textContent = count; }
      }
      const commentBtn = e.target.closest('.post-comment');
      if(commentBtn){ window.location.href='comments.html'; }
      const shareBtn = e.target.closest('.post-share');
      if(shareBtn && typeof openShareModal==='function'){ openShareModal(); }
    });
    window._pairedPostActionsBound=true;
  }
})();
