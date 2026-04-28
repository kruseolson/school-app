import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("password123", 10);

  const coaches = [
    {
      email: "james@example.com",
      name: "James Miller",
      sport: "Basketball",
      experience: "COLLEGE_PLAYER",
      hourlyRate: 40,
      bio: "D1 college guard, 10+ years playing. I focus on shooting form, ball-handling, and game IQ. Patient with younger players, intense with serious ones.",
      zipCode: "10001",
      instantBook: true,
    },
    {
      email: "maya@example.com",
      name: "Maya Chen",
      sport: "Soccer",
      experience: "HS_PLAYER",
      hourlyRate: 25,
      bio: "Varsity captain, all-state midfielder. Love teaching first-touch and 1v1 defending. Sessions on the local park or your driveway.",
      zipCode: "10002",
      instantBook: false,
    },
    {
      email: "tre@example.com",
      name: "Tre Johnson",
      sport: "Football",
      experience: "COLLEGE_PLAYER",
      hourlyRate: 45,
      bio: "Wide receiver at State U. Speed, route-running, hands. Bring cleats and a ball.",
      zipCode: "10003",
      instantBook: true,
    },
    {
      email: "sara@example.com",
      name: "Sara Lopez",
      sport: "Tennis",
      experience: "CERTIFIED",
      hourlyRate: 60,
      bio: "USPTA-certified, former NCAA D2 player. Drills, footwork, match strategy. Beginner to advanced.",
      zipCode: "10010",
      instantBook: true,
    },
    {
      email: "aiden@example.com",
      name: "Aiden Park",
      sport: "Baseball",
      experience: "HS_PLAYER",
      hourlyRate: 30,
      bio: "Pitcher / shortstop, varsity. I help with hitting mechanics and infield reads.",
      zipCode: "10001",
      instantBook: false,
    },
    {
      email: "leah@example.com",
      name: "Leah Brooks",
      sport: "Volleyball",
      experience: "COLLEGE_PLAYER",
      hourlyRate: 35,
      bio: "Outside hitter, club + college. Serving, passing, hitting approach. Fun and high-energy.",
      zipCode: "10025",
      instantBook: true,
    },
  ];

  for (const c of coaches) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        name: c.name,
        passwordHash: hash,
        role: "COACH",
        zipCode: c.zipCode,
        age: 20,
      },
    });
    await prisma.coachProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        sport: c.sport,
        experience: c.experience,
        hourlyRate: c.hourlyRate,
        bio: c.bio,
        zipCode: c.zipCode,
        instantBook: c.instantBook,
        serviceRadius: 10,
      },
    });
  }

  // Demo player
  await prisma.user.upsert({
    where: { email: "player@example.com" },
    update: {},
    create: {
      email: "player@example.com",
      name: "Alex Player",
      passwordHash: hash,
      role: "PLAYER",
      age: 14,
      zipCode: "10001",
    },
  });

  console.log("Seeded. Demo accounts: player@example.com / password123");
  console.log("Coaches: james@example.com, maya@example.com, ... (password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
