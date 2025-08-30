// Data layer + badge update (split from shared-ui.js)
(function(){
  const DATA_KEY='paired.data.v1';
  function readData(){ try{return JSON.parse(localStorage.getItem(DATA_KEY)||'{}');}catch(e){return {};} }
  function writeData(d){ localStorage.setItem(DATA_KEY, JSON.stringify(d)); }
  window.PairedData = window.PairedData || {};
  Object.assign(window.PairedData,{
    addComposerPost(post){ const d=readData(); d.posts=d.posts||[]; d.posts.unshift(post); writeData(d); },
    getPosts(){ return (readData().posts)||[]; },
    saveDraft(draft){ const d=readData(); d.draft=draft; writeData(d); },
    getDraft(){ return readData().draft||null; },
    clearDraft(){ const d=readData(); delete d.draft; writeData(d); },
    toggleBookmark(item){ const d=readData(); d.bookmarks=d.bookmarks||[]; const idx=d.bookmarks.findIndex(b=>b.type===item.type && b.id===item.id); if(idx>=0) d.bookmarks.splice(idx,1); else d.bookmarks.push(item); writeData(d); return idx<0; },
    isBookmarked(type,id){ const d=readData(); return (d.bookmarks||[]).some(b=>b.type===type && b.id===id); },
    counts(){ const d=readData(); return { posts:(d.posts||[]).length, bookmarks:(d.bookmarks||[]).length }; }
  });
  function updateNavBadges(){ try{ const c=window.PairedData?.counts?.(); if(!c) return; const nav=document.getElementById('mainNavIcons'); if(!nav) return; const profileLink=nav.querySelector('a[href*="profile"]'); if(profileLink){ let badge=profileLink.querySelector('.nav-badge'); if(c.bookmarks>0){ if(!badge){ badge=document.createElement('span'); badge.className='nav-badge absolute -top-1 -right-2 bg-orange-600 text-[9px] leading-none px-1.5 py-0.5 rounded-full font-semibold shadow'; profileLink.classList.add('relative'); profileLink.appendChild(badge);} badge.textContent=c.bookmarks>9?'9+':String(c.bookmarks);} else if(badge){ badge.remove(); } } }catch(e){} }
  document.addEventListener('DOMContentLoaded', updateNavBadges);
  window.addEventListener('storage', updateNavBadges);
  window.PairedUpdateBadges = updateNavBadges;
})();
