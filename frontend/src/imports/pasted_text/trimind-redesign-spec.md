TriMind AI — Complete Redesign: Professional Light SaaS + All New Features
Context: I have an existing React web app with these pages already built: Onboarding, Home Dashboard, Study Dashboard, Finance Dashboard, Interview Dashboard, and Profile. The current design is dark-themed. I need you to completely redesign it as a professional light SaaS product — like Linear, Notion, or Vercel's dashboard — but with a distinctive, non-generic color identity. Keep the exact same page structure and sidebar navigation, but redesign every screen from scratch in the light theme with all the new features added.

🎨 Color System — "Chalk & Ink"
This is a warm-white light SaaS, not a cold clinical white. Think premium Indian fintech meets Linear.app.

Page background: #F7F6F2 (warm off-white, like good paper — NOT pure white)
Card background: #FFFFFF with box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
Sidebar background: #1A1D2E (the ONE dark element — deep ink navy, keeps premium feel)
Sidebar text: #E8E6DF active, #6B7080 inactive
Border default: #E8E6DF (warm grey, never cold blue-grey)
Text primary: #141417 (near-black, warm)
Text secondary: #6B6B78
Text tertiary: #A8A8B3

Module accent colors — bold, saturated, used sparingly:

Study module: #0EA882 (deep emerald green — NOT mint, NOT teal)
Finance module: #E8620A (burnt sienna orange — NOT yellow-orange)
Interview module: #5B47E0 (deep indigo — NOT purple, NOT violet)
Danger / alert: #D93B3B
Success: #16A34A

Each accent appears as: left-border on active nav item, icon color, CTA button, top-border on stat cards, chart fills. Everywhere else is neutral.
Typography:

Display / large numbers: Instrument Serif or Fraunces — warm, editorial, distinctive
UI headings: Geist or DM Sans — clean, modern, professional
Body text: Inter — readable at small sizes
Monospace / scores / timers: JetBrains Mono

Design rules:

Cards: border-radius: 12px, 1px solid #E8E6DF, subtle drop shadow. No glows, no blur effects.
All charts use the module accent color as primary fill with 15% opacity for fills, full color for strokes
Spacing: 8px grid. Generous padding inside cards (20–24px)
Tables and lists: alternating row bg #F7F6F2 / #FFFFFF
Hover states: background: #F0EFF8 (very faint indigo tint) — same across all modules
Active/selected: module accent at 8% opacity background + accent left border
No gradients anywhere except the TriMind score arc (keeps it special)
Every empty state must be designed — use a small editorial illustration placeholder + message


🏗 Global Layout (Desktop Web App — 1440px)
Sidebar — 240px fixed left, full height:

Background: #1A1D2E (dark ink — the contrast anchor of the whole design)
Top: TriMind logo — a minimal geometric triangular mark + "TriMind" wordmark in Geist Bold, white
Below logo: navigation links with icons — Home, Study, Finance, Interview, Profile
Active item: 3px left border in module accent, background: rgba(255,255,255,0.06)
Inactive: muted text, no border
Bottom: user avatar + name + plan badge ("Pro")
Sidebar does NOT collapse on desktop. On tablet (768px): icon-only (56px wide). On mobile: drawer.

Main content area:

Background: #F7F6F2
Top bar inside content: breadcrumb left ("Home / Study"), notification bell + avatar right
Page title: 28px, Geist Medium, #141417
Content max-width: 1160px, centered in remaining space
Section spacing: 32px between major sections


REDESIGN EXISTING SCREENS

Screen 1 — Onboarding (3 steps, full-screen, NO sidebar)
Full white background for onboarding — clean, focused, no distractions.
Step 1 — Goal selector:
Center-aligned. TriMind logo top center. Large heading: "What brings you here?" in Fraunces 36px. Subtext: "We'll personalise everything from your answer." Three cards in a row (not stacked) — each 280px wide, 180px tall. Card 1: emerald left-border, graduation cap icon, "Get Placed." Card 2: orange left-border, rupee icon, "Control My Money." Card 3: indigo left-border, mic icon, "Crack My Exam." Selected state: border becomes 2px solid accent, 8% accent background tint. "Continue →" button bottom center, appears after selection.
Step 2 — Exam date:
Clean calendar component, warm white card center-screen. Below: AI message in a soft #F0EFF8 inset box with indigo left border — "I'll map your study plan backwards from this date." CTA: "Set my date →"
Step 3 — Budget setup:
Large ₹ symbol in Fraunces. Arc-style slider or large number input. Mini preview card: "That's ₹267/day for everything." Progress dots (3 steps) visible throughout onboarding. Final CTA: "Launch TriMind →" in deep indigo filled button.

