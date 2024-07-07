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
            fetchResults(domain).then(displayResults);
        }
    }

    async function fetchResults(domain) {
        try {
            const response = await fetch(`/search?domain=${domain}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Error fetching results:", error);
            return [];
        }
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";
        if (results.length > 0) {
            results.forEach(result => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");
                resultItem.innerHTML = `
                    <h3>${result.title}</h3>
                    <p>${result.description}</p>
                `;
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        }
    }
});