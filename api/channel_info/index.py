import os
from supabase import create_client, Client
from public.MidiToTabs import get_channel_info
from http.server import BaseHTTPRequestHandler
import cgi
import json

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

                sorted_channels = get_channel_info(file_path)
                response = json.dumps(sorted_channels)

                # Send response to the client
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(response.encode('utf-8'))

            else:
                message = "No file was uploaded"
                # Send an error response
                self.send_response(400)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(message.encode('utf-8'))
