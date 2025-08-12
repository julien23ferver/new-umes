#!/usr/bin/env python3
"""
Serveur Hall of Fame simple pour le Cyber Dico
Serveur HTTP basique sans dépendances externes
"""

import json
import os
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime
import uuid
import threading

# Configuration
SCORES_FILE = 'scores.json'
PORT = 3000

def load_scores():
    """Charger les scores depuis le fichier JSON"""
    try:
        if os.path.exists(SCORES_FILE):
            with open(SCORES_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('scores', [])
        return []
    except Exception as e:
        print(f"Erreur lors du chargement des scores: {e}")
        return []

def save_scores(scores):
    """Sauvegarder les scores dans le fichier JSON"""
    try:
        data = {'scores': scores}
        with open(SCORES_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Erreur lors de la sauvegarde des scores: {e}")
        return False

def get_stats():
    """Calculer les statistiques"""
    scores = load_scores()
    
    if not scores:
        return {
            'totalScores': 0,
            'averageScore': 0,
            'topScore': 0,
            'totalPlayers': 0,
            'difficulties': {}
        }
    
    total_scores = len(scores)
    average_score = round(sum(s['score'] for s in scores) / total_scores)
    top_score = max(s['score'] for s in scores)
    unique_players = len(set(s['pseudo'] for s in scores))
    
    # Statistiques par difficulté
    difficulties = {}
    for score in scores:
        diff = score['difficulty']
        if diff not in difficulties:
            difficulties[diff] = {'count': 0, 'average': 0, 'total': 0}
        difficulties[diff]['count'] += 1
        difficulties[diff]['total'] += score['score']
    
    for diff in difficulties:
        difficulties[diff]['average'] = round(difficulties[diff]['total'] / difficulties[diff]['count'])
    
    return {
        'totalScores': total_scores,
        'averageScore': average_score,
        'topScore': top_score,
        'totalPlayers': unique_players,
        'difficulties': difficulties
    }

class HallOfFameHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Gérer les requêtes GET"""
        try:
            if self.path == '/':
                # Page d'accueil
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                with open('dico.html', 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
                    
            elif self.path == '/api/scores':
                # Obtenir tous les scores
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                scores = load_scores()
                scores.sort(key=lambda x: x['score'], reverse=True)
                response = {'scores': scores}
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                
            elif self.path == '/api/stats':
                # Obtenir les statistiques
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                stats = get_stats()
                self.wfile.write(json.dumps(stats, ensure_ascii=False).encode('utf-8'))
                
            elif self.path.startswith('/'):
                # Servir les fichiers statiques
                filename = self.path[1:]  # Enlever le slash initial
                if os.path.exists(filename):
                    self.send_response(200)
                    
                    # Déterminer le type MIME
                    if filename.endswith('.html'):
                        content_type = 'text/html'
                    elif filename.endswith('.js'):
                        content_type = 'application/javascript'
                    elif filename.endswith('.css'):
                        content_type = 'text/css'
                    elif filename.endswith('.png'):
                        content_type = 'image/png'
                    elif filename.endswith('.jpg') or filename.endswith('.jpeg'):
                        content_type = 'image/jpeg'
                    else:
                        content_type = 'text/plain'
                    
                    self.send_header('Content-type', content_type)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    with open(filename, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'File not found')
                    
        except Exception as e:
            print(f"Erreur GET: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def do_POST(self):
        """Gérer les requêtes POST"""
        try:
            if self.path == '/api/scores':
                # Ajouter un nouveau score
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    error_response = {'error': 'Données JSON invalides'}
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
                    return
                
                # Validation des données
                if 'pseudo' not in data or not data['pseudo'] or not data['pseudo'].strip():
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    error_response = {'error': 'Le pseudo est obligatoire'}
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
                    return
                
                if 'score' not in data or not isinstance(data['score'], (int, float)) or data['score'] < 0:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    error_response = {'error': 'Score invalide'}
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
                    return
                
                # Créer le nouveau score
                new_score = {
                    'id': str(uuid.uuid4()),
                    'pseudo': data['pseudo'].strip().upper(),
                    'score': int(data['score']),
                    'percentage': data.get('percentage', 0),
                    'correct': data.get('correct', 0),
                    'total': data.get('total', 0),
                    'difficulty': data.get('difficulty', 'facile'),
                    'time': data.get('time', 0),
                    'gameType': data.get('gameType', 'quiz'),
                    'date': datetime.now().isoformat()
                }
                
                # Charger et sauvegarder
                scores = load_scores()
                scores.append(new_score)
                scores.sort(key=lambda x: x['score'], reverse=True)
                scores = scores[:100]  # Garder seulement les 100 meilleurs
                
                if save_scores(scores):
                    # Trouver la position
                    rank = next((i + 1 for i, s in enumerate(scores) if s['id'] == new_score['id']), 1)
                    
                    self.send_response(201)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    response = {
                        'message': 'Score enregistré avec succès',
                        'score': new_score,
                        'rank': rank
                    }
                    self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    error_response = {'error': 'Erreur lors de la sauvegarde'}
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Endpoint not found')
                
        except Exception as e:
            print(f"Erreur POST: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def do_DELETE(self):
        """Gérer les requêtes DELETE"""
        try:
            if self.path == '/api/scores':
                # Supprimer tous les scores
                if save_scores([]):
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {'message': 'Tous les scores ont été supprimés'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    error_response = {'error': 'Erreur lors de la suppression'}
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Endpoint not found')
                
        except Exception as e:
            print(f"Erreur DELETE: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def do_OPTIONS(self):
        """Gérer les requêtes OPTIONS pour CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    """Démarrer le serveur"""
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, HallOfFameHandler)
    
    print(f"🏆 Serveur Hall of Fame démarré sur http://localhost:{PORT}")
    print(f"📊 API disponible sur http://localhost:{PORT}/api/scores")
    print(f"📈 Statistiques sur http://localhost:{PORT}/api/stats")
    print(f"🎮 Cyber Dico sur http://localhost:{PORT}/")
    print("Appuyez sur Ctrl+C pour arrêter le serveur")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
