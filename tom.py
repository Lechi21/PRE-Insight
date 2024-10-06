const { spawn } = require('child_process');
    const python = spawn('python', ['path/to/script.py']);

    python.stdout.on('data', (data) => {
        console.log(`Data from Python: ${data}`);
});