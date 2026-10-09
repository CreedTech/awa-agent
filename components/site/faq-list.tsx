import { Icon } from "@/components/ui/icon";

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="aw-faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            <span>{item.q}</span>
            <Icon name="plus" size={20} />
          </summary>
          <div className="aw-faq-answer">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
