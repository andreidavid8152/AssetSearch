document.addEventListener("DOMContentLoaded", () => {
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

  async function fetchResults(domain) {
    try {
      const response = await fetch(`http://localhost:9000/search?domain=${domain}`);
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
      const card = createCard(item);
      resultsContainer.appendChild(card);
    });
  }

  function createCard(item) {
    const card = document.createElement("a");
    card.href = item.data;
    card.target = "_blank";
    card.classList.add(
      "flex",
      "flex-col",
      "md:flex-row",
      "bg-gray-800",
      "border",
      "border-gray-700",
      "rounded-lg",
      "shadow",
      "hover:bg-gray-700",
      "transition-colors",
      "w-full",
      "mb-4",
      "overflow-x-auto"
    );

    const img = document.createElement("img");
    img.classList.add(
      "object-cover",
      "w-full",
      "h-48",
      "md:h-auto",
      "md:w-48",
      "md:rounded-none",
      "rounded-t-lg",
      "md:rounded-l-lg"
    );
    img.src = getImageForCategory(item.function_category);
    img.alt = item.function_category;
    card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("flex", "flex-col", "justify-between", "p-4", "leading-normal", "w-full");

    const title = document.createElement("h5");
    title.classList.add("mb-2", "text-base", "font-bold", "tracking-tight", "text-white", "whitespace-nowrap");
    title.textContent = item.data;
    cardBody.appendChild(title);

    const description = document.createElement("p");
    description.classList.add("mb-3", "font-normal", "text-gray-400", "truncate");
    description.textContent = `Valoración General: ${item.general_valuation}`;
    cardBody.appendChild(description);

    const labelsContainer = document.createElement("div");
    labelsContainer.classList.add("flex", "space-x-2", "mb-4");

    const functionCategoryElement = document.createElement("span");
    functionCategoryElement.classList.add(
      "bg-red-600",
      "text-white",
      "px-2",
      "py-1",
      "rounded-full",
      "text-xs",
      "uppercase",
      "font-semibold",
      "truncate"
    );
    functionCategoryElement.textContent = item.function_category;
    labelsContainer.appendChild(functionCategoryElement);

    const dataTypeCategoryElement = document.createElement("span");
    dataTypeCategoryElement.classList.add(
      "bg-green-600",
      "text-white",
      "px-2",
      "py-1",
      "rounded-full",
      "text-xs",
      "uppercase",
      "font-semibold",
      "truncate"
    );
    dataTypeCategoryElement.textContent = item.data_type_category;
    labelsContainer.appendChild(dataTypeCategoryElement);

    cardBody.appendChild(labelsContainer);
    card.appendChild(cardBody);

    return card;
  }


  function getImageForCategory(category) {
    const images = {
      "Servidor de Bases de Datos": "https://i.ibb.co/Vjy1BLT/base-de-datos.webp",
      "Servidor de Aplicaciones": "https://via.placeholder.com/150/008000/FFFFFF?text=PÚBLICOS",
      "Servidor de Correo": "https://via.placeholder.com/150/FF0000/FFFFFF?text=CORREOS",
      "Servidor Web": "https://i.ibb.co/4svwnMB/DALL-E-2024-07-08-10-41-46-A-modern-and-sleek-webpage-design-on-a-large-monitor-The-webpage-features.webp",
    };
    return images[category] || "https://via.placeholder.com/150/000000/FFFFFF?text=DEFAULT";
  }

  function displayError() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML =
      "<p class='text-red-400 text-center bg-gray-700 p-4 rounded'>Ocurrió un error al buscar los resultados. Por favor, intenta nuevamente.</p>";
  }
});
