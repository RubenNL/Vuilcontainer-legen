from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json
class S(BaseHTTPRequestHandler):
	def _set_response(self):
		self.send_response(200)
		self.send_header('Content-type', 'application/json')
		self.end_headers()

	def do_POST(self):
		content_length = int(self.headers['Content-Length'])
		post_data = self.rfile.read(content_length)
		jsondata=post_data.decode('utf-8')
		data=json.loads(jsondata)
		#-------------------------------------------------------dit heb ik zelf gemaakt--------------------------------
		responsedata={'method':'sendMessage','chat_id':data['message']['chat']['id'],'text':"hoi! dit is wat ik heb ontvangen:"+data['message']['text']}
		jsonresponse=json.dumps(responsedata)
		#-------------------------------------------------------dit heb ik zelf gemaakt--------------------------------
		self._set_response()
		self.wfile.write(jsonresponse.encode('utf-8'))

def run(server_class=HTTPServer, handler_class=S, port=1234):
	server_address = ('', port)
	httpd = server_class(server_address, handler_class)
	try:
		print('server gestart op port '+port)
		httpd.serve_forever()
	except KeyboardInterrupt:
		pass
	httpd.server_close()
	logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run() 
