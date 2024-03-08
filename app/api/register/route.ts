import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import fs from 'fs';
var crypto = require('crypto');

// Supabase setup
const supabaseUrl = 'https://imhygltdhfgpyyvbwmps.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY;

// Ensure the SUPABASE_API_KEY environment variable is set
if (!supabaseKey) {
    throw new Error('Supabase API key not provided in environment variable SUPABASE_API_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// POST request handler
export async function POST(request: Request): Promise<Response> {
    try {
        // Assuming the MIDI file is uploaded as form-data with key 'midi'
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            return new Response("Please provide both username and password", { status: 400 });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); 

        const { data, error } = await supabase.from('users').insert([{ username: username, password_hash: hash, password_salt: salt }]);

        if (error) {
            if(error.message.substring(0, 3) == "dup"){
                return new Response("Username Taken", { status: 500 });
            }
            return new Response(error.message, { status: 500 });
        }

        return new Response("New user has been stored in Supabase database", { status: 200 });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response("An unknown error occurred", { status: 500 });
        }
    }
}