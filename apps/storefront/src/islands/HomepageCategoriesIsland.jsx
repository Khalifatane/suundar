import { useEffect, useState } from "react";
import { sanityService } from "@siggistore/services/storefront";

const fallbackCategories = [
  {
    href: "./Product Listing.html#",
    image: "/images/photo-1718252540617-6ecda2b56b57.jpg",
    label: "Jeans (21)",
  },
  {
    href: "./Product Listing.html#",
    image: "/images/photo-1720514496505-d6756368b0b3.jpg",
    label: "Polos (35)",
  },
];

function mapCategoryToCard(category, fallback, index) {
  const title = category?.title || fallback?.label || `Category ${index + 1}`;
  const href = category?.slug?.current
    ? `./Product Listing.html?category=${encodeURIComponent(category.slug.current)}`
    : fallback?.href || "./Product Listing.html#";

  return {
    href,
    image: category?.image?.asset?.url || fallback?.image || "",
    label: title,
  };
}

export default function HomepageCategoriesIsland() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const sanityCategories = await sanityService.getCategories();
        if (!isMounted || !Array.isArray(sanityCategories) || sanityCategories.length === 0) {
          return;
        }

        const nextCategories = sanityCategories
          .slice(0, fallbackCategories.length)
          .map((category, index) =>
            mapCategoryToCard(category, fallbackCategories[index], index),
          );

        setCategories(nextCategories);
      } catch (error) {
        console.warn("Unable to load homepage categories from Sanity.", error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-wrap g26qa ocxlb">
      {categories.map((category) => (
        <a
          key={`${category.label}-${category.href}`}
          className="i0yn8 group flex items-center nj29a s6i1l mak94 x3ljb ymevt focus:outline-hidden sqat8"
          href={category.href}
        >
          <img
            alt="Product Image"
            className="y6rh0 uev8b fy2yn nj29a"
            src={category.image}
          />
          <div className="t6ue9 dg39k b3k2r ns7yz">
            <span className="text-[13px] at2zb k0ser group-hover:text-primary-hover group-focus:text-primary-focus">
              {category.label}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
