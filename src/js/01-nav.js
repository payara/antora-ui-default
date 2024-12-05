;(function () {
  'use strict'

  var SECT_CLASS_RX = /^sect(\d)$/

  var navContainer = document.querySelector('.page__sidebar')
  if (!navContainer) return
  var menuPanel = navContainer.querySelector('.sidebar__content')
  if (!menuPanel) return

  var currentPageItem = menuPanel.querySelector('.is-current-page')
  var originalPageItem = currentPageItem
  if (currentPageItem) {
    activateCurrentPath(currentPageItem)
    scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.menu__content'))
  } else {
    menuPanel.scrollTop = 0
  }

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  function onHashChange () {
    var navLink
    var hash = window.location.hash
    if (hash) {
      if (hash.indexOf('%')) hash = decodeURIComponent(hash)
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
            if (id && (navLink = menuPanel.querySelector('.menu__content[href="#' + id + '"]'))) break
          }
        }
      }
    }
    var navItem
    if (navLink) {
      navItem = navLink.parentNode
    } else if (originalPageItem) {
      navLink = (navItem = originalPageItem).querySelector('.menu__content')
    } else {
      return
    }
    if (navItem === currentPageItem) return
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
    while (!(ancestorClasses = ancestor.classList).contains('menu')) {
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('menu__item')) {
        ancestorClasses.add('is-active', 'is-current-path')
        ancestor.querySelector('.menu__content').setAttribute('aria-expanded', 'true')
        ancestor.querySelector('.menu__content').classList.add('menu__current-parent')
      }
      ancestor = ancestor.parentNode
    }
    navItem.classList.add('is-active')
  }

  function scrollItemToMidpoint (panel, el) {
    // Get the offsetTop to the current menu item from the top of the window.
    var menuLi = document.querySelector('.sidebar__content .is-current-page').getBoundingClientRect()
    // Get the offsetTop to the scrollable sidebar element from the top of the window.
    var sidebar = document.querySelector('.sidebar__content').getBoundingClientRect()
    // Get the current scrolled position of the sidebar scrollable element.
    var sidebarScrolled = document.querySelector('.sidebar__content').scrollTop
    // Approximate the menu scrolling to the middle.
    var halfHeight = (sidebar.height / 2) - menuLi.height
    document.querySelector('.sidebar__content')
      .scrollTo(0, Math.max(0, menuLi.top - sidebar.top - halfHeight + sidebarScrolled))
  }

  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }
})()
