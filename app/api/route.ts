import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import fs from 'fs';

// Supabase setup
const supabaseUrl = 'https://imhygltdhfgpyyvbwmps.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY;

// Ensure the SUPABASE_API_KEY environment variable is set
if (!supabaseKey) {
    throw new Error('Supabase API key not provided in environment variable SUPABASE_API_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to execute Python script
function runPythonScript(midiFilePath: string, channelNumber: string, tuningOffset: string, capoOffset: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Spawn a new process to execute the Python script
        const pythonProcess = spawn('python', ['MidiToTabs.py', midiFilePath, channelNumber, tuningOffset, capoOffset]);

        // Initialize an empty string to store the output data
        let outputData = '';

        // Event listener for standard output (stdout) data from the Python process
        pythonProcess.stdout.on('data', (data) => {
            // Append the received data to the outputData string
            outputData += data.toString();
        });

        // Event listener for standard error (stderr) data from the Python process
        pythonProcess.stderr.on('data', (data) => {
            // Log any errors encountered during execution
            console.error(`Error executing Python script: ${data}`);
            // Reject the Promise with the error message
            reject(data.toString());
        });

        // Event listener for when the Python process exits
        pythonProcess.on('close', (code) => {
            // If the process exits with code 0 (indicating success)
            if (code === 0) {
                // Resolve the Promise with the collected output data
                resolve(outputData);
            } else {
                // Otherwise, reject the Promise with an error message
                reject(`Python script process exited with code ${code}`);
            }
        });
    });
}

// POST request handler
export async function POST(request: Request): Promise<Response> {
    try {
        // Assuming the MIDI file is uploaded as form-data with key 'midi'
        const formData = await request.formData();
        const midiFile = formData.get('midiFile');
        const channelSelectedEntry = formData.get('channelSelected');
        const tuningOffsetEntry = formData.get('tuningOffset');
        const capoOffsetEntry = formData.get('capoOffset');

        if (!midiFile || !(midiFile instanceof File)) {
            return new Response("No MIDI file found in the request", { status: 400 });
        }

        // Save the MIDI file to a temporary location (if needed)
        // For example:
        const midiFilePath = './temp_files/file.mid';
        // Convert the File object to a Buffer
        const buffer = await midiFile.arrayBuffer();

        // Write the Buffer to the specified file path
        fs.writeFileSync(midiFilePath, Buffer.from(buffer));

        const channelSelected = channelSelectedEntry as string;
        const tuningOffset = tuningOffsetEntry as string;
        const capoOffset = capoOffsetEntry as string;

        // Process MIDI file using Python script
        const generatedText = await runPythonScript(midiFilePath, channelSelected, tuningOffset, capoOffset);

        // Store generated text in Supabase database
        const { data, error } = await supabase.from('tabs').insert([{ tab: generatedText }]);

        if (error) {
            return new Response(error.message, { status: 500 });
        }

        return new Response(generatedText, { status: 200 });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response("An unknown error occurred", { status: 500 });
        }
    }
}

