export type Coach = {
  id: string;
  name: string;
  initials: string;
  sport: string;
  level: string;
  area: string;
  distance: number;
  price: number;
  rating: number;
  reviews: number;
  match: number;
  verified: boolean;
  instant: boolean;
  sessions: number;
  response: string;
  retention: string;
  headline: string;
  bio: string;
  bestFor: string;
  firstSession: string;
  photos: string[];
  colors: [string, string, string];
  philosophy: string;
  reviewList: string[];
};

export type Settings = {
  name: string;
  age: string;
  city: string;
  skill: string;
  bio: string;
  radius: number;
  budget: number;
  sports: string[];
  verifiedOnly: boolean;
  instantOnly: boolean;
  discoverable: boolean;
  notifications: boolean;
  dark: boolean;
  parentMode: boolean;
  haptics: boolean;
};

export type Booking = {
  id: number;
  coach: string;
  sport: string;
  time: string;
  duration: string;
  price: number;
  status: string;
};

export type Message = { from: "me" | "them"; text: string };

export const SPORTS: [string, string][] = [
  ["Basketball", "🏀"], ["Soccer", "⚽"], ["Football", "🏈"], ["Baseball", "⚾"],
  ["Softball", "🥎"], ["Volleyball", "🏐"], ["Swimming", "🏊"], ["Tennis", "🎾"],
  ["Track", "🏃"], ["Golf", "⛳"], ["Wrestling", "🤼"], ["Lacrosse", "🥍"],
];

export const SPORT_EMOJI: Record<string, string> = Object.fromEntries(SPORTS);
export const COMMON_SPORTS = SPORTS.slice(0, 8).map(([s]) => s);
export const ALL_SPORTS = SPORTS.map(([s]) => s);
export const DURATIONS = ["30 min", "1 hour", "1.5 hours", "2 hours"];
export const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:30 PM", "4:00 PM", "6:30 PM"];

export const DEFAULT_SETTINGS: Settings = {
  name: "Demo Player", age: "14", city: "Bellevue", skill: "Intermediate",
  bio: "Trying to improve confidence, footwork, and game IQ.",
  radius: 10, budget: 65, sports: [], verifiedOnly: false,
  instantOnly: false, discoverable: true, notifications: true,
  dark: true, parentMode: true, haptics: true,
};

