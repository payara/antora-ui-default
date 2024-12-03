// Sidebar toggle in header, used on narrow screen layouts.
document.getElementById('external-toggle-sidebar').addEventListener('click', () => {
	// Grab the Sidebar via its ID.
	const att_minimized = document.getElementById('sidebar1');
	// Toggle the minimized attribute, note that this should be set as a 1 or 0.
	att_minimized.setAttribute( 'minimized', Number(!JSON.parse(att_minimized.getAttribute('minimized'))) );
});


// Toggle for expanding all items in the sidebar.
class DocsExpandAll extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.querySelector('.button').addEventListener('click', (e) => {
			// Toggled value of toggle button.
			const toggled = this.querySelector('.js__button--toggle').getAttribute('toggled');

			// Get all buttons in the sidebar menu that have sub-menus.
			const btns = document.querySelectorAll('.sidebar__content .menu__content[aria-haspopup]');
			
			// Set the aria-expanded on all buttons.
			for (let b of btns) {
				b.setAttribute('aria-expanded', (toggled == '1') ? 'true' : 'false');
			}
		});
	}
}
customElements.define('docs-expand-all', DocsExpandAll);


// Sticky breadcrumb.
class DocsStickyBreadcrumb extends HTMLElement {
	constructor() {
		super();
	}

	__set_sticky_top() {
		let header_height = 0;
		try {
			header_height = document.querySelector('.page--sticky-header .page__header').offsetHeight;
		} catch(e) {}
		this.setAttribute('style', '--breadcrumb-offset: '+header_height+'px;');
	}

	__sticky_top() {
		if (!document.querySelector('.page--sticky-header .page__header')) return false;
		const debounce = new WeakMap();
		let old_top = 0;
		this.resize_observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			clearTimeout( debounce.get( entry.target ) );
			debounce.set( entry.target, setTimeout(() => {
				if (entry.contentBoxSize[0].blockSize !== old_top) {
					this.__set_sticky_top();
				}
				old_top = entry.contentBoxSize[0].blockSize;
			}, 150) );
		});
		this.resize_observer.observe(document.querySelector('.page--sticky-header .page__header'));
	}
	
	connectedCallback() {
		this.classList.add('js__docs__sticky-breadcrumb');
		const observer = new IntersectionObserver(([e]) => {
			e.target.classList.toggle('stuck', e.intersectionRatio < 1);
		}, {
			threshold: [1]
		}).observe(this);
		this.__sticky_top();
	}
}
customElements.define('docs-sticky-breadcrumb', DocsStickyBreadcrumb);


// Sticky TOC.
class DocsTocSticky extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		const debounce = new WeakMap();
		let old_top = 0;
		this.resize_observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			clearTimeout( debounce.get( entry.target ) );
			debounce.set( entry.target, setTimeout(() => {
				if (entry.contentBoxSize[0].inlineSize !== old_top) {
					this.setAttribute('style','');
					let new_top = document.querySelector('.docs__sticky-breadcrumb').getBoundingClientRect().bottom + 16;
					// if (new_top < 144) new_top = 144;
					this.setAttribute('style','top: '+new_top+'px;');
					// Whilst we're here shove a CSS custom value in the main page, we can use this later to scroll offset and stop stuff disappearing behind the header.
					document.querySelector('.page').setAttribute('style', '--offset-scroll: '+new_top+'px;');
					console.log('--offset-scroll: '+new_top+'px;');
				}
				old_top = entry.contentBoxSize[0].inlineSize;
			}, 301) );
		});
		this.resize_observer.observe(document.querySelector('.page'));
	}
}
customElements.define('docs-toc-sticky', DocsTocSticky);
