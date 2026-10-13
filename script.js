/* ============================================================
   BOX SALES · CONSULTORIA COMERCIAL
   script.js — preloader · nav · reveal · progress · faq ·
   feedbacks · consent · back to top
   ============================================================ */
(function () {
    'use strict';

    /* ---------- PRELOADER ---------- */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        document.body.style.overflow = 'hidden';
        const hide = () => {
            setTimeout(() => {
                preloader.classList.add('is-hidden');
                document.body.style.overflow = '';
                setTimeout(() => preloader.remove(), 650);
            }, 1500);
        };
        if (document.readyState === 'complete') hide();
        else {
            window.addEventListener('load', hide);
            setTimeout(hide, 3500); // failsafe
        }
    }

    /* ---------- NAV SCROLL STATE ---------- */
    const nav = document.getElementById('nav');
    const onNavScroll = () => {
        if (!nav) return;
        nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onNavScroll();

    /* ---------- MOBILE MENU ---------- */
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');
    if (toggle && mobile) {
        const close = () => {
            mobile.classList.remove('is-open');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };
        toggle.addEventListener('click', () => {
            const open = mobile.classList.toggle('is-open');
            toggle.classList.toggle('is-active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        });
        mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    }

    /* ---------- SCROLL PROGRESS + BACK TO TOP ---------- */
    const progress = document.getElementById('progress');
    const toTop = document.getElementById('toTop');
    const onScroll = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        if (progress) progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
        if (toTop) toTop.classList.toggle('is-visible', scrolled > 500);
        onNavScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ---------- REVEAL ON SCROLL ---------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------- SMOOTH ANCHOR ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 64;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ---------- FAQ ACCORDION ---------- */
    document.querySelectorAll('.faq__q').forEach((q) => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq__item');
            const answer = item.querySelector('.faq__a');
            const open = item.classList.contains('is-open');
            document.querySelectorAll('.faq__item.is-open').forEach((it) => {
                if (it !== item) { it.classList.remove('is-open'); it.querySelector('.faq__a').style.maxHeight = null; }
            });
            if (open) { item.classList.remove('is-open'); answer.style.maxHeight = null; }
            else { item.classList.add('is-open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
        });
    });

    /* ---------- FEEDBACK CAROUSEL ---------- */
    const track = document.getElementById('fbTrack');
    if (track) {
        const cards = Array.from(track.children);
        const dotsWrap = document.getElementById('fbDots');
        const prev = document.getElementById('fbPrev');
        const next = document.getElementById('fbNext');

        // build status bar dots
        if (dotsWrap) {
            cards.forEach((_, i) => {
                const d = document.createElement('span');
                d.className = 'fb__dot' + (i === 0 ? ' is-active' : '');
                d.addEventListener('click', () => cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }));
                dotsWrap.appendChild(d);
            });
        }
        const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

        const step = () => (cards[0] ? cards[0].offsetWidth + 18 : 320);
        if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
        if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

        const sync = () => {
            const c = track.scrollLeft + track.clientWidth / 2;
            let active = 0; let acc = 0;
            for (let i = 0; i < cards.length; i++) {
                acc += cards[i].offsetWidth + 18;
                if (track.scrollLeft + cards[i].offsetWidth / 2 + i * 0 <= c) active = i;
            }
            // simpler: find card whose center is closest to viewport center
            let best = 0; let bestDist = Infinity;
            cards.forEach((card, i) => {
                const center = card.offsetLeft - track.scrollLeft + card.offsetWidth / 2;
                const dist = Math.abs(center - track.clientWidth / 2);
                if (dist < bestDist) { bestDist = dist; best = i; }
            });
            dots.forEach((d, i) => d.classList.toggle('is-active', i === best));
        };
        track.addEventListener('scroll', () => { window.requestAnimationFrame(sync); }, { passive: true });
    }

    /* ---------- CONSENT POPUP ---------- */
    const consent = document.getElementById('consent');
    if (consent) {
        const KEY = 'boxsales_consent';
        let stored = null;
        try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }
        if (!stored) setTimeout(() => consent.classList.add('is-open'), 1700);
        const decide = (val) => {
            try { localStorage.setItem(KEY, val); } catch (e) {}
            consent.classList.remove('is-open');
            setTimeout(() => consent.remove(), 700);
        };
        const ok = document.getElementById('consentAccept');
        const no = document.getElementById('consentDecline');
        if (ok) ok.addEventListener('click', () => decide('accepted'));
        if (no) no.addEventListener('click', () => decide('declined'));
    }

    /* ---------- DYNAMIC YEAR ---------- */
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
