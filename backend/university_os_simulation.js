const express = require('express');
const app = express();
const PORT = 3005;

// ============================================================================
// PART 1: The University Management System Backend (Mock Services)
// ============================================================================

app.get('/student-registration', (req, res) => {
    // P1: CPU-intensive, periodic bursts
    console.log('[P1] Executing Student Registration...');
    let result = 0;
    for(let i = 0; i < 10000000; i++) { result += i; } // Simulate CPU work
    res.json({ service: 'P1: Student Registration', status: 'Success', type: 'CPU-intensive' });
});

app.get('/database-backup', (req, res) => {
    // P2: I/O intensive, long-running
    console.log('[P2] Starting Database Backup...');
    setTimeout(() => { // Simulate I/O wait
        res.json({ service: 'P2: Database Backup', status: 'Completed', type: 'I/O-intensive' });
    }, 3000); 
});

app.get('/attendance-tracking', (req, res) => {
    // P3: Interactive, high priority
    console.log('[P3] Real-time Attendance Tracked');
    res.json({ service: 'P3: Attendance Tracking', status: 'Logged instantly', type: 'Interactive' });
});

app.get('/report-generation', (req, res) => {
    // P4: Batch processing, medium priority
    console.log('[P4] Generating Report in batch...');
    setTimeout(() => {
        res.json({ service: 'P4: Report Generation', status: 'Report Ready', type: 'Batch' });
    }, 1500);
});

// P5: Security monitoring daemon (Runs continuously)
setInterval(() => {
    console.log('[P5 - Background Daemon] Security monitoring check clear...');
}, 5000);


// ============================================================================
// PART 2: The OS Scheduler Simulator (Answers Task A of your prompt)
// ============================================================================
app.get('/simulate-scheduler', (req, res) => {
    // We assume realistic burst times since they were missing in the prompt
    const processes = [
        { id: 'P3', name: 'Attendance', priority: 1, burst: 5, remaining: 5, arrival: 0 },
        { id: 'P5', name: 'Security', priority: 2, burst: 25, remaining: 25, arrival: 0 },
        { id: 'P1', name: 'Registration', priority: 3, burst: 15, remaining: 15, arrival: 0 },
        { id: 'P4', name: 'Report', priority: 4, burst: 10, remaining: 10, arrival: 0 },
        { id: 'P2', name: 'Backup', priority: 5, burst: 20, remaining: 20, arrival: 0 }
    ];

    let time = 0;
    let completed = 0;
    let contextSwitches = 0;
    let ganttChart = [];
    let currentProcess = null;

    while (completed < processes.length && time < 100) {
        // Find highest priority ready process
        let nextProcess = null;
        let highestPri = Infinity;
        
        processes.forEach(p => {
            if (p.remaining > 0 && p.priority < highestPri) {
                highestPri = p.priority;
                nextProcess = p;
            }
        });

        if (nextProcess) {
            // If switching to a new process (and it's not the very first ms)
            if (currentProcess && currentProcess.id !== nextProcess.id && currentProcess.remaining > 0) {
                ganttChart.push({ time: `${time}ms - ${time + 1}ms`, event: 'Context Switch' });
                time += 1;
                contextSwitches++;
            }

            currentProcess = nextProcess;
            let startExec = time;
            
            // Execute for 1 ms
            currentProcess.remaining -= 1;
            time += 1;

            // Log continuous execution blocks
            let lastLog = ganttChart[ganttChart.length - 1];
            if (lastLog && lastLog.event === currentProcess.id) {
                lastLog.time = `${parseInt(lastLog.time.split('ms')[0])}ms - ${time}ms`;
            } else {
                ganttChart.push({ time: `${startExec}ms - ${time}ms`, event: currentProcess.id });
            }

            if (currentProcess.remaining === 0) {
                currentProcess.completion = time;
                currentProcess.turnaround = time - currentProcess.arrival;
                currentProcess.wait = currentProcess.turnaround - currentProcess.burst;
                completed++;
                currentProcess = null;
            }
        } else {
            break;
        }
    }

    res.json({
        message: "Scheduler Simulation Completed (Results based on hypothetical burst times)",
        totalContextSwitches: contextSwitches,
        ganttChart: ganttChart,
        processMetrics: processes.map(p => ({
            id: p.id,
            status: p.remaining === 0 ? 'Completed' : 'Starved',
            waitingTime: p.remaining === 0 ? `${p.wait} ms` : 'N/A',
            turnaroundTime: p.remaining === 0 ? `${p.turnaround} ms` : 'N/A'
        }))
    });
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`University Management System & Scheduler Simulator running!`);
    console.log(`API is available at: http://localhost:${PORT}`);
    console.log(`- Test P1: http://localhost:${PORT}/student-registration`);
    console.log(`- Test P2: http://localhost:${PORT}/database-backup`);
    console.log(`- Test P3: http://localhost:${PORT}/attendance-tracking`);
    console.log(`- Test P4: http://localhost:${PORT}/report-generation`);
    console.log(`- Run Scheduler Sim: http://localhost:${PORT}/simulate-scheduler`);
    console.log(`=======================================================`);
});
