import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { getCategoriesList } from "@lib/data/categories"
import { getProductTypesList } from "@lib/data/product-types"
import { Collection } from "@/types/collection-data"
export default async function CollectionTemplate({
  sortBy,
  collection,
  collectionData,
  category,
  type,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  collectionData?: Collection
  category: string[] | undefined
  type?: string[]
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1

  const categories = await getCategoriesList(0, 100, ["id", "name", "handle"])
  const types = await getProductTypesList(0, 100, ["id", "value"])

  return (
    <>
      <RefinementList
        sortBy={sortBy}
        categories={Object.fromEntries(
          categories.product_categories.map((c) => [c.handle, c.name])
        )}
        category={category}
        types={Object.fromEntries(
          types.productTypes.map((t) => [t.value, t.value])
        )}
        type={type}
      />
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sortBy}
          page={pageNumber}
          collectionId={collection.id}
          countryCode={countryCode}
          categoryId={
            !category
              ? undefined
              : categories.product_categories
                .filter((c) => category.includes(c.handle))
                .map((c) => c.id)
          }
          typeId={
            !type
              ? undefined
              : types.productTypes
                .filter((t) => type.includes(t.value))
                .map((t) => t.id)
          }
        />
      </Suspense>
      <div className="pb-26 md:pb-36" />
    </>
  )}
