TriMind AI — Complete Figma Design System & Screen Prompt
Design a full, production-ready UI for TriMind AI — an all-in-one super-app for Indian college students combining AI Study Coach, Finance Tracker, and Interview Prep into one unified product. Target user: a 19–22 year old engineering/commerce student in a tier-1 or tier-2 Indian city, using this daily on mobile.

🎨 Visual Identity & Color System
Color palette — "Midnight Ink":

Background primary: #0A0B14 (deep space black)
Background surface: #111320 (dark navy card)
Background elevated: #181B2E (slightly lifted surface)
Accent 1 — Electric Saffron: #FF7A1A (primary CTA, highlights)
Accent 2 — Glacier Teal: #00D4AA (success, study module)
Accent 3 — Violet Pulse: #7B61FF (interview module)
Accent 4 — Rose Ember: #FF4D6D (finance/danger/roast)
Text primary: #F0EEE6 (warm off-white, never pure white)
Text secondary: #8A8FA8 (muted blue-grey)
Text tertiary: #3E4260 (very muted, hints)
Border default: rgba(255,255,255,0.07)
Border hover: rgba(255,255,255,0.14)

Each module has its own accent — Study = Teal #00D4AA, Finance = Saffron #FF7A1A, Interview = Violet #7B61FF. Use these consistently throughout.
Typography:

Display / Hero numbers: Clash Display (bold, heavy weight) — for scores, big stats, screen titles
Headings: Syne (geometric, distinctive) — screen headers, card titles
Body / UI text: Plus Jakarta Sans — readable, modern, slightly warm
Monospace / data: JetBrains Mono — for scores, timers, code-related content
Hindi / Hinglish text: Noto Sans Devanagari — for any Hindi script UI

Design language:

Dark-first, always. Never a white background screen.
Cards use border: 1px solid rgba(255,255,255,0.07) with subtle inner glow on hover: box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1)
Module accent colors appear as left-border strokes, glowing dots, gradient fills at 10–15% opacity for card backgrounds, and full-strength for CTAs/icons
Use grain texture overlay (SVG noise, 3% opacity) on all background surfaces
Micro-details: every number display uses tabular figures; every progress arc is a custom SVG stroke, not a bar
No generic rounded blobs, no purple-gradient-on-white, no glassmorphism clichés
Asymmetric layouts where possible — content doesn't always start at the same X position
All components as published Figma components with variants: Default, Hover, Active, Disabled, Loading, Empty State
8px base grid. Mobile-first at 390×844px. Tablet breakpoint at 768px for dashboard.


📁 SCREEN LIST — Design every screen below in order

SECTION 1 — Onboarding (3 screens)
Screen 1.1 — Goal selector
Full-screen dark. TriMind logo top center (wordmark + minimal triangular icon). Large heading: "What's your mission?" Three oversized tappable cards stacked vertically, each taking ~28% of screen height. Card 1: "Get Placed" (violet accent, briefcase icon). Card 2: "Control My Money" (saffron accent, rupee icon). Card 3: "Crack My Exam" (teal accent, target icon). Each card has a one-line subtitle and a right-arrow. Selected state: card border glows in its accent color with 20% opacity fill.
Screen 1.2 — Exam date picker
Minimal calendar component, current month visible. Below calendar: an AI message card styled like a chat bubble — "I'll build your entire study plan around this date. Pick carefully." Small avatar icon (abstract geometric AI face) left of the bubble. CTA button: "Lock it in →" in teal.
Screen 1.3 — Monthly budget setup
Large ₹ symbol top center. Below: a custom arc slider (semicircular, not a horizontal bar) showing ₹0 to ₹20,000. Selected value displayed in Clash Display 48px center of the arc. Below slider: a mini preview card showing estimated daily budget and "you'll have ₹X/day for food + transport." CTA: "Start TriMind →"

