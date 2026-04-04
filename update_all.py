#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tasks 8-15 + bugfix: all blog post HTML files + posts.json transformation
"""
import re, json, os

BLOG_DIR = 'blog'

# ── Task 15: Update posts.json to multi-category arrays ──────────────────────
with open(f'{BLOG_DIR}/posts.json', 'r', encoding='utf-8') as f:
    posts_data = json.load(f)

MULTI_CAT = {
    '서대전-사라요가-체험수업-안내':    ['안내'],
    '서대전-얼라인먼트-요가-입문':      ['중급수련'],
    '대전중구-소그룹요가-비교':         ['수업소개'],
    '서대전-소그룹요가-비교':           ['수업소개'],
    '서대전-플라잉요가-초보가이드':     ['수업소개', '요가입문'],
    '대전중구-블랙롤-근막이완-가이드':  ['수업소개', '요가입문'],
    '서대전-인사이드플로우-입문가이드': ['수업소개', '요가입문'],
    '대전중구-빈야사-초보가이드':       ['수업소개', '요가입문'],
    '대전중구-도구테라피-완전가이드':   ['수업소개'],
}
for p in posts_data:
    slug = p['slug']
    if slug in MULTI_CAT:
        p['category'] = MULTI_CAT[slug]
    else:
        # Wrap any remaining string categories in array
        if isinstance(p.get('category'), str):
            p['category'] = [p['category']]

with open(f'{BLOG_DIR}/posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts_data, f, ensure_ascii=False, indent=2)
print('[15] posts.json: multi-category arrays updated')

post_by_slug = {p['slug']: p for p in posts_data}

# ── Helpers ──────────────────────────────────────────────────────────────────
def make_cat_badges_hero(cats):
    """Multiple category badges for post hero"""
    if isinstance(cats, str):
        cats = [cats]
    return ' '.join('<span class="post-hero-cat">' + c + '</span>' for c in cats)

def make_related(current_slug):
    others = [p for p in posts_data if p['slug'] != current_slug][:4]
    cards = []
    for p in others:
        thumb = p.get('thumbnail', '')
        thumb_html = (
            '<div class="rc-thumb"><img src="' + thumb + '" alt="" loading="lazy"'
            ' onerror="this.parentElement.style.display=\'none\'"></div>'
        ) if thumb else ''
        cats = p.get('category', [])
        if isinstance(cats, str):
            cats = [cats]
        cat_badges = ' '.join('<span class="rc-cat">' + c + '</span>' for c in cats)
        cards.append(
            '<a href="' + p['slug'] + '.html" class="related-card">' +
            thumb_html +
            '<div class="rc-body">' +
            '<div class="rc-cats">' + cat_badges + '</div>' +
            '<div class="rc-title">' + p['title'] + '</div>' +
            '<div class="rc-date">' + p['date'] + '</div>' +
            '</div></a>'
        )
    return (
        '<section class="blog-related">\n'
        '  <h3>관련 글 더 보기</h3>\n'
        '  <div class="related-grid">\n    ' +
        '\n    '.join(cards) +
        '\n  </div>\n'
        '  <a href="../blog/" class="related-all-link">블로그 전체 보기 →</a>\n'
        '</section>'
    )

HIDDEN_ADMIN = '<a href="../admin.html" style="font-size:10px;color:var(--brown);text-decoration:none;display:block;margin-top:4px">sarayoga_gogossing</a>'

# ── Process each blog post HTML ──────────────────────────────────────────────
html_files = sorted([f for f in os.listdir(BLOG_DIR)
                     if f.endswith('.html') and f != 'index.html'])

for html_file in html_files:
    slug = html_file.replace('.html', '')
    filepath = f'{BLOG_DIR}/{html_file}'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    post = post_by_slug.get(slug, {})
    cats = post.get('category', [])
    if isinstance(cats, str):
        cats = [cats]

    # ── Bug fix: add text-decoration:none to .nav-link ──────────────────────
    content = content.replace(
        '.nav-link{position:relative;padding:4px 0;font-size:13px;letter-spacing:1.5px;font-weight:400;color:rgba(255,255,255,.8);text-shadow:0 1px 8px rgba(0,0,0,.1);transition:color .3s}',
        '.nav-link{position:relative;padding:4px 0;font-size:13px;letter-spacing:1.5px;font-weight:400;color:rgba(255,255,255,.8);text-shadow:0 1px 8px rgba(0,0,0,.1);transition:color .3s;text-decoration:none}'
    )
    # Also fix nav-cta
    content = content.replace(
        '.nav-cta{padding:10px 24px;border-radius:24px;font-size:13px;letter-spacing:1.5px;color:#FAF6F1;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(8px);transition:all .35s ease}',
        '.nav-cta{padding:10px 24px;border-radius:24px;font-size:13px;letter-spacing:1.5px;color:#FAF6F1;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(8px);transition:all .35s ease;text-decoration:none}'
    )

    # ── Task 15: Replace single cat badge with multi-cat badges in post hero ─
    new_badges = make_cat_badges_hero(cats)
    # Replace old single badge: <span class="post-hero-cat">...</span>
    content = re.sub(
        r'(<div class="post-hero-meta">\s*)<span class="post-hero-cat">[^<]*</span>',
        r'\1' + new_badges,
        content
    )

    # ── Add rc-cats CSS if not present ──────────────────────────────────────
    if '.rc-cats' not in content:
        content = content.replace(
            '.rc-body{padding:10px 12px 12px}',
            '.rc-cats{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:5px}.rc-body{padding:10px 12px 12px}'
        )

    # ── Task 15: Regenerate related section with multi-cat support ──────────
    content = re.sub(
        r'<section class="blog-related">.*?</section>',
        make_related(slug),
        content,
        flags=re.DOTALL
    )

    # ── Task 12: Add hidden admin link to footer ─────────────────────────────
    if 'sarayoga_gogossing' not in content:
        content = content.replace(
            '<div class="ft-copy">',
            HIDDEN_ADMIN + '\n  <div class="ft-copy">'
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[bug+12+15] Updated: {html_file}')

print('Blog posts done.')
