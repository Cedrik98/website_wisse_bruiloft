#!/usr/bin/env python3
"""Lokale preview van de site, met dezelfde adressen als GitHub Pages.

Start met:  python3 serve.py
Open dan:   http://localhost:8000

Nodig omdat de links geen .html meer bevatten: dit servertje zoekt bij
/programma vanzelf het bestand programma.html op, precies zoals GitHub Pages.
Dubbelklikken op index.html werkt dus niet meer voor het doorklikken.
"""

import http.server
import os
import socketserver

POORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        bestand = super().translate_path(path)
        if not os.path.exists(bestand) and os.path.isfile(bestand + '.html'):
            return bestand + '.html'
        return bestand

    def log_message(self, indeling, *args):
        pass  # geen ruis in de terminal


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True

    for poort in range(POORT, POORT + 20):        # 8000 bezet? dan de volgende
        try:
            server = socketserver.TCPServer(('', poort), Handler)
        except OSError:
            continue
        with server:
            print(f'De site staat op http://localhost:{poort}  (stoppen met Ctrl+C)', flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                print('\nGestopt.')
        break
    else:
        print('Geen vrije poort gevonden tussen 8000 en 8019.')
