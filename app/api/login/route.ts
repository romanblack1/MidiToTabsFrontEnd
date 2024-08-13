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
        console.log(supabaseKey)
        // Assuming the MIDI file is uploaded as form-data with key 'midi'
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            return new Response("Please provide both username and password", { status: 400 });
        }

        const { data, error } = await supabase.from('users').select('password_hash, password_salt').eq('username', username).single(); 
        if (error) {
            if(error.message == "JSON object requested, multiple (or no) rows returned"){
                return new Response("Username or password incorrect", { status: 401 });
            }
            return new Response(error.message + ", database query", { status: 500 });
        }
        const hashFromUserInput = crypto.pbkdf2Sync(password, data.password_salt, 1000, 64, `sha512`).toString(`hex`);
        if(hashFromUserInput == data.password_hash){
            return new Response("Logged In Successfully!", { status: 200 });
        }else{
            return new Response("Username or password incorrect", { status: 401 });
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return new Response(error.message + ", overall post error", { status: 500 });
        } else {
            return new Response("An unknown error occurred", { status: 500 });
        }
    }
}