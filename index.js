
    const express = require('express');
    const cron = require('node-cron');
    const { exec } = require('child_process');
    require('dotenv').config();

    const app = express();
    const port = process.env.PORT || 3777;

    function backupDatabase() {
        const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, BACKUP_PATH } = process.env;
        const backupFile = `${BACKUP_PATH}/Lasted_${new Date().toISOString().slice(0,10)}.sql`;

        // Construir el comando, omitiendo el parámetro de contraseña si está vacío
        const passwordPart = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
        const command = `C:\\xampp\\mysql\\bin\\mysqldump -h ${DB_HOST} -u ${DB_USER} ${passwordPart} ${DB_NAME} > ${backupFile}`;

        exec(command, (error, stdout, stderr) => {
           if (error) {
               console.error('Error al crear la copia de seguridad',error);
               return;
           }
           if (stderr){
               console.error('Error en el stderr',error);
               return;
           }
           console.info('Copia de seguridad completada con éxito!!!');
        });
    }

    /* ============> tarea programa a las - 2:21 del dia (Colombia)  <============ */
    cron.schedule('21 14 * * *', () =>{
            console.info('Ejecutando la copia de seguridad...');
            backupDatabase();
    },{
        schedule: true,
        timezone: 'America/Bogota',
        }
    );

    app.get('/', (req, res) => {
        res.send('Servidor de copias de seguridad...');
    });
    app.listen(port, () => {
        console.log(`Servidor corriendo, puerto: ${port}`);
    });