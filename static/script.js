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

    displayCategory(
      "Categorías de Función",
      data.function_categories,
      resultsContainer
    );
    displayCategory(
      "Categorías de Tipo de Datos",
      data.data_type_categories,
      resultsContainer
    );
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
      categoryTitle.classList.add("text-2xl", "font-bold", "my-4");
      container.appendChild(categoryTitle);

      Object.entries(categoryData).forEach(([category, items]) => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container", "mb-6");

        const categoryTitle = document.createElement("h3");
        categoryTitle.textContent = category;
        categoryTitle.classList.add("text-xl", "font-semibold", "mb-2");
        categoryContainer.appendChild(categoryTitle);

        items.forEach((item) => {
          const itemElement = createItemElement(item, category);
          itemElement.classList.add(
            "p-4",
            "bg-gray-800",
            "rounded-lg",
            "shadow-md",
            "mb-4"
          );
          categoryContainer.appendChild(itemElement);
        });

        container.appendChild(categoryContainer);
      });
    }
  }

  function createItemElement(item, category) {
    const itemElement = document.createElement("div");

    if (item.title && item.link) {
      itemElement.innerHTML = `
        <h4 class="text-lg font-semibold">${item.title}</h4>
        <a href="${item.link}" target="_blank" class="text-blue-400">${item.link}</a>
      `;
    } else if (item.dns_info) {
      itemElement.innerHTML = `
        <h4 class="text-lg font-semibold">DNS Info</h4>
        <p>${item.dns_info.join(", ")}</p>
      `;
    } else if (item.domainName) {
      itemElement.innerHTML = `
        <h4 class="text-lg font-semibold">Whois Info</h4>
        <p>Dominio: ${item.domainName}</p>
      `;
    } else {
      itemElement.innerHTML = `
        <pre>${JSON.stringify(item, null, 2)}</pre>
      `;
    }

    return itemElement;
  }

  function displayError() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML =
      "<p class='text-red-400'>Ocurrió un error al buscar los resultados. Por favor, intenta nuevamente.</p>";
  }
});
