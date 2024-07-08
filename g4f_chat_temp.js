const { G4F } = require("g4f");
const g4f = new G4F();

const messages = [
    { role: "system", content: "You are an AI assistant." },
    {
        role: "user",
        content: `Clasifica las siguientes URLs:\n\n[{"data": "https://dspace.udla.edu.ec"}, {"data": "https://info.udla.edu.ec"}, {"data": "https://pizarra3d.udla.edu.ec"}, {"data": "https://bibliotecavirtual.udla.edu.ec"}, {"data": "https://ccpmaut.udla.edu.ec"}, {"data": "https://go.udla.edu.ec"}, {"data": "https://especialidadesmedicas.udla.edu.ec"}, {"data": "https://blogs.udla.edu.ec"}, {"data": "https://udla.edu.ec"}, {"data": "https://www.udla.edu.ec"}]\n\n
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

            Además, realiza una valoración general del activo basado en las siguientes categorías:
            - Disponibilidad
            - Integridad
            - Confidencialidad
            - Autenticidad
            - Trazabilidad

            Utiliza la siguiente escala para la valoración general:
            - Extremo: daño extremadamente grave
            - Muy alto: daño muy grave
            - Alto: daño grave
            - Medio: daño importante
            - Bajo: daño menor
            - Despreciable: irrelevante a efectos prácticos

            Devuelve los resultados en el siguiente formato:
            {
                "data": "<URL>",
                "function_category": "<Categoría de Función>",
                "data_type_category": "<Categoría de Tipo de Datos>",
                "general_valuation": "<Valoración General>"
            },
        `,
    },
];

g4f.chatCompletion(messages).then((response) => {
    console.log(response);
});