export const COACHES: Coach[] = [
  {
    id: "jake", name: "Jake R.", initials: "JR", sport: "Basketball", level: "College Guard",
    area: "Bellevue", distance: 2.1, price: 60, rating: 4.9, reviews: 47, match: 98,
    verified: true, instant: true, sessions: 100, response: "5.0", retention: "92%",
    headline: "Build confidence, handles, and a cleaner jumper.",
    bio: "Former college player focused on skill, confidence, and game speed training for younger athletes.",
    bestFor: "Shooting, ball handling, finishing",
    firstSession: "Form check, handles, footwork, and a simple homework drill",
    photos: ["Training", "Shooting", "Finishing"],
    colors: ["#08111f", "#0f4fbf", "#f97316"],
    philosophy: "Confidence first. Skills second. Pressure makes both matter.",
    reviewList: ["My son became way more confident after 2 sessions.", "Actually explains things in a way younger kids understand."],
  },
  {
    id: "sarah", name: "Sarah K.", initials: "SK", sport: "Soccer", level: "College Club Player",
    area: "Kirkland", distance: 3.3, price: 45, rating: 4.8, reviews: 31, match: 95,
    verified: true, instant: false, sessions: 68, response: "4.9", retention: "88%",
    headline: "First touch, passing, and calm finishing.",
    bio: "Technical soccer coach for young players who need better control, field vision, and confidence.",
    bestFor: "First touch, passing, finishing",
    firstSession: "Touches, passing rhythm, body position, and finishing reps",
    photos: ["First Touch", "Passing", "Finishing"],
    colors: ["#052e16", "#16a34a", "#bef264"],
    philosophy: "Small habits create elite players.",
    reviewList: ["Super patient and encouraging.", "My daughter loved training with her."],
  },
  {
    id: "mason", name: "Mason T.", initials: "MT", sport: "Football", level: "Varsity Starter",
    area: "Redmond", distance: 5.7, price: 55, rating: 4.8, reviews: 22, match: 91,
    verified: false, instant: true, sessions: 52, response: "4.7", retention: "83%",
    headline: "Routes, speed, hands, and sharper cuts.",
    bio: "Football trainer for receivers and defensive backs focused on explosive movement and clean technique.",
    bestFor: "Routes, footwork, catching",
    firstSession: "Warmup, route tree, release work, catching under pressure",
    photos: ["Routes", "Speed", "Hands"],
    colors: ["#111827", "#991b1b", "#f59e0b"],
    philosophy: "Train fast so games feel slow.",
    reviewList: ["Really good energy and drills.", "My kid finally understands route running."],
  },
  {
    id: "ava", name: "Ava R.", initials: "AR", sport: "Volleyball", level: "Varsity Captain",
    area: "Bellevue", distance: 1.8, price: 40, rating: 4.7, reviews: 18, match: 93,
    verified: true, instant: false, sessions: 44, response: "4.9", retention: "90%",
    headline: "Serving, passing, and confident basics.",
    bio: "Volleyball coach for middle school and junior varsity players building clean fundamentals.",
    bestFor: "Serving, passing, movement",
    firstSession: "Platform passing, serving form, movement and confidence reps",
    photos: ["Serving", "Passing", "Confidence"],
    colors: ["#4c1d95", "#7c3aed", "#f472b6"],
    philosophy: "Confidence changes everything in volleyball.",
    reviewList: ["Helped my daughter love volleyball again.", "Very kind and professional."],
  },
  {
    id: "leo", name: "Leo P.", initials: "LP", sport: "Soccer", level: "Varsity Midfielder",
    area: "Bellevue", distance: 4.2, price: 42, rating: 4.8, reviews: 26, match: 94,
    verified: true, instant: true, sessions: 75, response: "4.8", retention: "87%",
    headline: "Fun drills, sharper touches, smarter decisions.",
    bio: "Soccer coach for younger players who want cleaner dribbling and better awareness.",
    bestFor: "Dribbling, scanning, quick decisions",
    firstSession: "Ball mastery, scanning habits, confidence finishers",
    photos: ["Dribbling", "Vision", "Finishing"],
    colors: ["#052e16", "#15803d", "#22c55e"],
    philosophy: "Play smart, then play fast.",
    reviewList: ["Very motivating coach.", "Made practice actually fun."],
  },
  {
    id: "nolan", name: "Nolan B.", initials: "NB", sport: "Basketball", level: "Former AAU Player",
    area: "Mercer Island", distance: 6.1, price: 65, rating: 5.0, reviews: 58, match: 96,
    verified: true, instant: true, sessions: 120, response: "5.0", retention: "94%",
    headline: "Game-speed training for guards and wings.",
    bio: "High intensity basketball sessions focused on confidence and scoring.",
    bestFor: "Scoring, footwork, confidence",
    firstSession: "Ball control, shooting form, live reads",
    photos: ["Handles", "Footwork", "Scoring"],
    colors: ["#111827", "#2563eb", "#38bdf8"],
    philosophy: "Confidence creates killers.",
    reviewList: ["Best trainer we've had.", "My son improved insanely fast."],
  },
  {
    id: "emma", name: "Emma L.", initials: "EL", sport: "Swimming", level: "State Swimmer",
    area: "Bellevue", distance: 2.9, price: 50, rating: 4.9, reviews: 35, match: 92,
    verified: true, instant: false, sessions: 63, response: "4.9", retention: "91%",
    headline: "Technique, breathing, and race confidence.",
    bio: "Swim coach helping younger athletes improve technique and comfort in the water.",
    bestFor: "Freestyle, breathing, endurance",
    firstSession: "Stroke check and pacing drills",
    photos: ["Freestyle", "Starts", "Turns"],
    colors: ["#082f49", "#0284c7", "#67e8f9"],
    philosophy: "Relaxed swimmers are faster swimmers.",
    reviewList: ["Very patient teacher.", "Great with nervous swimmers."],
  },
  {
    id: "ryan", name: "Ryan C.", initials: "RC", sport: "Baseball", level: "JUCO Catcher",
    area: "Sammamish", distance: 7.4, price: 48, rating: 4.8, reviews: 29, match: 89,
    verified: true, instant: true, sessions: 56, response: "4.8", retention: "84%",
    headline: "Better swings, cleaner mechanics, more confidence.",
    bio: "Baseball instructor focused on batting and fielding fundamentals.",
    bestFor: "Hitting, catching, throwing",
    firstSession: "Swing analysis and glove work",
    photos: ["Batting", "Fielding", "Catching"],
    colors: ["#1e293b", "#b91c1c", "#fbbf24"],
    philosophy: "Simple mechanics win games.",
    reviewList: ["Explains baseball really well.", "Super easy to work with."],
  },
  {
    id: "kayla", name: "Kayla M.", initials: "KM", sport: "Track", level: "State Sprinter",
    area: "Redmond", distance: 5.5, price: 44, rating: 4.7, reviews: 21, match: 90,
    verified: true, instant: false, sessions: 40, response: "4.8", retention: "82%",
    headline: "Speed training and sprint mechanics.",
    bio: "Track athlete helping middle school runners improve explosiveness.",
    bestFor: "Acceleration, starts, sprint form",
    firstSession: "Running form and reaction work",
    photos: ["Sprints", "Starts", "Conditioning"],
    colors: ["#111827", "#ea580c", "#facc15"],
    philosophy: "Explode first. Relax second.",
    reviewList: ["Made training exciting.", "My kid got way faster."],
  },
  {
    id: "mia", name: "Mia S.", initials: "MS", sport: "Softball", level: "Varsity Pitcher",
    area: "Bellevue", distance: 3.6, price: 42, rating: 4.8, reviews: 19, match: 88,
    verified: true, instant: true, sessions: 39, response: "4.8", retention: "86%",
    headline: "Cleaner swings, sharper throws, stronger confidence.",
    bio: "Softball coach focused on hitting, throwing mechanics, and beginner-friendly confidence work.",
    bestFor: "Hitting, throwing, fielding",
    firstSession: "Swing check, throwing form, glove work",
    photos: ["Hitting", "Throwing", "Fielding"],
    colors: ["#431407", "#ea580c", "#fde68a"],
    philosophy: "Make the basics feel natural first.",
    reviewList: ["Very encouraging and easy to learn from.", "Helped my daughter fix her swing fast."],
  },
  {
    id: "owen", name: "Owen H.", initials: "OH", sport: "Tennis", level: "USTA Tournament Player",
    area: "Medina", distance: 4.9, price: 58, rating: 4.9, reviews: 24, match: 87,
    verified: true, instant: false, sessions: 51, response: "4.9", retention: "89%",
    headline: "Footwork, forehands, serves, and match confidence.",
    bio: "Tennis coach for young players working on clean strokes, serving, and court movement.",
    bestFor: "Forehand, serve, footwork",
    firstSession: "Stroke check, rally control, serve basics",
    photos: ["Forehand", "Serve", "Footwork"],
    colors: ["#1a2e05", "#65a30d", "#bef264"],
    philosophy: "Good feet make every shot easier.",
    reviewList: ["Great at breaking down technique.", "Made tennis feel way less confusing."],
  },
  {
    id: "caleb", name: "Caleb D.", initials: "CD", sport: "Golf", level: "Junior Tour Player",
    area: "Newcastle", distance: 8.2, price: 70, rating: 4.8, reviews: 17, match: 85,
    verified: true, instant: false, sessions: 34, response: "4.7", retention: "81%",
    headline: "Simple swing fixes and better short game feel.",
    bio: "Golf coach helping younger players with swing basics, putting, and course confidence.",
    bestFor: "Swing, putting, wedges",
    firstSession: "Grip check, swing path, short game drills",
    photos: ["Swing", "Putting", "Short Game"],
    colors: ["#052e16", "#166534", "#84cc16"],
    philosophy: "Small fixes beat big overthinking.",
    reviewList: ["Very calm and clear.", "Helped my son stop slicing."],
  },
  {
    id: "gabe", name: "Gabe W.", initials: "GW", sport: "Wrestling", level: "State Placer",
    area: "Bellevue", distance: 2.7, price: 46, rating: 4.9, reviews: 20, match: 86,
    verified: true, instant: true, sessions: 43, response: "4.8", retention: "85%",
    headline: "Takedowns, balance, hand fighting, and grit.",
    bio: "Wrestling coach focused on safe technique, positioning, and confidence in live situations.",
    bestFor: "Takedowns, stance, defense",
    firstSession: "Stance, motion, hand fighting, basic shots",
    photos: ["Takedowns", "Stance", "Defense"],
    colors: ["#111827", "#7f1d1d", "#f87171"],
    philosophy: "Position first. Power second.",
    reviewList: ["Tough but safe and respectful.", "Great for beginners and serious kids."],
  },
  {
    id: "ethanlacrosse", name: "Ethan V.", initials: "EV", sport: "Lacrosse", level: "Varsity Midfielder",
    area: "Kirkland", distance: 6.8, price: 49, rating: 4.7, reviews: 15, match: 84,
    verified: false, instant: true, sessions: 28, response: "4.6", retention: "80%",
    headline: "Stick skills, shooting, dodging, and field IQ.",
    bio: "Lacrosse coach for younger players who want smoother stick handling and better decision making.",
    bestFor: "Stick skills, shooting, dodging",
    firstSession: "Cradling, passing, shooting form, dodges",
    photos: ["Stick Skills", "Shooting", "Dodging"],
    colors: ["#0f172a", "#0e7490", "#67e8f9"],
    philosophy: "Handle clean, think fast, play loose.",
    reviewList: ["My kid improved his catching fast.", "Good coach and easy to talk to."],
  },
  {
    id: "tylerbadbasketball", name: "Tyler F.", initials: "TF", sport: "Basketball", level: "JV Bench Player",
    area: "Bellevue", distance: 1.2, price: 28, rating: 2.4, reviews: 11, match: 52,
    verified: false, instant: true, sessions: 9, response: "2.8", retention: "31%",
    headline: "Cheap basketball runs, but not super structured.",
    bio: "Low-cost basketball help. Better for casual players than serious training.",
    bestFor: "Basic shooting, casual runs",
    firstSession: "Warmup, shooting around, simple drills",
    photos: ["Casual Runs", "Shooting", "Warmups"],
    colors: ["#292524", "#78716c", "#f59e0b"],
    philosophy: "Just get reps up and have fun.",
    reviewList: ["Showed up late twice.", "Nice guy but not very organized."],
  },
  {
    id: "marcuselitebasketball", name: "Marcus J.", initials: "MJ", sport: "Basketball", level: "D1 Walk-On",
    area: "Seattle", distance: 9.4, price: 85, rating: 5.0, reviews: 73, match: 94,
    verified: true, instant: false, sessions: 180, response: "5.0", retention: "96%",
    headline: "Elite guard work for serious hoopers.",
    bio: "High-level basketball coach for players who want serious scoring, reads, and confidence work.",
    bestFor: "Shot creation, reads, finishing",
    firstSession: "Skill test, pace work, live reads, scoring package",
    photos: ["Shot Creation", "Reads", "Finishing"],
    colors: ["#020617", "#1d4ed8", "#f97316"],
    philosophy: "Train like the game is trying to speed you up.",
    reviewList: ["Expensive but worth every dollar.", "Best basketball trainer on the Eastside."],
  },
  {
    id: "zoesoccer", name: "Zoe N.", initials: "ZN", sport: "Soccer", level: "ECNL Starter",
    area: "Bellevue", distance: 2.5, price: 52, rating: 4.9, reviews: 42, match: 93,
    verified: true, instant: true, sessions: 88, response: "4.9", retention: "91%",
    headline: "Technical soccer training that still feels fun.",
    bio: "Soccer trainer for younger players focused on confidence, first touch, and composure.",
    bestFor: "Touch, finishing, confidence",
    firstSession: "Touch count, finishing reps, movement habits",
    photos: ["Touch", "Finishing", "Movement"],
    colors: ["#052e16", "#15803d", "#86efac"],
    philosophy: "Make the ball feel like it belongs to you.",
    reviewList: ["My daughter asks to train with her again.", "Really positive and technical."],
  },
  {
    id: "bradfootballbad", name: "Brad P.", initials: "BP", sport: "Football", level: "Former JV Player",
    area: "Renton", distance: 12.1, price: 35, rating: 2.1, reviews: 8, match: 43,
    verified: false, instant: true, sessions: 6, response: "2.5", retention: "22%",
    headline: "Affordable football help, but reviews are mixed.",
    bio: "Basic football workouts. Best for casual conditioning, not advanced position training.",
    bestFor: "Conditioning, basic catching",
    firstSession: "Jogging, cone drills, catching basics",
    photos: ["Conditioning", "Cones", "Basics"],
    colors: ["#18181b", "#52525b", "#a1a1aa"],
    philosophy: "Work hard and keep moving.",
    reviewList: ["Did not have a clear plan.", "Fine for cheap conditioning, not real coaching."],
  },
  {
    id: "isaacfootball", name: "Isaac H.", initials: "IH", sport: "Football", level: "College Safety",
    area: "Bellevue", distance: 3.9, price: 72, rating: 4.9, reviews: 39, match: 92,
    verified: true, instant: false, sessions: 94, response: "4.9", retention: "90%",
    headline: "Defensive backs, speed, tackling angles, and IQ.",
    bio: "Football coach for DBs and receivers who want better technique and game awareness.",
    bestFor: "DB footwork, speed, angles",
    firstSession: "Stance, backpedal, breaks, reaction drills",
    photos: ["DB Work", "Speed", "Angles"],
    colors: ["#020617", "#7f1d1d", "#f59e0b"],
    philosophy: "Fast feet are useless without smart eyes.",
    reviewList: ["Professional and very sharp.", "My son learned more in one session than a whole camp."],
  },
  {
    id: "hannahvolleyball", name: "Hannah C.", initials: "HC", sport: "Volleyball", level: "Club Setter",
    area: "Kirkland", distance: 4.8, price: 46, rating: 4.8, reviews: 27, match: 90,
    verified: true, instant: true, sessions: 62, response: "4.9", retention: "88%",
    headline: "Setter hands, serving, passing, and court confidence.",
    bio: "Volleyball coach helping younger athletes improve ball control and confidence.",
    bestFor: "Setting, serving, passing",
    firstSession: "Hands, footwork, target passing, serving rhythm",
    photos: ["Setting", "Serving", "Passing"],
    colors: ["#312e81", "#7c3aed", "#f0abfc"],
    philosophy: "Confidence is a skill too.",
    reviewList: ["Very encouraging.", "Helped my daughter fix her serve."],
  },
  {
    id: "badvolleyball", name: "Tara Q.", initials: "TQ", sport: "Volleyball", level: "Casual Player",
    area: "Issaquah", distance: 10.8, price: 25, rating: 2.8, reviews: 5, match: 45,
    verified: false, instant: true, sessions: 4, response: "3.0", retention: "20%",
    headline: "Cheap volleyball practice partner.",
    bio: "Casual volleyball help. Better for very new players who just need reps.",
    bestFor: "Basic reps, beginner passing",
    firstSession: "Simple passing and serving around",
    photos: ["Basics", "Reps", "Serving"],
    colors: ["#4b5563", "#6b7280", "#d1d5db"],
    philosophy: "Keep it simple and casual.",
    reviewList: ["Not bad, just not very coach-like.", "Felt more like a practice partner."],
  },
  {
    id: "noahbaseball", name: "Noah G.", initials: "NG", sport: "Baseball", level: "Varsity Shortstop",
    area: "Bellevue", distance: 2.2, price: 44, rating: 4.6, reviews: 20, match: 88,
    verified: true, instant: true, sessions: 38, response: "4.7", retention: "79%",
    headline: "Fielding footwork, throwing, and contact hitting.",
    bio: "Baseball coach for younger players building cleaner fundamentals.",
    bestFor: "Fielding, throwing, contact",
    firstSession: "Ground balls, throwing form, tee work",
    photos: ["Fielding", "Throwing", "Contact"],
    colors: ["#1e293b", "#dc2626", "#fbbf24"],
    philosophy: "Routine plays win games.",
    reviewList: ["Solid coach and very patient.", "Helped with throwing mechanics."],
  },
  {
    id: "lilysoftball", name: "Lily A.", initials: "LA", sport: "Softball", level: "College Commit",
    area: "Redmond", distance: 6.3, price: 62, rating: 4.9, reviews: 33, match: 91,
    verified: true, instant: false, sessions: 71, response: "4.9", retention: "93%",
    headline: "Pitching mechanics, power hitting, and confidence.",
    bio: "Softball coach for pitchers and hitters who want cleaner mechanics and better game confidence.",
    bestFor: "Pitching, hitting, confidence",
    firstSession: "Mechanics check, power drills, pitch control",
    photos: ["Pitching", "Power", "Control"],
    colors: ["#7c2d12", "#fb923c", "#fed7aa"],
    philosophy: "Strong mechanics make confidence easier.",
    reviewList: ["Amazing with young pitchers.", "Very organized and positive."],
  },
  {
    id: "dylanswimbad", name: "Dylan Y.", initials: "DY", sport: "Swimming", level: "Summer Swim Helper",
    area: "Kirkland", distance: 5.9, price: 22, rating: 2.9, reviews: 7, match: 48,
    verified: false, instant: true, sessions: 5, response: "3.1", retention: "28%",
    headline: "Basic swim help for beginners only.",
    bio: "Cheap beginner swim support. Not ideal for competitive swimmers.",
    bestFor: "Floating, basic freestyle",
    firstSession: "Comfort in water and simple kicking drills",
    photos: ["Beginner", "Kicking", "Water Comfort"],
    colors: ["#334155", "#0284c7", "#bae6fd"],
    philosophy: "Stay relaxed and keep moving.",
    reviewList: ["Okay for basics, not advanced.", "Was friendly but unstructured."],
  },
  {
    id: "sophietennisbad", name: "Sophie R.", initials: "SR", sport: "Tennis", level: "Weekend Player",
    area: "Bellevue", distance: 3.7, price: 24, rating: 2.6, reviews: 6, match: 49,
    verified: false, instant: true, sessions: 7, response: "3.2", retention: "25%",
    headline: "Beginner tennis rallies and casual practice.",
    bio: "Casual tennis practice partner. Good for beginners but not detailed instruction.",
    bestFor: "Rallying, beginner practice",
    firstSession: "Warmup rallies and basic serve attempts",
    photos: ["Rallies", "Basics", "Serving"],
    colors: ["#365314", "#84cc16", "#eab308"],
    philosophy: "Have fun and get the ball over.",
    reviewList: ["Nice but not very technical.", "Fine for practice, not coaching."],
  },
  {
    id: "victorwrestling", name: "Victor M.", initials: "VM", sport: "Wrestling", level: "College Wrestler",
    area: "Seattle", distance: 9.7, price: 80, rating: 5.0, reviews: 44, match: 89,
    verified: true, instant: false, sessions: 110, response: "5.0", retention: "95%",
    headline: "Elite wrestling technique with safe intensity.",
    bio: "High-level wrestling coach focused on strong fundamentals, safe live work, and competition mindset.",
    bestFor: "Shots, defense, live strategy",
    firstSession: "Stance, motion, chain wrestling, defense checks",
    photos: ["Shots", "Defense", "Live Work"],
    colors: ["#020617", "#991b1b", "#fca5a5"],
    philosophy: "Hard training only works if it is controlled.",
    reviewList: ["Incredible coach.", "Intense but safe and respectful."],
  },
  {
    id: "natalielacrosse", name: "Natalie B.", initials: "NB", sport: "Lacrosse", level: "Club Captain",
    area: "Bellevue", distance: 2.6, price: 47, rating: 4.8, reviews: 19, match: 88,
    verified: true, instant: true, sessions: 46, response: "4.8", retention: "86%",
    headline: "Stick control, shooting, and confident movement.",
    bio: "Lacrosse coach helping young players improve catching, passing, shooting, and field confidence.",
    bestFor: "Catching, shooting, field IQ",
    firstSession: "Wall ball, passing, shooting form, dodges",
    photos: ["Wall Ball", "Shooting", "Dodging"],
    colors: ["#0f172a", "#0284c7", "#7dd3fc"],
    philosophy: "Clean hands make the game slow down.",
    reviewList: ["Super helpful and positive.", "Great coach for beginners."],
  },
];
