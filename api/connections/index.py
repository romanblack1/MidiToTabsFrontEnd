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
 
    # create_connection
    def do_POST(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        # Get the userid from query parameters
        user_id = query_params.get('user_id', [None])[0]
        tab_id = query_params.get('tab_id', [None])[0]

        if user_id and tab_id:
            # Logic to get tabs specific to the userid from the database
            supabase_response = supabase.table("users_saved_tabs").insert({"user_id": int(userid), "tab_id": tab_id}).execute()

            connection_id = supabase_response.data[0]['id']

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(str(connection_id).encode('utf-8'))
        else:
            # If user_id or tab_id is not provided, return an error
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            if not user_id:
                self.wfile.write("Missing user_id parameter".encode('utf-8'))
            else:
                self.wfile.write("Missing tab_id parameter".encode('utf-8'))

    # delete_connection
    def do_DELETE(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        # Get the userid from query parameters
        user_id = query_params.get('user_id', [None])[0]
        tab_id = query_params.get('tab_id', [None])[0]

        if user_id and tab_id:
            # Logic to get tabs specific to the userid from the database
            supabase_response = supabase.table("users_saved_tabs").delete().eq("user_id", user_id).eq("tab_id", tab_id).execute()

            connection_id = supabase_response.data[0]['id']

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(str(connection_id).encode('utf-8'))
        else:
            # If user_id or tab_id is not provided, return an error
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            if not user_id:
                self.wfile.write("Missing user_id parameter".encode('utf-8'))
            else:
                self.wfile.write("Missing tab_id parameter".encode('utf-8'))