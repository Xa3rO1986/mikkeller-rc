import { storage } from "./storage";

async function seed() {
  console.log("Starting seed...");

  const events = [
    {
      slug: "riverside-10k",
      title: "Забег вдоль набережной",
      description: "Присоединяйтесь к нам на живописный забег вдоль набережной! Это идеальный маршрут для бегунов всех уровней подготовки. После забега встречаемся в баре у моста.",
      startsAt: new Date("2025-12-20T10:00:00"),
      latitude: 55.7558,
      longitude: 37.6173,
      address: "Набережная, Москва",
      distanceKm: 10.0,
      elevationGain: 50,
      status: "published" as const,
    },
    {
      slug: "forest-trail-15k",
      title: "Лесной трейл",
      description: "Забег по живописным лесным тропам. Отличная возможность насладиться природой и проверить свою выносливость. Встреча после забега в кафе у входа в парк.",
      startsAt: new Date("2025-12-27T09:00:00"),
      latitude: 55.7420,
      longitude: 37.5530,
      address: "Лесопарк, Москва",
      distanceKm: 15.0,
      elevationGain: 280,
      status: "published" as const,
    },
    {
      slug: "urban-park-5k",
      title: "Пробежка в парке",
      description: "Легкая пробежка для всех желающих. Подходит для новичков и семейного отдыха. После пробежки встречаемся в парковом кафе.",
      startsAt: new Date("2026-01-10T10:00:00"),
      latitude: 55.7312,
      longitude: 37.6018,
      address: "Парк Горького, Москва",
      distanceKm: 5.0,
      elevationGain: 20,
      status: "published" as const,
    },
  ];

  for (const event of events) {
    try {
      await storage.createEvent(event);
      console.log(`✓ Created event: ${event.title}`);
    } catch (error) {
      console.error(`✗ Failed to create event ${event.title}:`, error);
    }
  }

  const products = [
    {
      slug: "mrc-tshirt",
      title: "Футболка MRC",
      description: "Классическая футболка Mikkeller Running Club. 100% хлопок, черный цвет с белым логотипом.",
      category: "apparel",
      basePrice: 2500,
      active: true,
      images: [],
    },
    {
      slug: "running-cap",
      title: "Беговая кепка",
      description: "Легкая беговая кепка с логотипом MRC. Отлично подходит для бега в солнечную погоду.",
      category: "accessories",
      basePrice: 1500,
      active: true,
      images: [],
    },
    {
      slug: "water-bottle",
      title: "Спортивная бутылка",
      description: "Многоразовая спортивная бутылка объемом 750мл. Подходит для воды и спортивных напитков.",
      category: "accessories",
      basePrice: 800,
      active: true,
      images: [],
    },
  ];

  for (const product of products) {
    try {
      const created = await storage.createProduct(product);
      console.log(`✓ Created product: ${product.title}`);

      if (product.slug === "mrc-tshirt") {
        const sizes = ["XS", "S", "M", "L", "XL"];
        for (const size of sizes) {
          await storage.createVariant({
            productId: created.id,
            size: size,
            sku: `MRC-TSHIRT-${size}`,
            price: 2500,
            stock: 10,
          });
        }
        console.log(`  ✓ Added ${sizes.length} size variants`);
      } else if (product.slug === "running-cap") {
        const colors = ["Черная", "Белая"];
        for (const color of colors) {
          await storage.createVariant({
            productId: created.id,
            color: color,
            sku: `CAP-${color.toUpperCase()}`,
            price: 1500,
            stock: 20,
          });
        }
        console.log(`  ✓ Added ${colors.length} color variants`);
      }
    } catch (error) {
      console.error(`✗ Failed to create product ${product.title}:`, error);
    }
  }

  console.log("Seed completed!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
