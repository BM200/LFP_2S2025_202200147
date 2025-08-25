const fs = require("fs");
const readline = require("readline");
const { CallCenter } = require("./callcenter");

const callcenter = new CallCenter();
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});

function menu(){
    console.log("\n===== MENÚ PRINCIPAL =====");
    console.log("1. Cargar Registros de Llamadas");
    console.log("2. Exportar Historial de Llamadas");
    console.log("3. Exportar Listado de Operadores");
    console.log("4. Exportar Listado de Clientes");
    console.log("5. Exportar Rendimiento de Operadores");
    console.log("6. Mostrar Porcentaje de Clasificacion");
    console.log("7. Mostrar Cantidad de Calificacion");
    console.log("8. Salir");
    console.log("\n==============================");

    rl.question("Seleccione una opción: ", (op) => {
        switch (op) {
            case "1":
                const data = fs.readFileSync("./data/llamadas.csv", "utf8");
                callcenter.cargarCSV(data);
                console.log("Archivo cargado con éxito.");
                menu();
                break;
            case "2":
                console.log(callcenter.historial());
                menu();
                break;
            case "3":
                console.log(callcenter.listadoOperadores());
                menu();
                break;
            case "4":
                console.log(callcenter.listadoClientes());
                menu();
                break;
            case "5":
                console.log(callcenter.rendimientoOperadores());
                menu();
                break;
            case "6":
                console.log(callcenter.porcentajeClasificacion());
                menu();
                break;
            case "7":
                console.log(callcenter.cantidadPorcalificacion());
                menu();
                break
            case "8":
                console.log("Saliendo....")
                rl.close();
                break;
            default:
                console.log("Opción inválida");
                menu();
        }
    });
}

menu();