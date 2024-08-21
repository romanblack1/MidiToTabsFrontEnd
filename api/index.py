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

        # Handle different paths
        if parsed_path.path == "/get_all_tabs":
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
        
        elif parsed_path.path == "/get_my_tabs":
            # Get the userid from query parameters
            userid = query_params.get('userid', [None])[0]
            
            if userid:
                # Logic to get tabs specific to the userid from the database
                response = supabase \
                    .from_("usersSavedTabs") \
                    .select("""
                        userId,
                        tabs(id, created_at, tab, name, created_by),
                        users(username)
                    """) \
                    .eq("userId", int(userid)) \
                    .execute()

                if response.error:
                    print(f"Error: {response.error}")
                    return None

                my_tabs = json.dumps(response.data)
                
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
        
        else:
            # Handle unknown paths
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write("Not Found".encode('utf-8'))
    

    def do_POST(self):
        # Parse the form data posted
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                    'CONTENT_TYPE': self.headers['Content-Type'],
                    })

        # Check if the file field is present
        if 'midiFile' in form:
            file_item = form['midiFile']
            if file_item.filename:
                # Write the file into a path
                temp_dir = "/tmp/"
                if not os.path.exists(temp_dir):
                    os.makedirs(temp_dir)
                file_path = os.path.join(temp_dir, file_item.filename)
                with open(file_path, 'wb') as output_file:
                    output_file.write(file_item.file.read())

                # Get other form fields
                channel_selected = form.getvalue('channelSelected', 'Not Provided')
                tuning_offset = form.getvalue('tuningOffset', 'Not Provided')
                capo_offset = form.getvalue('capoOffset', 'Not Provided')
                userid = form.getvalue('userId')
                username = "anonymous"
                if userid != "null":
                    username = (supabase.table("users").select("username").eq("id", int(userid)).execute()).data[0]['username']

                # Run MidiToTabs.py with file written into a path
                f = io.StringIO()
                with redirect_stdout(f):
                    run_main(["MidiToTabs.py", file_path, channel_selected, tuning_offset, capo_offset])
                response = f.getvalue()
                supabase_response = (supabase.table("tabs").insert({"name": file_item.filename.replace(".mid", "").replace(".MID", "").replace("-", " ").replace("_", " "), "tab": response, "created_by": username}).execute())
                tab_id = supabase_response.data[0]['id']
                if userid != "null":
                    supabase.table("usersSavedTabs").insert({"userId": int(userid), "tabId": tab_id}).execute()

                # Send response to the client
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(response.encode('utf-8'))

            else:
                message = "No file was uploaded"
                # Send an error response
                self.send_response(400)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(message.encode('utf-8'))
