// Theme toggle
const html = document.documentElement
const themeBtn = document.getElementById('theme-toggle')
const themeIcon = document.getElementById('theme-icon')

const saved = localStorage.getItem('theme') || 'dark'
html.setAttribute('data-theme', saved)
themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon'

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
})

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-menu').classList.toggle('open')
})
document.querySelectorAll('.nav-link').forEach((l) => {
  l.addEventListener('click', () =>
    document.getElementById('nav-menu').classList.remove('open'),
  )
})

// Navbar scroll class
window.addEventListener('scroll', () => {
  document
    .getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 20)

  // Active nav on scroll
  const scrollY = window.scrollY + 80
  document.querySelectorAll('section[id]').forEach((sec) => {
    if (
      scrollY >= sec.offsetTop &&
      scrollY < sec.offsetTop + sec.offsetHeight
    ) {
      document
        .querySelectorAll('.nav-link')
        .forEach((l) => l.classList.remove('active'))
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`)
      if (link) link.classList.add('active')
    }
  })
})

// Typed text animation
const roles = ['Full Stack Developer', 'Java Developer', 'Problem Solver']
let roleIndex = 0,
  charIndex = 0,
  deleting = false
const typedEl = document.getElementById('typed')

function type() {
  const current = roles[roleIndex]
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex)
    if (charIndex === current.length) {
      deleting = true
      setTimeout(type, 1800)
      return
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex)
    if (charIndex === 0) {
      deleting = false
      roleIndex = (roleIndex + 1) % roles.length
    }
  }
  setTimeout(type, deleting ? 60 : 90)
}
type()

// ─── SCROLL ANIMATION ENGINE ───────────────────────────────────────────────

// Map of selector → animation variant
const animMap = [
  { sel: '.section-header', anim: 'fade-up', stagger: false },
  { sel: '.about-text', anim: 'fade-right', stagger: false },
  { sel: '.about-right', anim: 'fade-left', stagger: false },
  { sel: '.stat-card', anim: 'zoom', stagger: true },
  { sel: '.quality-item', anim: 'fade-right', stagger: true },
  { sel: '.edu-card', anim: 'fade-up', stagger: true },
  { sel: '.skill-card', anim: 'zoom', stagger: true },
  { sel: '.project-card', anim: 'fade-up', stagger: true },
  { sel: '.cert-card', anim: 'fade-left', stagger: true },
  { sel: '.contact-info', anim: 'fade-right', stagger: false },
  { sel: '.contact-form', anim: 'fade-left', stagger: false },
  { sel: '.skills-category', anim: 'fade-up', stagger: true },
]

// Tag every element with data-anim and stagger index within its parent
animMap.forEach(({ sel, anim, stagger }) => {
  const groups = {}
  document.querySelectorAll(sel).forEach((el) => {
    el.dataset.anim = anim
    if (stagger) {
      const parent = el.parentElement
      if (!groups.has) groups[parent] = groups[parent] || []
      groups[parent].push(el)
    }
  })
  if (stagger) {
    Object.values(groups).forEach((siblings) => {
      siblings.forEach((el, i) => {
        el.dataset.delay = Math.min(i, 6)
      })
    })
  }
})

// Track scroll direction
let lastY = window.scrollY
let scrollDir = 'down'
window.addEventListener(
  'scroll',
  () => {
    scrollDir = window.scrollY > lastY ? 'down' : 'up'
    lastY = window.scrollY
  },
  { passive: true },
)

// IntersectionObserver — fires on enter AND exit
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting) {
        // Remove exit classes, then add visible on next paint
        el.target.classList.remove('exit-up', 'exit-down')
        requestAnimationFrame(() => {
          requestAnimationFrame(() => el.target.classList.add('is-visible'))
        })
      } else if (el.target.classList.contains('is-visible')) {
        // Exiting — direction-aware
        el.target.classList.remove('is-visible')
        el.target.classList.add(scrollDir === 'down' ? 'exit-up' : 'exit-down')
      }
    })
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  },
)

document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el))

// ─── PARALLAX HERO ORBS ────────────────────────────────────────────────────
const orb1 = document.querySelector('.hero-orb-1')
const orb2 = document.querySelector('.hero-orb-2')
let ticking = false

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (orb1) orb1.style.transform = `translateY(${y * 0.18}px)`
        if (orb2) orb2.style.transform = `translateY(${y * -0.12}px)`
        ticking = false
      })
      ticking = true
    }
  },
  { passive: true },
)

// Contact form
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const btn = e.target.querySelector('button[type="submit"]')
  btn.innerHTML = 'Message Sent <i class="fas fa-check"></i>'
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)'
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>'
    btn.style.background = ''
    e.target.reset()
  }, 3000)
})
