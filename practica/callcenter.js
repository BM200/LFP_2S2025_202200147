const fs = require("fs");
// Clase Llamada

class Llamada {
    constructor(idOperador, nombreOperador, estrellas, idCliente, nombreCliente) {
        this.idOperador = idOperador;
        this.nombreOperador = nombreOperador;
        this.estrellas = estrellas; // valor numérico (0-5)
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
    }

    clasificacion() {
        if (this.estrellas >= 4) return "Buena";
        if (this.estrellas >= 2) return "Media";
        return "Mala";
    }
}

// =======================
// Clase Operador
// =======================
class Operador {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.llamadas = [];
    }

    agregarLlamada(llamada) {
        this.llamadas.push(llamada);
    }

    calcularRendimiento(totalLlamadas) {
        if (totalLlamadas === 0) return 0;
        return (this.llamadas.length / totalLlamadas) * 100;
    }
}

// =======================
// Clase Cliente
// =======================
class Cliente {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.llamadas = [];
    }

    agregarLlamada(llamada) {
        this.llamadas.push(llamada);
    }
}

// =======================
// Clase CallCenter (gestión)
// =======================
class CallCenter {
    constructor() {
        this.llamadas = [];
        this.operadores = {};
        this.clientes = {};
    }

    // Cargar registros desde .csv (cadena ya leída)
    cargarCSV(texto) {
        const lineas = texto.trim().split("\n");

        for (let i = 1; i < lineas.length; i++) { // ignorar cabecera
            const fila = lineas[i].split(",");

            let idOperador = fila[0].trim();
            let nombreOperador = fila[1].trim();
            let estrellasCadena = fila[2].trim();
            let idCliente = fila[3].trim();
            let nombreCliente = fila[4].trim();

            // Contar "x" para estrellas
            let estrellasPartes = estrellasCadena.split(";");
            let estrellas = 0;
            for (let valor of estrellasPartes) {
                if (valor === "x") estrellas++;
            }

            const llamada = new Llamada(idOperador, nombreOperador, estrellas, idCliente, nombreCliente);
            this.llamadas.push(llamada);

            // Operadores
            if (!this.operadores[idOperador]) {
                this.operadores[idOperador] = new Operador(idOperador, nombreOperador);
            }
            this.operadores[idOperador].agregarLlamada(llamada);

            // Clientes
            if (!this.clientes[idCliente]) {
                this.clientes[idCliente] = new Cliente(idCliente, nombreCliente);
            }
            this.clientes[idCliente].agregarLlamada(llamada);
        }
    }

    // Reportes básicos
    historial() {
        return this.llamadas.map(l => `${l.idOperador} - ${l.nombreOperador} → ${l.nombreCliente} (${l.estrellas} estrellas)`);
    }

    listadoOperadores() {
        return Object.values(this.operadores).map(o => `${o.id} - ${o.nombre}`);
    }

    listadoClientes() {
        return Object.values(this.clientes).map(c => `${c.id} - ${c.nombre}`);
    }

    rendimientoOperadores() {
        const total = this.llamadas.length;
        return Object.values(this.operadores).map(o => ({
            id: o.id,
            nombre: o.nombre,
            rendimiento: o.calcularRendimiento(total).toFixed(2) + "%"
        }));
    }
    //reporte: porcentaje de clasificacion de llamadas/ segun las indicaciones
    // buena(4-5), media(2-3), mala(0-1
    porcentajeClasificacion(){
        let buenas=0, medias =0, malas=0;
        
        for (let llamada of this.llamadas){
            const clasif = llamada.clasificacion();
            if(clasif === "Buena") buenas++;
            else if (clasif ==="Media")medias++;
            else malas++;
        }
        
        const total = this.llamadas.length;
        return{
            buenas: ((buenas/total)*100).toFixed(2)+ "%",
            medias: ((medias/total)*100).toFixed(2)+ "%",
            malas:((malas/total)*100).toFixed(2)+ "%"

        };

    }
    cantidadPorcalificacion(){
        let conteo= {1:0, 2:0, 3:0, 4:0, 5:0};

        for(let llamada of this.llamadas){
            if(llamada.estrellas >=1 && llamada.estrellas <=5){
                conteo[llamada.estrellas]++;
            }
        }
        return conteo; 
    }

    generarTablaHTML(titulo, encabezados, filas, nombreArchivo){
        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titulo}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
            <div class="container mt-4">
                <h2 class="text-center mb-4">${titulo}</h2>
                <table class="table table-striped table-bordered">
                    <thead class="table-dark">
                        <tr>
                            ${encabezados.map(h => `<th>${h}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${filas.map(f => `<tr>${f.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
                    </tbody>
                </table>
            </div>
        </body>
        </html>`;

        fs.writeFileSync(`./reporte/${nombreArchivo}.html`, html, "utf8");
        console.log(`📝Reporte generado: reporte/${nombreArchivo}.html`);
    }
    //Reporte 2: Historial llamadas. 
    exportarHistorial(){
        const encabezados =["ID Operador", "Nombre Operador", "Estrellas", "ID Cliente", "Nombre Cliente" ];
        const filas = this.llamadas.map(l => [
            l.idOperador, l.nombreOperador, l.estrellas, l.idCliente, l.nombreCliente
        ]);
        this.generarTablaHTML("Historial de Llamadas", encabezados, filas, "historial");
    }
    //reporte 3: listado de operadores
    exportarOperadores(){
        const encabezados=["ID Operador", "Nombre Operador"];
        const filas = Object.values(this.operadores).map(o => [o.id, o.nombre]);
        this.generarTablaHTML("Listado de Operadores", encabezados, filas, "operadores");

    }

    //reporte 4: listado de clientes. 
    exportarClientes(){
        const encabezados = ["ID Cliente", "Nombre Cliente"];
        const filas = Object.values(this.clientes).map(c =>[c.id, c.nombre]);
        this.generarTablaHTML("Listado de Clientes", encabezados, filas, "clientes");
    
    }
    //Reporte 5 rendimiento de OPERADORES 
    exportarRendimiento(){
        const total= this.llamadas.length;
        const encabezados=["ID Operador", "Nombre Operador", "Rendimiento"];
        const filas = Object.values(this.operadores).map(o =>[
            o.id,
            o.nombre, 
            o.calcularRendimiento(total).toFixed(2) + "%"
        ]);
        this.generarTablaHTML("Rendimiento de Operadores", encabezados, filas, "rendimiento");
    }
}



module.exports = { CallCenter };
