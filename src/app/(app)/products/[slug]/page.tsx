import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ProductGridItem } from '@/components/ProductGridItem'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { Button } from '@/components/ui/button'
import { ProductProvider } from '@/providers/ProductProvider'
import { generateMeta } from '@/utilities/generateMeta'
import { PopulatedProduct, normalizeProduct, populateGallery } from '@/utilities/normalizeProduct'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

type Args = {
  params: Promise<{
    slug: string
  }>
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInPLN: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs[0] || null
}

const getMaxVariantPrice = (product: PopulatedProduct) => {
  if (!product.enableVariants || !product.variants.length) {
    return product.priceInPLN
  }

  return product.variants.reduce((max, variant) => {
    if (variant.priceInPLN && max && variant.priceInPLN > max) {
      return variant.priceInPLN
    }
    return max
  }, product.priceInPLN)
}

const hasAvailableStock = (product: PopulatedProduct) => {
  if (!product.enableVariants) {
    return (product.inventory ?? 0) > 0
  }

  return Boolean(product.variants.some((variant) => (variant.inventory ?? 0) > 0))
}

const buildProductJsonLd = (product: PopulatedProduct) => {
  const metaImage = typeof product.meta?.image === 'object' ? product.meta.image : undefined

  return {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasAvailableStock(product)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      price: getMaxVariantPrice(product),
      priceCurrency: 'usd',
    },
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = populateGallery(product.gallery)

  return generateMeta({
    doc: product,
    fallbackImage: gallery[0].image,
    robots: { index: product._status === 'published' },
  })
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const raw = await queryProductBySlug({ slug })

  if (!raw) return notFound()
  const product = normalizeProduct(raw)

  const productJsonLd = buildProductJsonLd(product)

  return (
    <ProductProvider product={product}>
      <React.Fragment>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
          type="application/ld+json"
        />
        <div className="container pt-20 pb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/sklep">
              <ChevronLeftIcon />
              Wszystkie produkty
            </Link>
          </Button>
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
            <div className="h-full w-full basis-full lg:basis-1/2">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
                }
              >
                {Boolean(product.gallery.length) && <Gallery gallery={product.gallery} />}
              </Suspense>
            </div>

            <div className="basis-full lg:basis-1/2">
              <ProductDescription product={product} />
            </div>
          </div>
        </div>

        {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : null}

        {product.relatedProducts.length ? (
          <div className="container">
            <RelatedProducts products={product.relatedProducts} />
          </div>
        ) : null}
      </React.Fragment>
    </ProductProvider>
  )
}

function RelatedProducts({ products }: { products: PopulatedProduct[] }) {
  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {products.map((product) => (
          <li
            className="w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <ProductGridItem product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
