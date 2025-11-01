import prisma from "./client";

async function main() {
  console.log("🌱 Seeding categories...");

  const categories = [
    { id: "cat_1", name: "Arts & Crafts" },
    { id: "cat_2", name: "Cooking" },
    { id: "cat_3", name: "Dance" },
    { id: "cat_4", name: "Tours" },
    { id: "cat_5", name: "Music" },
    { id: "cat_6", name: "Language" },
    { id: "cat_7", name: "Culture & Heritage" },
    { id: "cat_8", name: "Adventure" },
    { id: "cat_9", name: "Photography" },
    { id: "cat_10", name: "Wellness & Yoga" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: category,
    });
    console.log(`✅ Category "${category.name}" seeded`);
  }

  console.log(`\n✨ Successfully seeded ${categories.length} categories!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

