import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "How does the toy rental subscription work?",
    answer:
      "Our toy rental subscription allows you to choose toys from our catalog, have them delivered to your home, and return them when you're ready for new ones. You pay a monthly fee based on your chosen plan, which determines how many tokens you receive and how often you can swap toys.",
  },
  {
    question: "Are the toys clean and safe?",
    answer:
      "We have a rigorous cleaning and sanitization process for all toys between rentals. We also regularly inspect toys for any damage or wear to ensure they meet our high safety standards.",
  },
  {
    question: "What if a toy gets damaged while we have it?",
    answer:
      "We understand that accidents happen, especially with children at play. Our subscriptions include basic damage protection. For more extensive damage, we assess each situation individually and may charge a small fee depending on the extent of the damage.",
  },
  {
    question: "How long can we keep the toys?",
    answer:
      "You can keep the toys for as long as you like within your subscription period. However, to make the most of your subscription, we recommend swapping toys regularly based on your plan's allowance.",
  },
  {
    question: "Can I purchase a toy if my child really loves it?",
    answer:
      "Yes! If your child falls in love with a particular toy, you have the option to purchase it at a discounted rate. Just let us know, and we'll arrange the purchase and remove the toy from your rental queue.",
  },
]

export function FAQ() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

