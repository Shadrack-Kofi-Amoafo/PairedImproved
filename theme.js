// Global Theme Manager for Paired
(function(){
  const STORAGE_KEY='paired.settings';
  function read(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');}catch(e){return {};}}
  function write(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function isDark(data){ return data.darkMode !== false; } // default dark
  function applyTheme(){ const d=read(); document.documentElement.classList.toggle('theme-light', !isDark(d)); }
  function setDark(dark){ const data=read(); data.darkMode = dark; write(data); applyTheme(); }
  // monetization flags (simulate purchases / premium etc.)
  function setFlag(flag,value){ const data=read(); data[flag]=value; write(data); }
  function getFlag(flag){ return !!read()[flag]; }
  // expose minimal API for premium simulation
  window.PairedState = {
    isPremium: ()=> getFlag('premiumActive'),
    activatePremium(){ setFlag('premiumActive', true); document.dispatchEvent(new CustomEvent('premium-change',{detail:true})); },
    deactivatePremium(){ setFlag('premiumActive', false); document.dispatchEvent(new CustomEvent('premium-change',{detail:false})); },
    togglePremium(){ const v=!getFlag('premiumActive'); setFlag('premiumActive', v); document.dispatchEvent(new CustomEvent('premium-change',{detail:v})); },
    hasBoostCredits(){ return (read().boostCredits||0)>0; },
    addBoostCredits(n){ const data=read(); data.boostCredits=(data.boostCredits||0)+n; write(data); document.dispatchEvent(new CustomEvent('boost-credits-change',{detail:data.boostCredits})); },
    useBoostCredit(){ const data=read(); if((data.boostCredits||0)>0){ data.boostCredits--; write(data); document.dispatchEvent(new CustomEvent('boost-credits-change',{detail:data.boostCredits})); return true;} return false; }
  };
  // expose
  window.PairedTheme = { apply:applyTheme, setDark, toggle(){ setDark(!isDark(read())); }, isDark: ()=> isDark(read()), _read:read };
  // auto apply early (in case this file in head)
  applyTheme();
  document.addEventListener('DOMContentLoaded', ()=>{
    // attach checkboxes/buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(el=>{
      if(el.type==='checkbox'){
        el.checked = window.PairedTheme.isDark();
        el.addEventListener('change', ()=> window.PairedTheme.setDark(el.checked));
      } else {
        el.addEventListener('click', ()=> window.PairedTheme.toggle());
      }
    });
    // reflect premium UI badges
    function applyPremiumBadges(){
      document.querySelectorAll('[data-premium-only]').forEach(el=>{
        el.classList.toggle('hidden', !window.PairedState.isPremium());
      });
      document.querySelectorAll('[data-premium-badge]').forEach(el=>{
        el.innerHTML = window.PairedState.isPremium() ? '<span class="ml-1 px-1 py-0.5 text-[9px] rounded bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold">PREMIUM</span>' : '';
      });
    }
    applyPremiumBadges();
    document.addEventListener('premium-change', applyPremiumBadges);
  });
})();