SECTION 2 — Core Navigation & Home
Screen 2.1 — Unified Home Dashboard
Top bar: left — "Good evening, Aditya 👋" in 15px. Right — notification bell + avatar.
Below: TriMind Life Score — a large circular arc dial (270° sweep), number in Clash Display 56px center, "/ 1000" in 16px muted. Label: "Top 18% this week" in teal below.
Three module stat cards in a horizontal scroll row — each 160×100px: Study (teal left-border, "12 topics strong"), Finance (saffron, "₹3,200 left"), Interview (violet, "Score: 74"). Each has a mini sparkline or arc progress.
Daily AI Nudge — full-width card, saffron left-border 3px, dark elevated bg, bold 15px message: "Interview Friday. You've spent 40% of budget. Skip Zomato today and revise OS." Below: two action chips — "Start revision" and "See budget."
Streak counter row: flame icon, "14-day streak", XP bar filling right.
Bottom nav: 5 tabs — Home, Study, Finance, Interview, Profile. Active tab uses module accent underline.

SECTION 3 — AI Study Module (14 screens)
Screen 3.1 — Study Home
Module header in teal. Quick stats row: topics studied, hours logged, current streak. Two primary CTAs: "Start Quiz" and "Study Plan." Below: "Your weak spots" section — horizontal scroll chips of subject names color-coded by weakness level.
Screen 3.2 — Radar / Spider Chart
Full-width hexagonal radar chart. 6 subjects as nodes — OS, DBMS, DSA, CN, Math, OOPS. Each axis glows in teal proportional to score. Weak subjects shown with a pulsing amber dot at their node. Below chart: ranked list of subjects with score bars. Tap any subject → opens subject detail.
Screen 3.3 — Pomodoro + AI Study Planner
Day-by-day schedule in a vertical timeline. Each time block is a card: subject name, duration, Pomodoro count dots (filled/empty circles). Current block highlighted with teal border. Top: exam countdown — "21 days to GATE." Bottom sticky: "Start Session →" CTA.
Screen 3.4 — Explain Like I'm 10
Top: concept input field — "Type any topic." Below: three mode chips: "Simple 🧒", "Medium 📘", "Expert 🧠" — pill-style, teal active state. Result card below: explanation text in readable body size, with an analogy block styled differently (italic, indented teal-left-border). Toggle between modes animates the card content swap.
Screen 3.5 — Smart Notes Summarizer
Upload state: large dashed upload zone, "Drop your PDF or slides here." Processing state: animated teal pulse ring + "Reading your notes…" Post-process: two panels — left: swipeable flashcard stack (card with question front, answer back, swipe gestures labeled), right: "1-Page Summary" collapsed accordion. Bottom: "Generate Quiz →" CTA.
Screen 3.6 — Quiz from YouTube
Input: full-width URL paste field with YouTube icon. Below: "Paste any lecture, documentary, or tutorial link." Processing state: progress bar with steps — Fetching → Transcribing → Generating questions. Result: 5 question cards in a vertical stack, each with 4 MCQ options. Teal for correct reveal, red for wrong.
Screen 3.7 — Daily Micro-Quiz
Clean full-screen quiz UI. Top: "Day 14 🔥" streak badge. Question in large 20px text. Four answer option cards. Bottom: a 5-dot progress indicator for 5 daily questions. Timer ring in top-right corner. After completion: score card with "Come back tomorrow to keep your streak."
Screen 3.8 — Panic Mode
Red-tinted overlay — background shifts to deep crimson #1A0A0A. Top: large countdown timer in JetBrains Mono, red glow. "PANIC MODE" in all-caps Syne, rose ember color. Question cards rapid-fire style — no animations, snap transitions. Progress: "Question 4/10" top right. Urgency is the aesthetic — tight spacing, no padding luxury.
Screen 3.9 — Lecture Recorder
Centered mic button — large circle, teal glow pulsing when active. Below mic: live audio waveform visualization. Timer counting up. "Recording… 2:34" label. Below waveform: three status chips updating in sequence — "Transcribing…", "Summarizing…", "Generating quiz…" — each lights up as it completes. Stop button: square icon, red.
Screen 3.10 — Learning Quest Map
RPG-style top-down map. Topics as hexagonal zone tiles arranged in a branching path. Unlocked zones: full color with topic name and completion %. Locked zones: dark grey with lock icon. Current zone: teal border glow + "You are here" pointer. Boss/hard zones: skull icon, rose ember border. Tap a zone → slides up a zone detail sheet.
Screen 3.11 — Concept Mind Map Generator
Input at top: "Enter any topic." Result: a radial mind map rendered as an interactive diagram. Central node in violet, first-level branches in teal, second-level in amber. Each node is tappable — expands to show sub-topics. "What to study first" order shown via numbered badges on nodes. Export button: "Save as image."
Screen 3.12 — Predict Your Exam Score
Hero: a confidence interval arc — showing range "68–74" in large Clash Display, with a shaded band on the arc showing min–max. Below: "Based on 14 days of your data." Three contributing factors shown as horizontal bars: Quiz accuracy, Study hours, Topic coverage. Motivational AI message: "Close the DBMS gap and you'll hit 76+."
Screen 3.13 — Teach It Back Mode
Top: prompt from AI — "Explain recursion to me like I'm 10." Large text input area below, styled like a notebook (subtle lined background texture). Character count. Submit CTA. Result screen: AI feedback card — green checkmarks for correct concepts covered, red markers for gaps detected. Overall grade badge in top-right: "B+" style school report aesthetic.
Screen 3.14 — Spaced Repetition (Disguised Re-ask)
No UI indicator that it's spaced repetition — looks like a normal quiz question. The question is a disguised version of a previously wrong answer (shown only in admin/demo view with a "🔁 Re-ask" ghost label). Demo screen shows: original wrong answer log (small, faded), and the new disguised question below. Judges-facing: a split screen showing "Original concept → Disguised version."
Screen 3.15 — Debate Mode
Split layout. Top half: AI's argument — bold, assertive text in a violet card. "Arrays are better than linked lists because…" Bottom half: user input area — "Your counter-argument." A verdict bar at the very bottom fills left (AI) or right (User) based on argument strength scored live. Mode label top-center: "⚔️ Debate Mode."
Screen 3.16 — Night Owl / Early Bird Mode
Settings-style screen. Top: a 24-hour arc clock showing user's historical study activity as a heat map on the arc — brighter = more activity. AI insight card: "You study best 9–11 PM. Hard topics scheduled then." Toggle: "Auto-schedule hard topics during peak hours." Below: today's smart schedule adjusted accordingly.
Screen 3.17 — Peer Comparison
Leaderboard-style card. User's rank: "#47 out of 10,000 students." A bell curve graph with user's position marked. Subject-by-subject comparison: horizontal bars showing user vs average. Gamified label: "Beat 9,231 students in DSA." All data labeled "anonymous demo data."

