;(function () {
  'use strict'

  var article = document.querySelector('article.doc')
  if (!article) return
//   var toolbar = document.querySelector('.toolbar')
  var toolbar = document.querySelector('.docs__sticky-breadcrumb')
  var supportsScrollToOptions = 'scrollTo' in document.documentElement

  function decodeFragment (hash) {
    return hash && (~hash.indexOf('%') ? decodeURIComponent(hash) : hash).slice(1)
  }

  function computePosition (el, sum) {
    return article.contains(el) ? computePosition(el.offsetParent, el.offsetTop + sum) : sum
  }

  function jumpToAnchor (e) {
    if (e) {
      if (e.altKey || e.ctrlKey) return
      window.location.hash = '#' + this.id
	//   console.log(e);
      e.preventDefault()
    }
	//   console.log('hash');
	//   console.log(this);
	//   console.log(e);
    var y = computePosition(this, 0) - toolbar.getBoundingClientRect().bottom
    // var y = computePosition(this, 0) - 145
	// console.log( toolbar.getBoundingClientRect().bottom );
	// console.log( toolbar.querySelector('.cards').getBoundingClientRect().bottom );
	// console.log( computePosition(this, 0) );
	// console.log(y);
	// var y = 145;
    var instant = e === false && supportsScrollToOptions
    // instant ? window.scrollTo({ left: 0, top: y, behavior: 'instant' }) : window.scrollTo(0, y)
    instant ? this.scrollTo({ left: 0, top: y, behavior: 'instant' }) : this.scrollTo(0, y)

	// this.scrollIntoView({block: 'start'})
  }

  window.addEventListener('load', function jumpOnLoad (e) {
    var fragment, target
    if ((fragment = decodeFragment(window.location.hash)) && (target = document.getElementById(fragment))) {
      jumpToAnchor.call(target, false)
      setTimeout(jumpToAnchor.bind(target, false), 250)
    }
    window.removeEventListener('load', jumpOnLoad)
  })

  Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (el) {
    var fragment, target
    if ((fragment = decodeFragment(el.hash)) && (target = document.getElementById(fragment))) {
      el.addEventListener('click', jumpToAnchor.bind(target))
    }
  })
})()
