let extractedText = "";

async function convertPDF() {
  const file = document.getElementById("pdfFile").files[0];
  if (!file) {
    alert("Please upload a PDF file!");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function() {
    const typedarray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map(item => item.str);
      extractedText += strings.join(" ") + "\n\n";
    }

    document.getElementById("output").value = extractedText;
  };

  reader.readAsArrayBuffer(file);
}

function downloadTXT() {
  if (!extractedText) {
    alert("No text to download!");
    return;
  }

  const blob = new Blob([extractedText], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "converted.txt";
  link.click();
}

function downloadWord() {
  if (!extractedText || extractedText.trim() === "") {
    alert("No text to download!");
    return;
  }

  if (typeof docx === "undefined") {
    alert("Word library not loaded!");
    return;
  }

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: extractedText.split("\n").map(line => 
          new docx.Paragraph({
            children: [
              new docx.TextRun(line)
            ]
          })
        )
      }
    ]
  });

  docx.Packer.toBlob(doc).then(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "converted.docx";
    link.click();
  }).catch(err => {
    console.error(err);
    alert("Error creating Word file!");
  });
}

new docx.Paragraph({
  spacing: { after: 200 },
  children: [
    new docx.TextRun({
      text: line,
      font: "Calibri",
      size: 24
    })
  ]
})

async function convertPDF() {
  const file = document.getElementById("pdfFile").files[0];
  if (!file) {
    alert("Upload PDF!");
    return;
  }

  document.querySelector(".title").innerText = "⚡ Converting...";

  const reader = new FileReader();

  reader.onload = async function() {
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map(item => item.str);
      extractedText += strings.join(" ") + "\n\n";
    }

    document.getElementById("output").value = extractedText;

    document.querySelector(".title").innerText = "✅ Done - CAGO Converter";
  };

  reader.readAsArrayBuffer(file);
}
  location.reload();
}
