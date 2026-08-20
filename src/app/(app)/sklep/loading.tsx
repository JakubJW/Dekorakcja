import { Grid } from '@/components/Grid'

export default function Loading() {
  return (
    <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(12)
        .fill(0)
        .map((_, index) => {
          return (
            <div
              className="animate-pulse bg-neutral-100 w-full h-full aspect-square rounded-2xl"
              key={index}
            />
          )
        })}
    </Grid>
  )
}
