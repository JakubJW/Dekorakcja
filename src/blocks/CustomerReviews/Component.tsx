import { CustomerReviewsBlock as CustomerReviewsBlockProps } from '@/payload-types'
import { getInitials } from '@/utilities/getInitials'
import { Quote, Star } from 'lucide-react'
import { DefaultDocumentIDType } from 'payload'

export const CustomerReviewsBlock: React.FC<
  CustomerReviewsBlockProps & { id: DefaultDocumentIDType }
> = ({ reviews, heading }) => {
  if (!reviews?.length) return null

  return (
    <section className="bg-[#F7F3EE] py-20">
      <div className="container mx-auto space-y-12">
        <h3 className="text-primary text-center text-3xl">{heading}</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review?.id} className="shadow-2xs p-6 bg-white rounded-2xl space-y-4">
              <Quote className="size-4 text-secondary" />
              <p className="italic font-light text-primary leading-relaxed">
                &quot;{review.content}&quot;
              </p>
              <div className="flex gap-4 border-t pt-6">
                <div className="bg-card text-secondary inline-flex font-bold text-sm uppercase rounded-full size-10 items-center justify-center">
                  {getInitials(review.customer)}
                </div>
                <div className="space-y-2">
                  <p className="text-brand text-sm font-bold">{review.customer}</p>
                  <div className="flex text-secondary">
                    {[...Array(review.score).keys()].map((_, index) => (
                      <Star key={index} className="size-3" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