Screen 2 — Home Dashboard (redesign existing)
Top bar: "Good morning, Aditya" in 28px. Date right-aligned. Notification bell + avatar.
TriMind Life Score — hero section:
Large arc gauge, but now on a WHITE card centered, with a warm shadow. Track background: #E8E6DF. Fill: three-stop gradient — emerald → indigo → orange (keeps the signature look but now on light bg). Score number in Fraunces 72px, #141417. "712 / 1000" below. "Top 18% this week" badge in emerald.
Three module stat cards — 3-column grid:
Each card: white bg, top border 3px solid [module accent], icon top-left in accent color, stat number in 32px Fraunces, label below in 12px secondary text, mini sparkline bottom-right. Cards are equal width, gap: 20px.
Daily AI Nudge card — full width:
White card, 3px left border in orange. Left: small robot/brain icon in orange circle. Right: nudge text in 15px — "Interview Friday. Spent 40% of budget. Skip Zomato today and revise OS." Two action chips below: "Start revision" (emerald filled) and "See budget" (ghost).
Streak + XP row:
White card, flame icon in orange, "14-Day Streak", XP progress bar in orange fill. Level badge "Lvl 12" right-aligned in JetBrains Mono.
Quick actions row:
Four equal cards: "Start Quiz", "Log Expense", "Mock Interview", "View Goals" — each with icon, label, arrow. Hover: faint indigo tint background.

Screen 3 — Study Dashboard (redesign + add features)
Top stat row — 4 cards:
Topics Studied (14), Hours Logged (38h), Current Streak (12d), Avg Quiz Score (74%). All white cards with emerald top border.
Main content — 2-column layout:
Left column (60%):

Skills Radar chart — same 6 subjects (OS, DBMS, DSA, CN, Math, OOPS). Chart background white card. Grid lines: #E8E6DF. Radar fill: emerald at 15% opacity. Radar stroke: #0EA882 2px. Axis labels: #6B6B78.
Below radar: "Weak topics" — 3 pill chips in amber/danger color: "CN — 55%", "OS — 65%", "Math — 75%"

Right column (40%):

Today's Study Plan — vertical timeline. Each block: subject + duration + Pomodoro dots. Current block: emerald left-border highlight. "Start Session →" CTA emerald button.
Exam countdown card: "GATE 2026 — 21 days" in large Fraunces number, countdown in mono.

New features to add as cards below main section:
"Concept Mind Map Generator" card — input field "Enter any topic" + "Generate Map →" button. Show a sample static mind map visual inside the card with emerald nodes.
"Predict My Exam Score" card — shows confidence arc (same style as life score but smaller), "Based on 14 days of data — you'll score 68–74 in DBMS." Sub-bars for Quiz accuracy, Study hours, Topic coverage.
"Debate Mode" card — shows last debate topic, score ("You won 2/3 debates this week"), "Start Debate →" CTA.
"Teach It Back Mode" card — prompt from AI, input field, "Submit explanation →". Show last grade: "B+ — Good structure, missed base case."
"Panic Mode" button — full-width red-bordered card with clock icon. "Exam soon? Generate 10 rapid-fire questions now." Danger red CTA.
"Night Owl / Early Bird" insight card — shows activity heatmap arc, "You study best 9–11 PM." Toggle: "Auto-schedule hard topics during peak hours."

Screen 4 — Finance Dashboard (redesign + add features)
Top stat row — 3 cards:
"₹3,200 left" (orange top border), "₹4,800 spent" (neutral), "Savings rate: 18%" (emerald).
Main content — 2-column layout:
Left column:

Donut chart — white card, clean. Segments: Food (orange), Transport (red), Bills (emerald), Fun (indigo), Other (grey). Center: "₹4,800 spent." Custom HTML legend below — colored squares + category + amount in a 2-column list.
Below: last 5 transactions list — icon, merchant name, category chip, amount, date. Alternating row backgrounds.

Right column:

"Log Expense" card — large mic button (orange circle, mic icon white) + "Voice Log" label. Below: text input alternative. Quick category buttons: Food, Transport, Fun, Bills.
Month-end prediction card: "At this rate — ₹340 left on April 30." Line chart: actual (solid) vs projected (dashed). Small "What if" section: reduce Food by 20% → see updated number.
Savings goal progress: goal name, progress ring in orange, "₹4,200 / ₹10,000", daily target "₹198/day needed."

