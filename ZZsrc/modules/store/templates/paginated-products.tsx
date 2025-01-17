import { getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Layout, LayoutColumn } from "@/components/Layout"

const PRODUCT_LIMIT = 12

export default async function PaginatedProducts({
                                                  sortBy,
                                                  page,
                                                  collectionId,
                                                  categoryId,
                                                  typeId,
                                                  productsIds,
                                                  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string | string[]
  categoryId?: string | string[]
  typeId?: string | string[]
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: HttpTypes.StoreProductParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId)
      ? categoryId
      : [categoryId]
  }

  if (typeId) {
    queryParams["type_id"] = Array.isArray(typeId) ? typeId : [typeId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }
  let region
  try {
    region = await getRegion(countryCode)
  } catch (error) {
    console.error(`Error fetching region for country code ${countryCode}:`, error)
    return <div>Error: Unable to fetch region information. Please try again later.</div>
  }

  if (!region) {
    console.error(`No region found for country code: ${countryCode}`)
    return <div>Error: Region not found. Please check the country code and try again.</div>
  }

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await getProductsListWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 md:px-10 lg:px-20">
        {products.map((p) => {
          return (
            <div key={p.id} className="">
              <ProductPreview product={p} region={region} />
            </div>
          )
        })}
      </div>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
