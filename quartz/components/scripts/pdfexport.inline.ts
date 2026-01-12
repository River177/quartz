import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

document.addEventListener("nav", () => {
  async function handlePdfExport(this: HTMLElement) {
    const button = this as HTMLButtonElement
    const originalText = button.innerHTML
    button.innerHTML = "Exporting..."
    button.disabled = true

    try {
      const article = document.querySelector("article.popover-hint") as HTMLElement
      if (!article) {
        console.error("Article content not found")
        button.innerHTML = originalText
        button.disabled = false
        alert("Article content not found. Please try again on a content page.")
        return
      }

      const canvas = await html2canvas(article, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: window.getComputedStyle(document.documentElement).backgroundColor,
      })

      const imgData = canvas.toDataURL("image/png")
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      const marginLeft = 15
      const marginRight = 15
      const marginTop = 15
      const marginBottom = 15
      
      const contentWidth = pageWidth - marginLeft - marginRight
      const contentHeight = pageHeight - marginTop - marginBottom
      
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      
      const imgWidthMM = (imgWidth * 25.4) / 96
      const imgHeightMM = (imgHeight * 25.4) / 96
      
      const ratio = contentWidth / imgWidthMM
      const scaledWidth = contentWidth
      const scaledHeight = imgHeightMM * ratio
      
      let heightLeft = scaledHeight
      let position = marginTop
      
      pdf.addImage(imgData, "PNG", marginLeft, position, scaledWidth, scaledHeight)
      heightLeft -= contentHeight
      
      while (heightLeft > 0) {
        position = -(scaledHeight - heightLeft) + marginTop
        pdf.addPage()
        pdf.addImage(imgData, "PNG", marginLeft, position, scaledWidth, scaledHeight)
        heightLeft -= contentHeight
      }

      const title = document.querySelector("h1.article-title")?.textContent || "document"
      const fileName = `${title.trim()}.pdf`

      pdf.save(fileName)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      button.innerHTML = originalText
      button.disabled = false
    }
  }

  const pdfButtons = document.getElementsByClassName("pdf-export")
  for (let i = 0; i < pdfButtons.length; i++) {
    const button = pdfButtons[i]
    button.addEventListener("click", handlePdfExport)
    window.addCleanup(() => button.removeEventListener("click", handlePdfExport))
  }
})