New feature cards below:
"Impulse Buy Detector" — shows last triggered alert: "₹700 Amazon — You were 34% behind savings goal." Toggle: "Enable impulse alerts."
"Dream Purchase Countdown" — item name, image placeholder, fill bar in orange, days remaining, daily save target.
"Chai Latte Effect Calculator" — input: daily amount. Output: 3 cards — 1yr, 4yr, 10yr impact. Small bar chart. Most impactful number in danger red.
"Peer Expense Benchmark" — anonymous comparison: "Average student at your college type spends ₹4,200/month on food. You spend ₹6,800." Bar comparison chart.
"AI Budget Roast" — dark card (the ONE dark element on this page for contrast), orange accent, roast quote in italic serif. "Generate this week's roast →" CTA.
"UPI SMS Auto-Import" — paste area, monospace font, "Paste bank SMS messages → AI parses and logs them." Parsed result preview.
"Campus Canteen Mode" — three meal buttons: Breakfast ✓, Lunch ✓, Dinner (pending). Running balance: "₹800 left for 12 days."

Screen 5 — Interview Dashboard (redesign + add features)
Top stat row — 4 cards:
Mock Interviews Done (7), Avg Score (68), Filler Words Last Session (12), Best Domain (DSA — 84%).
Main content — 2-column layout:
Left column — AI Interview Simulator:

White card, full height. AI avatar centered — same geometric hexagon design but now on white bg with indigo fill, soft drop shadow.
Question text below avatar in 18px.
"Live Session" badge top-right in indigo.
Bottom: text input + mic toggle button. Real-time keyword chips appear as user types — emerald chip for matched keywords, grey for unmatched.
Score ring updates live, bottom-right.

Right column:

Domain selector: grid of 6 domain cards — CS, HR, Finance, Marketing, Product, Data Science. Each tappable, indigo border when selected.
HR vs Technical toggle — pill switch.
STAR Method coach card — 4 accordion sections: Situation, Task, Action, Result. Progress: "2/4 complete."
Before/After score: two arc gauges side by side — "Session 1: 42" grey vs "Session 7: 74" indigo.

New feature cards below:
"Filler Word Detector" — post-session card. Bar chart: um (14), like (8), basically (5), so (11). Fluency score ring 63/100 indigo. "Average user: 6 filler words."
"Bullshit Detector" — card showing last AI challenge: user's vague answer highlighted in amber underline, AI follow-up below in indigo card.
"Salary Negotiation Coach" — chat-style mini preview. HR bubble left, user bubble right, "coaching whisper" in amber below HR messages. Stage tracker: Offer → Counter → Justify → Close.
"Job Description Analyzer" — paste area, "Paste any JD →", extracted skills shown as chips (green = strong, amber = partial, red = weak). "Generate 7-day prep plan →" CTA.
"Interview Mirror Mode" — webcam placeholder rectangle, confidence score bar updating, annotation chips: "Eye contact: 3 breaks", "Pace: Fast."
"Live Company Call Simulation" — indigo card, phone icon, "Simulate an Infosys HR call." "Start Call →" indigo button. Last call result: "Call with Riya · Infosys HR · Score: 71."

Screen 6 — Profile Dashboard (redesign + add features)
Profile header — white card, full width:
Avatar left (large, 96px circle). Right: name in 28px Fraunces, role "B.Tech CSE · GLA University", plan badge "Pro Plan" in indigo. XP progress bar below name — "3,450 / 5,000 XP to Level 13." Level badge in orange circle.
Three-column stats below header:
Study hours this month, Total interviews, Savings this month. White cards, accent top borders.
Activity heatmap — full width white card:
52-week GitHub-style contribution grid. Four intensity levels using emerald shades from #D1FAE5 (lightest) to #0EA882 (darkest). Month labels above. "364 days of activity" label.
Achievement badge shelf — white card:
4×2 grid. Earned badges: full color with soft shadow. Locked: #F7F6F2 background, grey icon, "Locked" label. Badge names: "7-Day Streak", "Budget Master", "Interview Ace", "Night Owl Scholar", "Iron Stomach", "Quiz Champion", "Debate King", "Savings Hero."
TriMind Life Score breakdown — white card:
Three horizontal progress bars — Academic (74), Financial (61), Interview (81). Overall score ring 712/1000 right side. "Top 18% this week" label.
New feature sections:
"My Goals" card — active goals listed: exam date countdown, savings goal progress, interview target score. Add goal CTA.
"Internship Readiness Certificate" — preview card of a certificate design. "30-day program complete." Download PDF CTA in indigo.
"Resume Gap Detector" — upload resume CTA, target company input: "Google." Last analysis result: "62% ready — 3 skill gaps identified." View full report link.
"Parent Dashboard Share" — generate weekly digest card. Preview: "Aditya studied 18 hrs, spent ₹3,200, ranked #12." "Share with parents →" WhatsApp green button.