SECTION 4 — Finance Tracker (13 screens)
Screen 4.1 — Finance Home
Module header in saffron. Top: current month balance — large Clash Display number, "₹3,200 left of ₹8,000." Below: real-time donut chart (Food, Transport, Bills, Fun, Other) — each segment in a distinct color, center shows total spent. Tap segment → drills down. Below chart: last 5 transactions list. Bottom CTA strip: "Log Expense" (large) + "Voice Log" (mic icon).
Screen 4.2 — Voice Expense Logger (Hinglish)
Full-screen mic UI. Large animated waveform. Below: live transcription appearing as user speaks — "Aaj 150 rupaye chai pe kharcha kiya" shown in a text bubble. Below transcription: AI-parsed result card — "₹150 · Food & Drinks · Today" with edit option. Confirm button: "Log it ✓" in saffron.
Screen 4.3 — Impulse Buy Detector Modal
Triggered overlay (not full screen — sits on top of log expense screen). Dark card center-screen. Top: "Hold on. 🤔" Header. Savings goal progress bar — "You're 34% behind your ₹10,000 savings goal." The expense just entered shown: "₹700 · Amazon." Two CTAs: "Log it anyway" (ghost button) and "Save it instead" (saffron filled). Subtle animation: goal bar briefly pulses when modal opens.
Screen 4.4 — Savings Goal Tracker
Goal card: item name, target amount, deadline. Large circular progress ring in saffron. Center: "₹4,200 / ₹10,000." Below: "₹198/day needed to hit your goal." Daily log strip: small calendar row showing days where user saved (teal dot) vs overspent (red dot). Motivational AI line: "3 more weeks of this pace and you're there."
Screen 4.5 — Dream Purchase Countdown
Hero image placeholder (user sets item photo) at top, slightly blurred with dark overlay. Item name in 24px Syne. Target: "MacBook Air ₹85,000." Daily save target: "₹472/day." Large horizontal fill bar — current progress. Days remaining badge. Every time an expense is skipped/saved, the bar animates a fill. Confetti micro-animation on milestone reached.
Screen 4.6 — Chai Latte Effect Calculator
Input: "Daily amount" stepper (₹10 increments). Below: three animated cards revealing in sequence as user adjusts — "In 1 year: ₹18,250", "In 4 years of college: ₹73,000", "If invested at 12% for 10 years: ₹1.8 lakh." Each card has a small bar chart. Rose ember color for the largest number. "This is what your daily chai actually costs."
Screen 4.7 — Receipt / Bill Photo Scanner
Camera viewfinder UI with corner bracket guides. "Point at any bill or receipt." Post-scan: split screen — left: photo thumbnail, right: extracted line items in a clean list (item name + amount). Each item has a category chip auto-assigned. "Auto-log all" CTA at bottom in saffron.
Screen 4.8 — UPI SMS Auto-Import
Input area: "Paste your bank SMS messages here." Large text area, monospace font. Below: parsed results shown as a clean transaction list — each SMS converted to: merchant, amount, category, date. Confidence indicator per item (high/medium/low). "Import all 14 transactions →" CTA.
Screen 4.9 — AI Budget Roast Card
Dark card, full-width. Top: "Your weekly roast 🔥" in rose ember. Large italic quote-style text: AI roast message. Example: "You spent ₹1,200 on chai. That's 4 textbooks. A whole semester of knowledge, dissolved in milk." Below: spending stats that triggered the roast. Bottom: "Share this →" CTA — exports as Instagram story card.
Screen 4.10 — Month-End Report Card
Deliberately styled to look like a school report card — serif header, table layout with categories as "subjects," marks out of 100 for each, AI teacher's comment at the bottom. Grading: A (under budget), B (5% over), C (10% over), F (blown). Shareable as PDF. Fun, nostalgic, India-relevant.
Screen 4.11 — Predict End-of-Month Balance
Top: current date progress bar — "Day 12 of 30." Large prediction number: "At this rate: ₹340 left on April 30" in amber if low, teal if healthy. A live line chart below: actual spending curve (solid) vs projected (dashed). "What if" interaction: tap a category → reduce it → watch the end-of-month number update live.
Screen 4.12 — Peer Pressure Savings Wall
Triggered before logging a large expense. Shows 5 anonymous avatar cards: "Student A saved ₹1,200 this month." "Student B saved ₹1,450." Teal checkmarks. Message: "5 students your age saved this amount last month. Want to join them?" Two CTAs: "Join them 💪" / "Log expense anyway."
Screen 4.13 — Campus Canteen Budget Mode
Simplified hostel-specific tracker. Large meal log buttons: "Breakfast ✓", "Lunch ✓", "Dinner" — each tap deducts average canteen cost. Running balance: "₹800 left for 12 days." Warning state: amber when below ₹500. Voice shortcut: "Had dinner" → auto-deducts. Designed for one-tap daily use.

