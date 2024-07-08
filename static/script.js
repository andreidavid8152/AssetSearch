document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const domainInput = document.getElementById("domainInput");
  const searchedDomainElement = document.getElementById("searchedDomain");
  const loadingElement = document.getElementById("loading");
  const loadingTextElement = document.getElementById("loadingText");

  const loadingMessages = ["Cargando activos...", "Analizando datos...", "Preparando resultados..."];
  let loadingMessageIndex = 0;

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
      if (searchedDomainElement) {
        searchedDomainElement.textContent = domain;
      }
      showLoading();
      fetchResults(domain)
        .then(displayResults)
        .catch((error) => {
          console.error("Error displaying results:", error);
          displayError();
        })
        .finally(hideLoading);
    }
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
    description.innerHTML = `<strong style="color: #cbcba4;">Valoración:</strong> ${item.general_valuation}`;
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
      "Servidor de Bases de Datos": "https://i.ibb.co/gJZfnCW/fsdfsfsfs-4.png",
      "Servidor de Aplicaciones": "https://i.ibb.co/Kxz1PbF/fsdfsfsfs-1.png",
      "Servidor de Correo": "https://i.ibb.co/xHsYLVT/fsdfsfsfs-2.png",
      "Servidor Web": "https://i.ibb.co/3c5xhQZ/fsdfsfsfs-3.png",
      "Contactos": "https://i.ibb.co/gPXmBGH/Dise-o-sin-t-tulo-1.png",
      "Archivos": "https://i.ibb.co/6wnq7Cc/Dise-o-sin-t-tulo.png",
    };
    return images[category] || "https://via.placeholder.com/150/000000/FFFFFF?text=DEFAULT";
  }

  function displayError() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML =
      "<p class='text-red-400 text-center bg-gray-700 p-4 rounded'>Ocurrió un error al buscar los resultados. Por favor, intenta nuevamente.</p>";
  }

  function showLoading() {
    loadingElement.classList.remove("hidden");
    updateLoadingText();
  }

  function hideLoading() {
    loadingElement.classList.add("hidden");
  }

  function updateLoadingText() {
    loadingTextElement.classList.remove("fade-in-up");
    void loadingTextElement.offsetWidth; // Trigger reflow to restart animation
    loadingTextElement.classList.add("fade-in-up");
    loadingTextElement.textContent = loadingMessages[loadingMessageIndex];
    loadingMessageIndex = (loadingMessageIndex + 1) % loadingMessages.length;
    setTimeout(updateLoadingText, 5000); // Cambiar mensaje cada 5 segundos
  }
});
