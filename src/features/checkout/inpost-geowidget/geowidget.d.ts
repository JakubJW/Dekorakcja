export { }

declare global {
  interface HTMLElementTagNameMap {
    'inpost-geowidget': HTMLElement & {
      token: string
      language: string
      config: string
      onpoint?: string
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'inpost-geowidget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        token: string
        language?: string
        config?: string
        onpoint?: string
      }
    }
  }
}
