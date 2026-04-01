# ReconEthereal — Static Site

> A cybersecurity knowledge hub: research, walkthroughs, guides, and curated tools.  
> **Domain:** reconethereal.com

---

## 🗂 Project Structure

```
reconethereal/
│
├── index.html                  ← Homepage
├── research.html               ← Research & Reports listing
├── labs.html                   ← Labs overview page
│   ├── labs-htb.html           ← Hack The Box walkthroughs
│   ├── labs-thm.html           ← TryHackMe rooms
│   └── labs-ctf.html           ← CTF write-ups
├── guides.html                 ← Guides overview
│   ├── guides-offensive.html   ← Offensive security guides
│   └── guides-defensive.html   ← Defensive security guides
├── tools.html                  ← Tools & Resources library
├── about.html                  ← About page
├── contact.html                ← Contact page
│
├── assets/
│   ├── css/                    ← (Optional) extracted stylesheets
│   ├── js/                     ← (Optional) extracted scripts
│   └── img/                    ← Images and icons
│
└── README.md
```

---

## 🚀 Deployment

### GitHub Pages
1. Push this folder to a GitHub repository (e.g. `reconethereal/reconethereal.github.io`)
2. Go to **Settings → Pages → Source**: set to `main` branch, `/ (root)`
3. Add a `CNAME` file with content: `reconethereal.com`
4. Point your domain's DNS to GitHub Pages IPs

### Cloudflare Pages (Recommended — free, fast CDN)
1. Connect repo in **Cloudflare Dashboard → Pages → Create project**
2. Build command: *(leave empty — no build step needed for pure HTML)*
3. Output directory: `/` (root)
4. Add custom domain `reconethereal.com` in Pages settings

### Netlify
1. Drag-and-drop this folder to [netlify.com/drop](https://netlify.com/drop), or
2. Connect GitHub repo → auto-deploy on every push
3. Add domain in **Site settings → Domain management**

---

## ✏️ Adding Content

### Adding a new Research post
1. Duplicate the post card HTML block in `research.html`
2. Update: title, tags, description, date, read time
3. Create the individual post file: `research/post-slug.html`
4. Update `SEARCH_DATA` array in `index.html` with the new entry

### Adding a new HTB / THM walkthrough
1. Open `labs-htb.html` or `labs-thm.html`
2. Add a new post card with the machine name, difficulty badge, tags, and description
3. Link to the individual writeup file

### Adding a tool
1. Open `tools.html`
2. Add a `tool-card` block with name, category, and badge

---

## 🔍 Search

The site uses a **lightweight client-side search** (no backend required).

**To add a new item to search:**  
In `index.html`, find `const SEARCH_DATA = [...]` and add:

```javascript
{
  title: "Your Post Title",
  cat: "Research",            // Research | Hack The Box | TryHackMe | CTF Archives | Tools | Offensive Security | Defensive Security
  desc: "Short description.", 
  url: "research.html",       // or the specific post file path
  tags: ["keyword1","keyword2"]
}
```

Keyboard shortcut: `Ctrl+K` (or `Cmd+K` on Mac) opens search from any page.

---

## 🎨 Design System

### Colors
| Variable | Value | Usage |
|---|---|---|
| `--accent-cyan` | `#00e5ff` | Primary accent, links, highlights |
| `--accent-purple` | `#8b5cf6` | Secondary accent |
| `--accent-green` | `#00e676` | Success, Easy difficulty |
| `--accent-teal` | `#00bfa5` | Tertiary accent |

### Tag classes
```html
<span class="tag tag-cyan">Active Directory</span>
<span class="tag tag-green">Recon</span>
<span class="tag tag-purple">Kerberos</span>
<span class="tag tag-red">CVE</span>
<span class="tag tag-teal">OSINT</span>
```

### Difficulty badges
```html
<span class="diff-badge diff-easy">Easy</span>
<span class="diff-badge diff-medium">Medium</span>
<span class="diff-badge diff-hard">Hard</span>
```

---

## 🌙 Dark / Light Mode

Defaults to **dark mode**. Users can toggle with the button in the nav bar.  
Preference is saved to `localStorage`.

---

## 📦 No Build Step Required

This is pure HTML/CSS/JavaScript — no Node.js, no bundler, no dependencies.  
Just push to GitHub and it's live.

---

## 🔗 Domain Setup (reconethereal.com)

### DNS records for Cloudflare Pages:
```
CNAME  @     your-project.pages.dev
CNAME  www   your-project.pages.dev
```

### DNS records for GitHub Pages:
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
CNAME  www   yourusername.github.io
```
