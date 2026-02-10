import MarkdownComponent from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.css";

export const Markdown = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <div className={`${styles["article-body"]} ${className}`}>
      {/* @ts-ignore */}
      <MarkdownComponent remarkPlugins={[remarkGfm]}>
        {children}
      </MarkdownComponent>
    </div>
  );
};
