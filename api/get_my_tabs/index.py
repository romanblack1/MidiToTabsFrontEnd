import os
from supabase import create_client, Client
from public.MidiToTabs import run_main
from http.server import BaseHTTPRequestHandler
import cgi
import io
import json
from contextlib import redirect_stdout
from urllib.parse import urlparse, parse_qs


# Supabase setup
supabase_url = 'https://imhygltdhfgpyyvbwmps.supabase.co'
supabase_key = os.environ.get('SUPABASE_API_KEY')

# Ensure the SUPABASE_API_KEY environment variable is set
if not supabase_key:
    raise ValueError('Supabase API key not provided in environment variable SUPABASE_API_KEY')

supabase: Client = create_client(supabase_url, supabase_key)


class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        # Get the userid from query parameters
        user_id = query_params.get('user_id', [None])[0]
            
        if user_id:
            # Logic to get tabs specific to the userid from the database
            response = supabase \
                .from_("users_saved_tabs") \
                .select("tabs(id, created_at, tab, name, created_by)") \
                .eq("user_id", user_id) \
                .execute()

            my_tabs = json.dumps(response.data)
                
            print(response.data)

            print(my_tabs)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(my_tabs.encode('utf-8'))
        else:
            # If userid is not provided, return an error
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write("Missing userid parameter".encode('utf-8'))