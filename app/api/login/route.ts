import { createClient } from '@supabase/supabase-js';
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
            return new Response(JSON.stringify({ message: "Please provide both username and password" }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { data, error } = await supabase.from('users').select('id, password_hash, password_salt').eq('username', username).single(); 
        if (error) {
            if(error.message == "JSON object requested, multiple (or no) rows returned"){
                return new Response(JSON.stringify({ message: "Username or password incorrect" }), { 
                    status: 401, 
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response(error.message + ", database query", { status: 500 });
        }
        const hashFromUserInput = crypto.pbkdf2Sync(password, data.password_salt, 1000, 64, `sha512`).toString(`hex`);
        if(hashFromUserInput == data.password_hash){
            return new Response(JSON.stringify({ message: "Logged In Successfully!", userId: data.id }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' }
            });
        }else{
            return new Response(JSON.stringify({ message: "Username or password incorrect" }), { 
                status: 401, 
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message + ", overall post error" }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ message: "An unknown error occurred" }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
}