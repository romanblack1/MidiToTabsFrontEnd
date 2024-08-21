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
        # Parse the URL and the query parameters
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)

        # Logic to get all tabs from the database
        supabase_response = (supabase.table("tabs").select("*").execute())
        if supabase_response.error:
                print(f"Error: {supabase_response.error}")
                return None
        all_tabs = json.dumps(supabase_response.data)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(all_tabs.encode('utf-8'))