SECTION 5 — Interview Prep (11 screens)
Screen 5.1 — Interview Home
Module header in violet. Top stat row: "Mock interviews done: 7", "Avg score: 68", "Filler words (last session): 12." Two primary CTAs: "Start Mock Interview" and "Practice by Domain." Below: recent sessions list with score trend arrow (up/down). "Your weakest area: System Design" — highlighted in rose ember.
Screen 5.2 — Live AI Interview Simulator
Split layout. Top 60%: AI avatar — abstract geometric face (not realistic — built from SVG shapes, expressive but minimal) with animated mouth/eye states. Question text below avatar in 18px. Bottom 40%: user answer input (text or voice toggle). Real-time keyword chips appear as user types — green chips for strong keywords detected, grey for missing ones. Score ring updates live. "Next question →" CTA.
Screen 5.3 — Simulated Company HR Call
Phone call UI aesthetic — caller ID at top: "Riya · Infosys HR" with a corporate-looking avatar. Call timer. AI-generated voice transcript appearing in real time as subtitles. User answer input below. End of call: screen transitions to debrief — overall score, 3 key feedback points. Judges-facing this is the most cinematic screen.
Screen 5.4 — Before/After Score Demo
Two large semicircle arcs side by side. Left: "Session 1 — Score: 42" in grey. Right: "Session 7 — Score: 74" in violet glow. Delta badge between them: "+32 pts." Timeline below showing all sessions as a line chart with upward trend. AI label: "You've improved most in: Answer structure."
Screen 5.5 — Domain Selector
Grid of domain cards — CS, Marketing, Finance, HR, Product, Data Science. Each card: icon, domain name, "X questions available," difficulty indicator dots. Selected: violet border glow. Sub-selector after domain pick: "Technical Round" / "HR Round" / "Case Study" — pill chips.
Screen 5.6 — Filler Word Detector
Post-session screen. Bold headline: "You said 'um' 14 times." Bar chart: um, like, basically, so, right — each bar in a different accent. Overall fluency score ring: 63/100 in violet. Three tips from AI below. Comparison: "Average TriMind user: 6 filler words." Share button: exports as a roast-style card.
Screen 5.7 — STAR Method Coach
Vertical accordion layout. Four sections: Situation, Task, Action, Result — each an expandable card. Collapsed: just label + status dot (complete/incomplete). Expanded: AI coaching text + user input field. Progress: "2/4 sections strong." At the bottom: "Compile my STAR answer →" assembles all four into a final polished answer card.
Screen 5.8 — Bullshit Detector
After user submits an answer, a brief "Analyzing…" animation. Then: AI verdict card — green "Strong answer ✓" or amber "Too vague ⚠️". If vague: the exact vague phrase is highlighted in the user's answer text with an underline. Below: AI follow-up question in a different card style — more assertive tone, violet border. Forces the user to go deeper.
Screen 5.9 — Teach It Back Mode (Interview variant)
AI prompt: "Explain your last project to me like I've never heard of it." Large input. After submission: AI grades on 4 dimensions — Clarity, Depth, Structure, Confidence — each shown as a small score bar. Overall: letter grade. Gap highlight: "You didn't mention the tech stack — interviewers always ask."
Screen 5.10 — AI Salary Negotiation Coach
Chat-style UI. AI plays HR on the left (violet bubble). User on right (off-white bubble). Below each AI message: a "coaching whisper" — small italic text in amber: "Counter with: 'Based on market rate for this role, I was expecting 6.5 LPA.'" Negotiation stage tracker at top: Offer → Counter → Justify → Close. Cinematic and unique.
Screen 5.11 — Interview Mirror Mode
Split screen: left — webcam feed (placeholder rectangle with "Camera" label). Right — live confidence score bar updating. Below webcam: real-time annotations: "Eye contact: 3 breaks", "Speaking pace: Fast", "Filler words: 4." Overall confidence ring. End-session: downloadable PDF report. Dark, focused aesthetic — feels like a professional tool.

