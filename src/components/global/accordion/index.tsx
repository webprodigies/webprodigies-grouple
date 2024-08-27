import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RefObject } from "react"

type GlobalAccordionProps = {
  id: string
  title: string
  ref?: RefObject<HTMLButtonElement>
  onEdit?(): void
  edit?: boolean
  editable?: React.ReactNode
  children: React.ReactNode
}

export const GlobalAccordion = ({
  title,
  id,
  ref,
  onEdit,
  edit,
  children,
  editable,
}: GlobalAccordionProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem className="border-none" value={id}>
        <AccordionTrigger
          className="font-bold capitalize"
          onDoubleClick={onEdit}
          ref={ref}
        >
          {edit ? editable : title}
        </AccordionTrigger>
        {children}
      </AccordionItem>
    </Accordion>
  )
}