NEW SCREENS TO ADD

Screen 7 — Gamification Hub (new page, add to sidebar)
Icon: trophy. Sidebar label: "Rewards."
Top: TriMind Life Score hero — large white card, arc gauge, 712/1000, three sub-bars, "Share Score →" CTA.
Daily 60-second Blitz — white card with orange accent. Countdown ring (not ticking — static preview), "10 questions · 60 seconds · Streak: 14." "Start Blitz →" orange CTA. Leaderboard mini-preview: top 3 friends.
Learning Quest Map — large white card. Top-down grid of topic hexagons — color-coded: completed (emerald), current (indigo border), locked (grey). Topic name + completion % inside each hex. "Your next zone: Graphs & Trees."
Achievement wall — full badge grid with earned/locked states.
College Leaderboard — ranked list. Top 3 in podium card. User's row highlighted indigo. Anonymous names. Filter: "This week / This month / DSA / Overall."
Save ₹ = Unlock Features — three premium feature cards, blurred/locked, "Stay under budget 7 days to unlock." Progress: "Day 4 of 7."
Friend vs Friend Challenge — "Challenge a friend" input. Last challenge result card: two scores side by side, winner crown.

Screen 8 — AI Tools (new page, add to sidebar)
Icon: sparkle/wand. Sidebar label: "AI Tools."
Grid of AI tool cards — each white card with icon, title, description, and "Open →" CTA:

WhatsApp Chat Parser — "Paste group chat → AI detects exam dates → builds study plan"
Lecture Recorder — mic icon, "Record 10 mins → get notes + quiz instantly"
Smart Notes Summarizer — "Upload PDF → flashcards + 1-page summary"
Resume Gap Detector — "Upload resume + target company → 30-day roadmap"
Mood-Adaptive Session — "Tell AI how you feel → session adjusts automatically"
Spaced Repetition Engine — "AI re-asks your wrong answers in disguise 3 days later"
CGPA to Package Estimator — "Enter CGPA + college tier → likely package range"
Scholarship Radar — "Based on your profile → find scholarships you qualify for"
Sleep & Study Correlation — "Log sleep → AI shows your peak performance pattern"
Roast My Resume — "Upload resume → get savage + actionable AI feedback"
Monthly Wrap — "Spotify-style monthly recap → shareable story card"
Student Twin Match — "Find another student with same goals + gaps as you"

Each card: white, 1px border, module-relevant accent icon color, 12px description, arrow CTA. Hover: faint indigo tint.

Screen 9 — Shareable Cards (new page or modal)
Sidebar label: "Share." Icon: upload/share.
Four card previews in 2×2 grid, each at Instagram story proportions (cropped preview):

Budget Roast Card — dark card (intentional contrast), orange roast text
Study Report Card — school report aesthetic, cream background, radar chart
TriMind Life Score Card — clean white, score large center, share CTA
Monthly Wrap Card — summary stats, colorful mini charts

"Download PNG" and "Share to WhatsApp" CTA below each.

DESIGN SYSTEM REFERENCE FRAME
One dedicated frame:

Color swatches: all hex values labeled
Typography scale: Fraunces display, Geist headings, Inter body, JetBrains Mono — all sizes and weights
Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px with labels
Component library: buttons (primary in each module accent, secondary, ghost, danger), input fields, chips, badges, progress bars, arc gauges, cards (default, accent-top, accent-left), avatars, stat cards, empty states, loading skeletons
Module color guide: Study=Emerald #0EA882, Finance=Orange #E8620A, Interview=Indigo #5B47E0 — tinted backgrounds, border usage, chart fills
Icon style: Lucide icons, 20px, 1.5px stroke
Sidebar dark + content light contrast system documented


The one non-negotiable rule across every screen: Every page should feel like it was designed by a team that ships real SaaS products — not a student project, not an AI-generated template. The warm off-white background, the dark ink sidebar, the editorial serif for numbers, and the module-specific accents used sparingly are what make this feel premium without being cold. Every chart, every empty state, every micro-copy line should look like someone made a deliberate choice about it.