SECTION 6 — Gamification & Social (8 screens)
Screen 6.1 — Achievement Badge Shelf
Grid layout 4×3. Each badge: custom icon, name, unlock condition shown on hover/tap. Earned badges: full color with subtle glow. Locked: dark grey silhouette with "Locked" label. Featured badges: "7-Day Streak 🔥", "Budget Master 💰", "Interview Ace 🎯", "Night Owl Scholar 🌙", "Iron Stomach 💪" (no Zomato for 7 days). Tap earned badge → shows when you earned it and a share CTA.
Screen 6.2 — Daily 60-Second Blitz
Full-screen adrenaline UI. Large circular countdown timer center — red glow, JetBrains Mono 72px. "Question 4 of 10" top. MCQ options as four tall cards below — tap to answer, instant next question. Score counter top-right. Streak badge if continuing from yesterday. Post-blitz: "Score: 8/10 — 2.4s avg" with leaderboard position.
Screen 6.3 — XP & Streak System
Profile-style screen. Large XP number and current level: "Level 12 — Focused Scholar." XP progress bar to next level. Weekly activity heatmap (7-day GitHub-style grid). Breakdown: Study XP, Finance XP, Interview XP — three mini bars. Recent XP gains listed: "+50 XP — Completed quiz", "+30 XP — Logged expenses."
Screen 6.4 — Save ₹ = Unlock Features
Reward wall screen. Three locked premium features shown as blurred/locked cards: "Advanced Interview Analytics," "Unlimited Mock Calls," "Expert Study Roadmap." Below each: unlock condition — "Stay under budget for 7 days." Progress tracker: "Day 4 of 7 ✓✓✓✓○○○." When unlocked: card reveals with confetti animation.
Screen 6.5 — College-Wide Leaderboard
Ranked list. Top 3 in podium style. User's row highlighted: "You — #23 at GLA University." Filter chips: "This week / This month / All time" and "DSA / DBMS / Overall." Anonymous names (Student A, B…). Motivational: "Move up 3 spots to enter Top 20." Tap own row → see subject breakdown.
Screen 6.6 — Friend vs Friend Challenge
Shareable quiz challenge UI. Top: "You vs Rahul — Data Structures." Two avatar columns with live scores updating. Final screen: winner crown animation, score comparison, "Rematch?" CTA. Share card version: scoreboard formatted as a shareable image card.
Screen 6.7 — Study Group AI Facilitator
Group setup screen: add 3–5 friends by TriMind username. AI assignment screen: each member shown with their assigned subtopic chip. Group quiz screen: shared question shown, each member's answer status shown as avatar dots (answered = teal, pending = grey). Post-session: "Rohan taught the group recursion best — 94% accuracy."
Screen 6.8 — Interview Experience Feed
Community feed, card-based. Each card: "Aditya shared questions from his TCS mock session." Expandable to see question list. Like + save. Filter by company, domain, difficulty. Submit CTA: "Share your questions →" after completing a mock interview. Crowdsourced, grows with usage.

