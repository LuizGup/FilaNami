export async function exportSenhasToPDF(passwords = []) {
  if (!Array.isArray(passwords) || passwords.length === 0) {
    alert("Nenhum dado disponível para exportação.");
    return;
  }

  try {
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default || jsPDFModule;

    const autoTableModule = await import("jspdf-autotable");

    if (typeof autoTableModule.applyPlugin === "function") {
      autoTableModule.applyPlugin(jsPDF);
      console.log("DEBUG: AutoTable registrado com applyPlugin(jsPDF)");
    } else {
      console.error("applyPlugin não encontrado no módulo jspdf-autotable");
      alert("Erro ao carregar plugin AutoTable. Veja o console.");
      return;
    }

    const doc = new jsPDF();

    if (typeof doc.autoTable !== "function") {
      console.error("autoTable ainda não está disponível após applyPlugin");
      console.log("jsPDFModule:", jsPDFModule);
      console.log("autoTableModule:", autoTableModule);
      alert("Não foi possível registrar o AutoTable.");
      return;
    }

    const head = [["Número", "Geração", "Chamada", "Status"]];
    const body = passwords.map((p) => [
      p.passwordNumber ?? "-",
      p.generationTime ?? "-",
      p.callTime ?? "-",
      p.statusText ?? "-",
    ]);

    doc.text("Histórico de Senhas", 14, 16);

    doc.autoTable({
      head,
      body,
      startY: 22,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [19, 164, 236] },
    });

    doc.save(`historico_${Date.now()}.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Veja o console para detalhes.");
  }
}
