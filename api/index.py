import os
from supabase import create_client, Client
from public.MidiToTabs import run_main
from http.server import BaseHTTPRequestHandler
import cgi
import io
from contextlib import redirect_stdout

# Supabase setup
supabase_url = 'https://imhygltdhfgpyyvbwmps.supabase.co'
supabase_key = os.environ.get('SUPABASE_API_KEY')

# Ensure the SUPABASE_API_KEY environment variable is set
if not supabase_key:
    raise ValueError('Supabase API key not provided in environment variable SUPABASE_API_KEY')

supabase: Client = create_client(supabase_url, supabase_key)


class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return
    

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

                # Run MidiToTabs.py with file written into a path
                f = io.StringIO()
                with redirect_stdout(f):
                    run_main(["MidiToTabs.py", file_path, channel_selected, tuning_offset, capo_offset])
                response = f.getvalue()
                supabase_response = (supabase.table("tabs").insert({"name": file_item.filename.replace(".mid", "").replace("-", " ").replace("_", " "), "tab": response}).execute())
                print(supabase_response)
                tab_id = supabase_response.data[0]['id']
                print(tab_id)
                response += "\ntab_id: " + str(tab_id)

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
