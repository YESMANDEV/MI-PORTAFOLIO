// Manejo simple de vistas sin recarga y registro del Service Worker
(() => {
  const views = Array.from(document.querySelectorAll('.view'))
  const buttons = Array.from(document.querySelectorAll('button[data-target]'))

  function show(id, push=true){
    views.forEach(v=> v.id===id ? v.classList.add('active') : v.classList.remove('active'))
    if(push) history.pushState({view:id}, '', '#'+id)
  }

  buttons.forEach(btn => btn.addEventListener('click', e=>{
    const t = btn.dataset.target
    show(t)
  }))

  // Estado inicial según hash o default
  const initial = location.hash ? location.hash.replace('#','') : 'home'
  show(initial, false)

  // Soportar back/forward
  window.addEventListener('popstate', e=>{
    const id = (e.state && e.state.view) || (location.hash ? location.hash.replace('#','') : 'home')
    show(id, false)
  })

  // Registrar Service Worker para cache offline
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').catch(err=>{
        console.warn('SW registration failed:', err)
      })
    })
  }
})();
