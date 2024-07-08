const { G4F } = require("g4f");
const g4f = new G4F();

const messages = [
    { role: "system", content: "You are an AI assistant." },
    {
        role: "user",
        content: `Clasifica las siguientes URLs:\n\n<PLACEHOLDER_JSON_DATA>\n\n
            Por favor, clasifica las URLs según su función y tipo de datos. 
            Las categorías de función pueden incluir: 
            - Servidor Bases de Datos
            - Servidor Aplicaciones
            - Servidor Correo
            - Servidor Web
            - Contactos
            - Archivos

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
            - Extrema: daño extremadamente grave
            - Muy alta: daño muy grave
            - Alta: daño grave
            - Media: daño importante
            - Baja: daño menor
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