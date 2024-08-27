import parse from "html-react-parser"
import { useEffect, useState } from "react"

type HtmlParserProps = {
  html: string
}

export const HtmlParser = ({ html }: HtmlParserProps) => {
  //use effect to avoid hydragtion error with ssr html data
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(true)
  }, [])

  return (
    <div className="[&_h1]:text-4xl [&_h2]:text-3xl [&_blockqoute]:italic [&_iframe]:aspect-video [&_h3]:text-2xl text-themeTextGray flex flex-col gap-y-3">
      {mounted && parse(html)}
    </div>
  )
}
