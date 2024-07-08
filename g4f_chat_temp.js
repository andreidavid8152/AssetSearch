const { G4F } = require("g4f");
const g4f = new G4F();

const messages = [
    { role: "system", content: "You are an AI assistant." },
    {
        role: "user",
        content: `Clasifica las siguientes URLs:\n\n[{"data": "https://www.udla.edu.ec/app/pardot/wp-content/uploads/2022/05/Quebec-declaration.pdf"}, {"data": "https://www.udla.edu.ec/app/pardot/wp-content/uploads/2022/05/Ingles-Decalogue-of-the-CONSCIOUS-TRAVELER-ENG.pdf"}]\n\n
Por favor, clasifica las URLs según su función y tipo de datos. 
Las categorías de función pueden incluir: 
- Servidores de Bases de Datos
- Servidores de Aplicaciones
- Servidores de Correo
- Páginas Web
- Contactos
- Archivos
- Otros

Las categorías de tipo de datos pueden incluir: 
- Datos Sensibles
- Datos Confidenciales
- Datos Públicos

Devuelve los resultados en el siguiente formato:
{
    "data": "<URL>",
    "function_category": "<Categoría de Función>",
    "data_type_category": "<Categoría de Tipo de Datos>"
},
`,
    },
];

g4f.chatCompletion(messages).then((response) => {
    console.log(response);
});
