// @ts-ignore
import pdfExportScript from "./scripts/pdfexport.inline"
import pdfStyles from "./styles/pdfexport.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    return (
      <div class={classNames(displayClass, "article-title-wrapper")}>
        <h1 class="article-title">{title}</h1>
        <button class="pdf-export" title="Export to PDF">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </button>
      </div>
    )
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0 0 0;
}

.article-title {
  margin: 0;
  flex: 1;
}
`

ArticleTitle.beforeDOMLoaded = pdfExportScript
ArticleTitle.css = ArticleTitle.css + "\n" + pdfStyles

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
