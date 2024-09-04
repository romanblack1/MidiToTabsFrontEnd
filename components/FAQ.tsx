import React from "react";
import "./FAQ.css";

interface FAQProps {
  faq: { question: string; answer: string; open: boolean };
  index: number;
  toggleFAQ: (index: number) => void;
}

export default function FAQ({ faq, index, toggleFAQ }: FAQProps): JSX.Element {
  return (
    <div
      className={"faq " + (faq.open ? "open" : "")}
      onClick={() => toggleFAQ(index)}
    >
      <div className="faq-question" key={index + faq.question}>
        {faq.question}
      </div>
      <div className="faq-answer" key={index + faq.answer}>
        {faq.answer}
      </div>
    </div>
  );
}
