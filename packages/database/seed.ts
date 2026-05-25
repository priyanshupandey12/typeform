import { db } from "./index";
import { usersTable } from "./models/user";
import { formsTable } from "./models/form";
import { formfieldsTable, formFieldTypeEnum } from "./models/form-field";
import { formSubmissionsTable } from "./models/form-submissions";
import { eq, inArray } from "drizzle-orm";
import crypto from "crypto";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Create Demo User
  console.log("Creating Demo User...");
  const demoEmail = "demo@sagaforms.com";
  
  // Clean up existing demo user forms so we don't duplicate forever on multiple seeds
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, demoEmail));
  if (existingUser[0]) {
    console.log("Cleaning up existing demo user data...");
    const userForms = await db.select({ id: formsTable.id }).from(formsTable).where(eq(formsTable.createdBy, existingUser[0].id));
    const formIds = userForms.map(f => f.id);
    
    if (formIds.length > 0) {
      await db.delete(formSubmissionsTable).where(inArray(formSubmissionsTable.formId, formIds));
      await db.delete(formfieldsTable).where(inArray(formfieldsTable.formId, formIds));
    }
    
    await db.delete(formsTable).where(eq(formsTable.createdBy, existingUser[0].id));
    await db.delete(usersTable).where(eq(usersTable.id, existingUser[0].id));
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto.createHmac("sha256", salt).update("demo1234").digest("hex");

  const [user] = await db.insert(usersTable).values({
    fullName: "Hackathon Judge",
    email: demoEmail,
    password: passwordHash,
    salt,
  }).returning();

  console.log(`✅ Created Demo User: ${demoEmail} (Password: demo1234)`);

  // 2. Create Forms
  console.log("Creating Sample Forms...");
  
  const formsToCreate = [
    {
      title: "Movie Feedback Form",
      description: "Tell us what you thought about the latest blockbuster screening!",
      slug: "movie-feedback",
      status: "published" as const,
      visibility: "public" as const,
    },
    {
      title: "Tech Startup Application",
      description: "Apply to join our fast-growing startup accelerator program in Silicon Valley.",
      slug: "startup-app",
      status: "published" as const,
      visibility: "public" as const,
    },
    {
      title: "Gaming Community Survey",
      description: "Help us shape the future of our Discord server and weekly game nights.",
      slug: "gaming-survey",
      status: "published" as const,
      visibility: "unlisted" as const,
    }
  ];

  const createdForms = await db.insert(formsTable).values(
    formsToCreate.map(f => ({ ...f, createdBy: user.id }))
  ).returning();

  const [movieForm, startupForm, gamingForm] = createdForms;

  console.log("✅ Created 3 Forms");

  // 3. Create Fields for Forms
  console.log("Creating Form Fields...");

  // Movie Fields
  const movieFields = await db.insert(formfieldsTable).values([
    { formId: movieForm.id, label: "What movie did you watch?", labelKey: "movie_name", fieldType: "TEXT", isRequired: true, orderIndex: "1" },
    { formId: movieForm.id, label: "Rate the movie (1-5)", labelKey: "rating", fieldType: "RATING", isRequired: true, orderIndex: "2" },
    { formId: movieForm.id, label: "What was your favorite scene?", labelKey: "favorite_scene", fieldType: "TEXTAREA", isRequired: false, orderIndex: "3" },
    { formId: movieForm.id, label: "Would you recommend this?", labelKey: "recommend", fieldType: "YES_NO", isRequired: true, orderIndex: "4" },
    { formId: movieForm.id, label: "Your Email (optional)", labelKey: "email", fieldType: "EMAIL", isRequired: false, orderIndex: "5" }
  ]).returning();

  // Startup Fields
  const startupFields = await db.insert(formfieldsTable).values([
    { formId: startupForm.id, label: "Startup Name", labelKey: "startup_name", fieldType: "TEXT", isRequired: true, orderIndex: "1" },
    { formId: startupForm.id, label: "Founder Email", labelKey: "email", fieldType: "EMAIL", isRequired: true, orderIndex: "2" },
    { formId: startupForm.id, label: "Funding Stage", labelKey: "stage", fieldType: "SELECT", options: [{ label: "Pre-seed", value: "pre-seed" }, { label: "Seed", value: "seed" }, { label: "Series A", value: "series-a" }], isRequired: true, orderIndex: "3" },
    { formId: startupForm.id, label: "Elevator Pitch", labelKey: "pitch", fieldType: "TEXTAREA", isRequired: true, orderIndex: "4" },
  ]).returning();

  // Gaming Fields
  const gamingFields = await db.insert(formfieldsTable).values([
    { formId: gamingForm.id, label: "Discord Username", labelKey: "discord", fieldType: "TEXT", isRequired: true, orderIndex: "1" },
    { formId: gamingForm.id, label: "Favorite Game Genre", labelKey: "genre", fieldType: "SELECT", options: [{ label: "FPS", value: "fps" }, { label: "RPG", value: "rpg" }, { label: "MOBA", value: "moba" }, { label: "Strategy", value: "strategy" }], isRequired: true, orderIndex: "2" },
    { formId: gamingForm.id, label: "How many hours do you play per week?", labelKey: "hours", fieldType: "NUMBER", isRequired: true, orderIndex: "3" },
  ]).returning();

  console.log("✅ Created Fields for all forms");

  // 4. Create Submissions
  console.log("Generating Seed Responses...");

  const hashIp = (ip: string) => crypto.createHash("sha256").update(ip).digest("hex");

  // Generate 15 movie responses
  const movieResponses = [];
  for (let i = 0; i < 15; i++) {
    movieResponses.push({
      formId: movieForm.id,
      ipHash: hashIp(`192.168.1.${i}`),
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100.0.0.0 Safari/537.36",
      values: {
        [movieFields[0].id]: ["Dune: Part Two", "Oppenheimer", "Spider-Man", "Godzilla"][i % 4],
        [movieFields[1].id]: Math.floor(Math.random() * 2) + 4, // 4 or 5
        [movieFields[2].id]: "The visuals were absolutely stunning and the sound design was incredible.",
        [movieFields[3].id]: "yes",
        [movieFields[4].id]: `moviegoer${i}@example.com`
      }
    });
  }

  // Generate 8 startup responses
  const startupResponses = [];
  for (let i = 0; i < 8; i++) {
    startupResponses.push({
      formId: startupForm.id,
      ipHash: hashIp(`10.0.0.${i}`),
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      values: {
        [startupFields[0].id]: `AI Startup ${i}`,
        [startupFields[1].id]: `founder${i}@aistartup${i}.com`,
        [startupFields[2].id]: ["pre-seed", "seed", "series-a"][i % 3],
        [startupFields[3].id]: "We are building the next generation of AI tools for enterprise workflows, saving teams 20 hours a week."
      }
    });
  }

  // Generate 25 gaming responses
  const gamingResponses = [];
  for (let i = 0; i < 25; i++) {
    gamingResponses.push({
      formId: gamingForm.id,
      ipHash: hashIp(`172.16.0.${i}`),
      userAgent: "DiscordBot/2.0",
      values: {
        [gamingFields[0].id]: `Gamer${Math.floor(Math.random() * 9999)}`,
        [gamingFields[1].id]: ["fps", "rpg", "moba", "strategy"][i % 4],
        [gamingFields[2].id]: Math.floor(Math.random() * 30) + 10,
      }
    });
  }

  await db.insert(formSubmissionsTable).values([...movieResponses, ...startupResponses, ...gamingResponses]);

  console.log("✅ Seeded 48 Total Responses");
  console.log("🎉 Seeding Complete! Judges can now log in with demo@sagaforms.com / demo1234");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
