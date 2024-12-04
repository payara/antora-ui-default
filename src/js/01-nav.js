;(function () {
  'use strict'

  var SECT_CLASS_RX = /^sect(\d)$/

  // var navContainer = document.querySelector('.nav-container')
  var navContainer = document.querySelector('.page__sidebar')
  if (!navContainer) return
  // var navToggle = document.querySelector('.nav-toggle')
  // var nav = navContainer.querySelector('.nav')
  var nav = navContainer.querySelector('.sidebar')
  // var navMenuToggle = navContainer.querySelector('.nav-menu-toggle')

  // navToggle.addEventListener('click', showNav)
  // navContainer.addEventListener('click', trapEvent)

  // var menuPanel = navContainer.querySelector('[data-panel=menu]')
  var menuPanel = navContainer.querySelector('.sidebar__content')
  if (!menuPanel) return
  // var explorePanel = navContainer.querySelector('[data-panel=explore]')

  var currentPageItem = menuPanel.querySelector('.is-current-page')
  var originalPageItem = currentPageItem
  if (currentPageItem) {
    activateCurrentPath(currentPageItem)
    // scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
    scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.menu__content'))
  } else {
    menuPanel.scrollTop = 0
  }

  // find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
  //   var li = btn.parentElement
  //   btn.addEventListener('click', toggleActive.bind(li))
  //   var navItemSpan = findNextElement(btn, '.nav-text')
  //   if (navItemSpan) {
  //     navItemSpan.style.cursor = 'pointer'
  //     navItemSpan.addEventListener('click', toggleActive.bind(li))
  //   }
  // })

  // if (navMenuToggle && menuPanel.querySelector('.nav-item-toggle')) {
  //   navMenuToggle.style.display = ''
  //   navMenuToggle.addEventListener('click', function () {
  //     var collapse = !this.classList.toggle('is-active')
  //     // find(menuPanel, '.nav-item > .nav-item-toggle').forEach(function (btn) {
  //     find(menuPanel, '.menu-item > .nav-item-toggle').forEach(function (btn) {
  //       collapse ? btn.parentElement.classList.remove('is-active') : btn.parentElement.classList.add('is-active')
  //     })
  //     if (currentPageItem) {
  //       if (collapse) activateCurrentPath(currentPageItem)
  //       // scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
  //       scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('a.menu__content'))
  //     } else {
  //       menuPanel.scrollTop = 0
  //     }
  //   })
  // }

  // if (explorePanel) {
  //   explorePanel.querySelector('.context').addEventListener('click', function () {
  //     // NOTE logic assumes there are only two panels
  //     find(nav, '[data-panel]').forEach(function (panel) {
  //       panel.classList.toggle('is-active')
  //     })
  //   })
  // }

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  function onHashChange () {
    var navLink
    var hash = window.location.hash
    if (hash) {
      if (hash.indexOf('%')) hash = decodeURIComponent(hash)
      // navLink = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
      navLink = menuPanel.querySelector('.menu__content[href="' + hash + '"]')
      if (!navLink) {
        var targetNode = document.getElementById(hash.slice(1))
        if (targetNode) {
          var current = targetNode
          var ceiling = document.querySelector('article.doc')
          while ((current = current.parentNode) && current !== ceiling) {
            var id = current.id
            // NOTE: look for section heading
            if (!id && (id = SECT_CLASS_RX.test(current.className))) id = (current.firstElementChild || {}).id
            // if (id && (navLink = menuPanel.querySelector('.nav-link[href="#' + id + '"]'))) break
            if (id && (navLink = menuPanel.querySelector('.menu__content[href="#' + id + '"]'))) break
          }
        }
      }
    }
    var navItem
    if (navLink) {
      navItem = navLink.parentNode
    } else if (originalPageItem) {
      // navLink = (navItem = originalPageItem).querySelector('.nav-link')
      navLink = (navItem = originalPageItem).querySelector('.menu__content')
    } else {
      return
    }
    if (navItem === currentPageItem) return
    // find(menuPanel, '.nav-item.is-active').forEach(function (el) {
    find(menuPanel, '.menu__item.is-active').forEach(function (el) {
      el.classList.remove('is-active', 'is-current-path', 'is-current-page')
      el.querySelector('.menu__content').setAttribute('aria-expanded', 'false')
      el.querySelector('.menu__content').removeAttribute('aria-current')
      el.querySelector('.menu__content').classList.remove('menu__current-parent')
    })
    navItem.classList.add('is-current-page')
    navItem.querySelector('a').setAttribute('aria-current', 'page')
    currentPageItem = navItem
    activateCurrentPath(navItem)
    scrollItemToMidpoint(menuPanel, navLink)
  }

  // if (menuPanel.querySelector('.nav-link[href^="#"]')) {
  if (menuPanel.querySelector('.menu__content[href^="#"]')) {
    if (window.location.hash) onHashChange()
    window.addEventListener('hashchange', onHashChange)
  }
  if (navContainer.querySelector('[aria-current] ~ ul')) {
    navContainer.querySelector('[aria-current]').setAttribute('aria-expanded', 'true')
  }

  function activateCurrentPath (navItem) {
    var ancestorClasses
    var ancestor = navItem.parentNode
    // while (!(ancestorClasses = ancestor.classList).contains('nav-menu')) {
    while (!(ancestorClasses = ancestor.classList).contains('menu')) {
      // if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('menu__item')) {
        ancestorClasses.add('is-active', 'is-current-path')
        ancestor.querySelector('.menu__content').setAttribute('aria-expanded', 'true')
        ancestor.querySelector('.menu__content').classList.add('menu__current-parent')
      }
      ancestor = ancestor.parentNode
    }
    navItem.classList.add('is-active')
  }

  // function toggleActive () {
  //   if (this.classList.toggle('is-active')) {
  //     var padding = parseFloat(window.getComputedStyle(this).marginTop)
  //     var rect = this.getBoundingClientRect()
  //     var menuPanelRect = menuPanel.getBoundingClientRect()
  //     var overflowY = (rect.bottom - menuPanelRect.top - menuPanelRect.height + padding).toFixed()
  //     if (overflowY > 0)
  //       menuPanel.scrollTop += Math.min((rect.top - menuPanelRect.top - padding).toFixed(), overflowY)
  //   }
  // }

  // function showNav (e) {
  //   if (navToggle.classList.contains('is-active')) return hideNav(e)
  //   trapEvent(e)
  //   var html = document.documentElement
  //   html.classList.add('is-clipped--nav')
  //   navToggle.classList.add('is-active')
  //   navContainer.classList.add('is-active')
  //   var bounds = nav.getBoundingClientRect()
  //   var expectedHeight = window.innerHeight - Math.round(bounds.top)
  //   if (Math.round(bounds.height) !== expectedHeight) nav.style.height = expectedHeight + 'px'
  //   html.addEventListener('click', hideNav)
  // }

  // function hideNav (e) {
  //   trapEvent(e)
  //   var html = document.documentElement
  //   html.classList.remove('is-clipped--nav')
  //   navToggle.classList.remove('is-active')
  //   navContainer.classList.remove('is-active')
  //   html.removeEventListener('click', hideNav)
  // }

  // function trapEvent (e) {
  //   e.stopPropagation()
  // }

  function scrollItemToMidpoint (panel, el) {
    // var rect = panel.getBoundingClientRect()
    // var effectiveHeight = rect.height
    // var navStyle = window.getComputedStyle(nav)
    // if (navStyle.position === 'sticky') effectiveHeight -= rect.top - parseFloat(navStyle.top)
    // panel.scrollTop = Math.max(0, (el.getBoundingClientRect().height - effectiveHeight) * 0.5 + el.offsetTop)

    // Get the offsetTop to the current menu item from the top of the window.
    var menu_li = document.querySelector('.sidebar__content .is-current-page').getBoundingClientRect()
    // Get the offsetTop to the scrollable sidebar element from the top of the window.
    var sidebar = document.querySelector('.sidebar__content').getBoundingClientRect()
    // Get the current scrolled position of the sidebar scrollable element.
    var sidebar_scrolled = document.querySelector('.sidebar__content').scrollTop
    // Approximate the menu scrolling to the middle.
    var half_height = (sidebar.height / 2) - menu_li.height

    document.querySelector('.sidebar__content').scrollTo(0, Math.max(0, menu_li.top - sidebar.top - half_height + sidebar_scrolled))
  }

  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }

  // function findNextElement (from, selector) {
  //   var el = from.nextElementSibling
  //   return el && selector ? el[el.matches ? 'matches' : 'msMatchesSelector'](selector) && el : el
  // }
})()
