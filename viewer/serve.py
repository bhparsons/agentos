#!/usr/bin/env python3
"""Minimal server for the conversation reviewer UI."""

import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "ecommerce-transcripts.jsonl"
VIEWER_DIR = Path(__file__).resolve().parent

_conversations = None

def load_conversations():
    global _conversations
    if _conversations is None:
        _conversations = []
        with open(DATA_PATH) as f:
            for line in f:
                line = line.strip()
                if line:
                    _conversations.append(json.loads(line))
    return _conversations


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(VIEWER_DIR), **kwargs)

    def do_GET(self):
        if self.path == "/api/conversations":
            convos = load_conversations()
            # Return lightweight list (no turns) for sidebar
            summary = []
            for c in convos:
                summary.append({k: v for k, v in c.items() if k != "turns"})
            self._json_response(summary)
        elif self.path.startswith("/api/conversations/"):
            conv_id = self.path.split("/api/conversations/")[1]
            convos = load_conversations()
            match = next((c for c in convos if c["conversation_id"] == conv_id), None)
            if match:
                self._json_response(match)
            else:
                self.send_error(404, "Conversation not found")
        else:
            super().do_GET()

    def _json_response(self, data):
        body = json.dumps(data).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(("localhost", port), Handler)
    print(f"Serving at http://localhost:{port}")
    server.serve_forever()
