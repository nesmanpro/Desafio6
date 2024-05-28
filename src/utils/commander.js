
import { Command } from 'commander';

const program = new Command();

//1 - Comando // 2 - La descripcion // 3 - Valor por default
program
    .option('-p <port>', 'Puerto en donde se inicia el servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'production')
program.parse();
//Finalizamos acá la configuración.
export default program;
