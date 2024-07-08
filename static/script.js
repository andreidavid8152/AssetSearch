document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const domainInput = document.getElementById("domainInput");

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const domain = domainInput.value;
      if (domain) {
        window.location.href = `results.html?domain=${domain}`;
      } else {
        alert("Por favor, ingresa un dominio.");
      }
    });
  } else {
    const params = new URLSearchParams(window.location.search);
    const domain = params.get("domain");
    if (domain) {
      fetchResults(domain)
        .then(displayResults)
        .catch((error) => {
          console.error("Error displaying results:", error);
          displayError();
        });
    }
  }

  async function fetchResults(domain) {
    try {
      const response = await fetch(
        `http://localhost:5000/search?domain=${domain}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching results:", error);
      return null;
    }
  }

  function displayResults(data) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (!data) {
      displayError();
      return;
    }

    // Procesa las categorías de función
    displayCategory(
      "Categorías de Función",
      data.function_categories,
      resultsContainer
    );

    // Procesa las categorías de tipo de datos
    displayCategory(
      "Categorías de Tipo de Datos",
      data.data_type_categories,
      resultsContainer
    );

    // Procesa las categorías de sensibilidad
    displayCategory(
      "Categorías de Sensibilidad",
      data.sensitivity_categories,
      resultsContainer
    );
  }

  function displayCategory(title, categoryData, container) {
    if (Object.keys(categoryData).length > 0) {
      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = title;
      container.appendChild(categoryTitle);

      Object.entries(categoryData).forEach(([category, items]) => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");

        const categoryTitle = document.createElement("h3");
        categoryTitle.textContent = category;
        categoryContainer.appendChild(categoryTitle);

        items.forEach((item) => {
          const itemElement = createItemElement(item, category);
          categoryContainer.appendChild(itemElement);
        });

        container.appendChild(categoryContainer);
      });
    }
  }

  function createItemElement(item, category) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("result-item");

    if (category === "application_servers" || category === "mail_servers") {
      const title = item.title || "Sin título";
      const link = item.link || "#";
      itemElement.innerHTML = `
                <h4>${title}</h4>
                <a href="${link}" target="_blank">${link}</a>
            `;
    } else if (category === "dns_info") {
      itemElement.innerHTML = `
                <h4>DNS Info</h4>
                <p>${item.dns_info.join(", ")}</p>
            `;
    } else if (category === "whois_info") {
      const domainName = item.domainName || "Desconocido";
      itemElement.innerHTML = `
                <h4>Whois Info</h4>
                <p>Dominio: ${domainName}</p>
            `;
    } else {
      itemElement.textContent = JSON.stringify(item, null, 2);
    }

    return itemElement;
  }

  function displayError() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML =
      "<p>Ocurrió un error al buscar los resultados. Por favor, intenta nuevamente.</p>";
  }
});
