import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { getProductTypesList } from "@lib/data/product-types"
import { getCollectionsList } from "@lib/data/collections"
import { ProductCategory } from "@medusajs/client-types"
export default async function CategoryTemplate({
  sortBy, categoryData,
  category,
  type,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  categoryData?: ProductCategory | undefined
  category: string[] | string | undefined
  type?: string[]
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1

  const collections = await getCollectionsList(0, 100, ["id", "title", "handle"])
  const types = await getProductTypesList(0, 100, ["id", "value"])

  return (
    <>
      <RefinementList
        sortBy={sortBy}
        collections={Object.fromEntries(
          collections.collections.map((c) => [c.handle, c.title])
        )}
        types={Object.fromEntries(
          types.productTypes.map((t) => [t.value, t.value])
        )}
        type={type}
      />
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sortBy}
          page={pageNumber}
          countryCode={countryCode}
          categoryId={categoryData?.id}
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
