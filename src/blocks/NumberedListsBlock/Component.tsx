import { NumberedListsBlock as NumberedListsBlockProps } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'

export const NumberedListsBlock: React.FC<
  NumberedListsBlockProps & { id: DefaultDocumentIDType }
> = ({ lists }) => {
  console.log(lists)
  if (!lists?.length) return null

  return (
    <section className="py-20 bg-[url(/assets/Vector.svg)] bg-cover">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {lists.map((list) => (
            <div key={list.id} className="text-primary space-y-12">
              <div className="flex items-center gap-4">
                <hr className="w-10 h-0.5 bg-secondary" />
                <h3 className="text-2xl text-primary leading-relaxed">{list.heading}</h3>
              </div>
              <ol className="space-y-10">
                {list.points.map((point, index) => (
                  <li key={point.id} className="flex gap-6">
                    <span className="font-serif italic text-3xl text-secondary">0{index + 1}</span>
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold">{point.heading}</h4>
                      <p className="font-light text-sm">{point.paragraph}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
