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
        `http://localhost:9000/search?domain=${domain}`
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

    data.forEach((item) => {
      const itemElement = createItemElement(item);
      itemElement.classList.add(
        "p-4",
        "bg-gray-800",
        "rounded-lg",
        "shadow-md",
        "mb-4"
      );
      resultsContainer.appendChild(itemElement);
    });
  }

  function createItemElement(item) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("p-4", "bg-gray-800", "rounded-lg", "shadow-md", "mb-4");

    const linkElement = document.createElement("a");
    linkElement.href = item.data;
    linkElement.target = "_blank";
    linkElement.classList.add("text-blue-400", "text-lg", "font-semibold", "block", "mb-2");
    linkElement.textContent = item.data;
    itemElement.appendChild(linkElement);

    const functionCategoryElement = document.createElement("span");
    functionCategoryElement.classList.add("bg-indigo-600", "text-white", "px-2", "py-1", "rounded", "mr-2");
    functionCategoryElement.textContent = item.function_category;
    itemElement.appendChild(functionCategoryElement);

    const dataTypeCategoryElement = document.createElement("span");
    dataTypeCategoryElement.classList.add("bg-green-600", "text-white", "px-2", "py-1", "rounded", "mr-2");
    dataTypeCategoryElement.textContent = item.data_type_category;
    itemElement.appendChild(dataTypeCategoryElement);

    const valuationElement = document.createElement("div");
    valuationElement.classList.add("mt-2", "text-yellow-400", "font-semibold");
    valuationElement.textContent = `Valoración General: ${item.general_valuation}`;
    itemElement.appendChild(valuationElement);

    return itemElement;
  }

  function displayError() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML =
      "<p class='text-red-400'>Ocurrió un error al buscar los resultados. Por favor, intenta nuevamente.</p>";
  }
});
