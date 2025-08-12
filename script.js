document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("radar");
  const labels = ["Iniciativa e protagonismo", "Influência e confiança", "Aprendizado e autocrítica", "Ética e resiliência"];
  let chart;

  // A validação manual foi removida, pois o <select> já restringe as opções.

  function getInputValue(id) {
    const el = document.getElementById(id);
    return parseFloat(el.value) || 0;
  }

  function calculateScores() {
    const scores = { competencia: [], percepcao: [] };

    scores.competencia.push(((getInputValue("q1") + getInputValue("q2") + getInputValue("q3")) / 3) * 2);
    scores.percepcao.push(((getInputValue("q4") + getInputValue("q5") + getInputValue("q6")) / 3) * 2);
    // Eixo 2
    scores.competencia.push(((getInputValue("q7") + getInputValue("q8") + getInputValue("q9")) / 3) * 2);
    scores.percepcao.push(((getInputValue("q10") + getInputValue("q11") + getInputValue("q12")) / 3) * 2);
    // Eixo 3
    scores.competencia.push(((getInputValue("q13") + getInputValue("q14") + getInputValue("q15")) / 3) * 2);
    scores.percepcao.push(((getInputValue("q16") + getInputValue("q17") + getInputValue("q18")) / 3) * 2);
    // Eixo 4
    scores.competencia.push(((getInputValue("q19") + getInputValue("q20") + getInputValue("q21")) / 3) * 2);
    scores.percepcao.push(((getInputValue("q22") + getInputValue("q23") + getInputValue("q24")) / 3) * 2);
    return scores;
  }

  function getInterpretation(competencia, percepcao) {
    if (competencia >= 7.5 && percepcao >= 7.5) {
      return {
        title: "Alto–Alto: Potência Plena",
        class: "alto-alto",
        text: "Você já atua bem e se sente bem. Mantenha rituais de manutenção: feedback contínuo, mentoria reversa e metas de impacto.",
      };
    } else if (competencia >= 7.5 && percepcao <= 6.0) {
      return {
        title: "Alto–Baixo: Potência com Insegurança",
        class: "alto-baixo",
        text: "Você faz, mas não se sente seguro. Trabalhe confiança e narrativa pessoal. Combine feedbacks positivos, registros de conquistas e pequenas vitórias visíveis.",
      };
    } else if (competencia <= 6.0 && percepcao >= 7.5) {
      return {
        title: "Baixo–Alto: Potência em Preparo",
        class: "baixo-alto",
        text: "Você quer e se sente pronto, porém falta base prática. Defina microdesafios com prazos curtos, pratique delegação guiada e estudo dirigido.",
      };
    } else if (competencia <= 6.0 && percepcao <= 6.0) {
      return {
        title: "Baixo–Baixo: Potência em Latência",
        class: "baixo-baixo",
        text: "Comece com iniciativas de baixo risco, dupla de aprendizagem, observação estruturada de líderes e reflexão semanal guiada.",
      };
    }
    return {
      title: "Perfil Misto: Equilíbrio e Desenvolvimento",
      class: "misto",
      text: "Seu perfil mostra um equilíbrio entre competência e percepção. Identifique o eixo mais baixo para focar seu desenvolvimento ou o mais alto para alavancar suas forças.",
    };
  }

  // --- FUNÇÃO RENDER ATUALIZADA ---
  function render() {
    const userName = document.getElementById("userName").value;
    if (!userName.trim()) {
      alert("Por favor, insira seu nome para gerar o mapa.");
      return;
    }

    for (let i = 1; i <= 24; i++) {
      if (getInputValue(`q${i}`) === 0) {
        alert(`Por favor, selecione uma nota para a questão de número ${i}.`);
        return;
      }
    }

    const resultsCard = document.getElementById("resultsCard");
    resultsCard.style.display = "block";
    document.getElementById("resultsTitle").innerHTML = `Mapa e Recomendações de <span class="highlight-name">${userName}</span>`;
    const scores = calculateScores();
    const interpretacoesDiv = document.getElementById("interpretacoes");
    interpretacoesDiv.innerHTML = "";

    for (let i = 0; i < labels.length; i++) {
      const compScore = scores.competencia[i];
      const percScore = scores.percepcao[i];
      const interpretation = getInterpretation(compScore, percScore);
      const card = document.createElement("div");
      card.className = `interpretacao-card ${interpretation.class}`;
      card.innerHTML = `<h4>${labels[i]}</h4><p><strong>Perfil: ${interpretation.title}</strong><br>${interpretation.text}</p>`;
      interpretacoesDiv.appendChild(card);
    }

    if (chart) {
      chart.destroy();
    }

    // ---- LÓGICA ATUALIZADA PARA ESCOLHER TIPO E OPÇÕES DO GRÁFICO ----
    const isMobile = window.innerWidth <= 768;
    const chartType = isMobile ? "bar" : "radar";
    let chartOptions;

    if (isMobile) {
      // Opções para o Gráfico de Barras Horizontais (Mobile)
      chartOptions = {
        indexAxis: "y", // Eixo principal se torna o Y, criando barras horizontais
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.8, // Proporção para mobile, pode ajustar se necessário
        scales: {
          x: {
            beginAtZero: true,
            min: 0,
            max: 10,
            ticks: { color: "white" },
            grid: { color: "rgba(148, 163, 184, 0.2)" },
          },
          y: {
            ticks: { color: "white", font: { size: 11 } },
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#e2e8f0", font: { size: 12 } },
          },
        },
      };
    } else {
      // Opções para o Gráfico de Radar (Desktop)
      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 10,
            ticks: { stepSize: 2, backdropColor: "rgba(0,0,0,0)", color: "white" },
            pointLabels: { font: { size: 13 }, color: "#e2e8f0" },
            grid: { color: "rgba(148, 163, 184, 0.2)" },
            angleLines: { color: "rgba(148, 163, 184, 0.2)" },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#e2e8f0", font: { size: 14 } },
          },
        },
      };
    }
    // ---- FIM DA LÓGICA ATUALIZADA ----

    chart = new Chart(ctx, {
      type: chartType, // Usa o tipo de gráfico dinâmico ('bar' ou 'radar')
      data: {
        labels,
        datasets: [
          {
            label: "Competência (interno)",
            data: scores.competencia,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
          },
          {
            label: "Percepção (externo)",
            data: scores.percepcao,
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            borderColor: "rgb(34, 197, 94)",
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    });

    resultsCard.scrollIntoView({ behavior: "smooth" });
  }

  document.getElementById("btnRender").addEventListener("click", render);

  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("questionario").reset();
    document.getElementById("userName").value = "";
    const resultsCard = document.getElementById("resultsCard");
    if (resultsCard) {
      resultsCard.style.display = "none";
    }
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });

  document.getElementById("btnExport").addEventListener("click", () => {
    const resultsCard = document.getElementById("resultsCard");
    if (!chart || resultsCard.style.display === "none") {
      alert("Gere o mapa antes de exportar.");
      return;
    }

    html2canvas(resultsCard, {
      backgroundColor: "#121821",
      scale: 2,
    }).then((canvas) => {
      const userName = document.getElementById("userName").value || "usuario";
      const formattedName = userName.trim().toLowerCase().replace(/\s+/g, "_");

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png", 1.0);
      a.download = `mapa_lideranca_${formattedName}.png`;
      a.click();
      a.remove();
    });
  });
});
