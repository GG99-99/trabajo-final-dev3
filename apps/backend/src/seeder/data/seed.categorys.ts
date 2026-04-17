import prisma from "@final/db";


export const categoryData = [
  {
    name: "Tintas",
    description: "Tintas de tatuaje de distintos colores y marcas",
  },
  {
    name: "Agujas",
    description: "Agujas individuales y cartuchos para máquinas de tatuaje",
  },
  {
    name: "Higiene y Protección",
    description: "Productos de limpieza, barreras y EPP para el área de trabajo",
  },
  {
    name: "Cuidado Post-Tatuaje",
    description: "Cremas, ungüentos y productos de cicatrización",
  },
  {
    name: "Equipos y Accesorios",
    description: "Máquinas, fuentes de poder, grips y accesorios varios",
  },
];

export async function seedCategories() {

  const categories = [];

  for (const data of categoryData) {
    const category = await prisma.category.upsert({
      where: { category_id: categoryData.indexOf(data) + 1 },
      update: data,
      create: data,
    });
    categories.push(category);
  }

  return categories;
}