SECTION 7 — AI Intelligence Screens (5 screens)
Screen 7.1 — Cross-Module AI Memory (Unified Intelligence)
Full-width feature card — this is the "AI knows your full story" moment. Card shows: "Based on everything I know about you:" followed by 3 bullets using data from all modules — "Interview on Friday (Interview module)", "Budget 40% overspent (Finance)", "OS is your weakest topic (Study)." Then: AI recommendation below synthesizing all three. The key demo moment.
Screen 7.2 — Context-Aware Daily Nudge (Full Screen)
Morning push notification expanded view. Date and time top. AI avatar small icon. Nudge message in large 20px type — personal, specific, cross-module. Below: two action cards — "Do this now" and "Remind me later." Personalization shown: "Why this nudge? You haven't studied OS in 3 days and your interview is Friday."
Screen 7.3 — Job Description Analyzer
Paste area: "Paste any job posting." Processing → extracted skills appear as chips: "SQL," "System Design," "Python," "Communication" — color coded: green (you're strong), amber (partial), red (weak). Below: "Your 7-day prep plan for this role" — auto-generated schedule. "Which company?" input: "Infosys" → adjusts question bank.
Screen 7.4 — Resume Gap Detector
Upload resume (PDF). Target company input: "Google." Processing: side-by-side comparison — "Your skills" vs "Google JD requirements" — each skill mapped and gap-highlighted. Gap score: "You're 62% ready for this role." Below: auto-enrolled 30-day study plan. Moonshot feature — design it as premium/pro-tier with a subtle gold border.
Screen 7.5 — Auto Difficulty Adapter
Quiz screen with a visible "Difficulty Level" indicator bar at top — shifts left (easy) or right (hard) based on performance in real time. Gets 3 right → bar moves right, question visually becomes more complex (more text, nested logic). Gets 2 wrong → bar moves left + AI explains concept. The bar movement is the key visual.

SECTION 8 — Scale / B2B / Bharat Screens (4 screens)
Screen 8.1 — College Partnership Dashboard
Tablet-landscape layout (this is a B2B screen for placement cells). Top: "GLA University — Batch 2025" header. Key stats in metric cards: "Avg TriMind Score: 61", "67% weak in DBMS", "Placement readiness: 54%." Bar chart: subject-wise weakness distribution. Student cohort list (anonymized). "Export PDF report" CTA. This is the revenue screen — design it to look trustworthy and institutional.
Screen 8.2 — Company-Sponsored Mock Interview
Branded mock session screen. Top banner: "TCS NQT Practice Round — Powered by TCS" with TCS logo placeholder. Below: 15 questions, official difficulty level badge. Session stats post-completion: "How you'd rank in TCS NQT based on this session." Both sides benefit — real branding element.
Screen 8.3 — Offline Mode / PWA Screen
Status bar shows "Offline 📴." App still functional — cached questions available, expense logging works locally. Offline indicator: small amber chip in header "Working offline." Syncing animation when connection restored: "Syncing 3 items…" This screen conveys "Built for Bharat" — design it to feel lightweight and accessible, not premium.
Screen 8.4 — Alumni Mentor Matching
Target company input: "Microsoft." AI match result: profile card — "Rohan Sharma, GLA Alumnus 2022, Software Engineer at Microsoft." Avatar, company badge, a brief note. Two CTAs: "Request 15-min call" and "Message Rohan." Match logic shown: "Matched because: same college, same branch, same target role." Warm, human-feeling screen.
Screen 8.5 — Parent Dashboard (Read-Only)
Simplified, accessible version of the dashboard — lighter, more readable, less gamified. Weekly digest card: "Aditya this week — Studied 18 hours, spent ₹3,200, ranked #12 at college." Three simple stat pills. A "Share with parents" CTA that generates a clean PDF or WhatsApp-shareable card. Tone: reassuring, not alarming.

SECTION 9 — Shareable Output Cards (5 designs)
Design all in 1080×1920px (9:16 Instagram story format) AND 1080×1080px (square post format).
Card 9.1 — Budget Roast Card
Deep black bg. Rose ember accents. TriMind logo top. AI roast quote in large italic type center. Spending stat that triggered roast below. "Generated by TriMind AI" footer. Feels like a meme but premium.
Card 9.2 — Study Report Card
School report card aesthetic — off-white/cream background (the ONE light-mode design in the entire system). Lined paper texture. Subject scores in a table. Radar chart thumbnail. AI "teacher's comment" at bottom in handwriting-style font. TriMind stamp/seal in corner.
Card 9.3 — TriMind Life Score Share Card
Dark bg. Score number huge center in Clash Display. "712 / 1000" with rank percentile. Three sub-scores below. "Share your score" CTA. Subtle animated gradient border (design static version with gradient border as accent).
Card 9.4 — Placement Readiness Card
"I'm interview-ready 🎯" shareable moment. Score ring, module breakdown, AI verdict. Clean, brag-worthy.
Card 9.5 — Friend Challenge Result Card
Scoreboard style. Two names, two scores, winner crown. "Challenge me on TriMind AI" CTA at bottom. QR code placeholder bottom-right.

SECTION 10 — Design System Reference Frame
One dedicated Figma frame containing:

Full color palette swatches with hex codes and usage rules
Typography scale: all sizes, weights, use cases
Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
All component variants: buttons (primary, secondary, ghost, danger), input fields, chips/pills, badges, progress rings, cards (default, elevated, module-tinted), avatars, bottom sheets
Icon style guide: 24px, 2px stroke, rounded ends, consistent optical weight
Module color system: Study=Teal, Finance=Saffron, Interview=Violet — with tinted card bg rules
Animation principles: 200ms ease-out for micro-interactions, 350ms spring for screen transitions, 500ms for score number reveals
Empty state designs for every major screen
Error state designs for key flows
Loading skeleton designs for data-heavy screens


Final instruction: Every screen must feel like it was designed by someone who uses this app every single day — opinionated, lived-in, with micro-copy that sounds like a sharp Indian friend, not a corporate chatbot. No screen should feel like a template. Every layout should have at least one moment of surprise — an unexpected typographic scale jump, an asymmetric grid break, or a data visualization that does something you haven't seen in a student app before.