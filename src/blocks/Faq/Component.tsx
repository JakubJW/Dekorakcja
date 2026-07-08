import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/Collapsible'
import { RichText } from '@/components/RichText'
import { FAQBlock as FAQBlockProps } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'

export const FAQBlock: React.FC<FAQBlockProps & { id: DefaultDocumentIDType }> = ({
  faqs,
  heading,
}) => {
  if (!faqs?.length) return null

  return (
    <div className="container max-w-3xl mx-auto space-y-12">
      <h3 className="text-primary text-center text-3xl">{heading}</h3>
      <div>
        {faqs.map((faq) => (
          <Collapsible key={faq.id ?? faq.question}>
            <CollapsibleTrigger>
              <p className="text-primary font-medium">{faq.question}</p>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <RichText data={faq.answer} enableGutter={false} />
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
