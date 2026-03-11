#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Beaulieu Property - Generateur de pages
Assemble les partials avec les contenus sources
"""

import os
import re
import sys
from pathlib import Path

# Configuration
CONFIG = {
    'partials_dir': '_partials',
    'sources_dir': '_sources',
    'output_dir': '.'
}

def load_partials():
    """Charge tous les partials HTML"""
    partials = {}
    partials_path = Path(CONFIG['partials_dir'])
    
    if not partials_path.exists():
        print(f"ERREUR: Dossier {CONFIG['partials_dir']} non trouve")
        sys.exit(1)
    
    for file in partials_path.glob('*.html'):
        partials[file.stem] = file.read_text(encoding='utf-8')
        print(f"  [OK] Partial charge: {file.stem}")
    
    return partials

def parse_source_file(filepath):
    """Extrait les meta donnees et le contenu d'un fichier source"""
    content = filepath.read_text(encoding='utf-8')
    
    # Extraire le bloc META
    meta = {}
    meta_match = re.search(r'<!--META\s*([\s\S]*?)-->', content)
    
    if meta_match:
        meta_block = meta_match.group(1)
        # Parser chaque ligne key: value
        for line in meta_block.strip().split('\n'):
            match = re.match(r'^\s*(\w+):\s*(.+)$', line)
            if match:
                meta[match.group(1).strip()] = match.group(2).strip()
        
        # Retirer le bloc META du contenu
        content = re.sub(r'<!--META\s*[\s\S]*?-->', '', content, count=1)
    
    return {
        'meta': meta,
        'content': content.strip()
    }

def build_page(source_file, partials):
    """Genere une page HTML complete"""
    filename = source_file.name
    output_path = Path(CONFIG['output_dir']) / filename
    
    print(f"\nGeneration: {filename}")
    
    # Parser le fichier source
    parsed = parse_source_file(source_file)
    meta = parsed['meta']
    content = parsed['content']
    
    # Valeurs par defaut
    title = meta.get('title', 'Beaulieu Property Management')
    description = meta.get('description', 'Agence immobiliere de luxe a Pattaya')
    keywords = meta.get('keywords', 'immobilier pattaya, condo thailande')
    canonical = f"https://www.beaulieu-pattaya.com/{filename}"
    og_image = meta.get('image', 'https://www.beaulieu-pattaya.com/images/og-image.jpg')
    nav = meta.get('nav', '')
    extra_css = meta.get('css', '')
    extra_scripts = meta.get('scripts', '')
    
    # Construire le HTML
    html_parts = []
    
    # 1. Debut
    html_parts.append(partials.get('head-start', ''))
    
    # 2. Meta specifiques
    html_parts.append(f"    <title>{title}</title>")
    html_parts.append(f'    <meta name="description" content="{description}">')
    html_parts.append(f'    <meta name="keywords" content="{keywords}">')
    html_parts.append(f'    <link rel="canonical" href="{canonical}">')
    html_parts.append(f'    <meta property="og:title" content="{title}">')
    html_parts.append(f'    <meta property="og:description" content="{description}">')
    html_parts.append(f'    <meta property="og:url" content="{canonical}">')
    html_parts.append(f'    <meta property="og:image" content="{og_image}">')
    
    # 3. Meta communs + CSS
    html_parts.append(partials.get('head-meta', ''))
    
    # CSS supplementaire
    if extra_css:
        html_parts.append(f'    <link rel="stylesheet" href="css/{extra_css}">')
    
    # 4. Fin head
    html_parts.append(partials.get('head-end', ''))
    
    # 5. Header avec navigation active
    header = partials.get('header', '')
    if nav:
        # Activer le lien correspondant
        header = re.sub(
            f'data-nav="{nav}">',
            f'data-nav="{nav}" class="active" aria-current="page">',
            header
        )
        # Desactiver les autres
        header = re.sub(r'data-nav="[^"]+">', '>', header)
    
    html_parts.append(header)
    
    # 6. Contenu principal
    html_parts.append(content)
    
    # 7. Footer
    footer = partials.get('footer', '')
    
    # Scripts supplementaires
    if extra_scripts:
        scripts = [s.strip() for s in extra_scripts.split(',')]
        script_tags = '\n'.join([f'    <script src="js/{s}.js"></script>' for s in scripts])
        footer = footer.replace('<!-- Scripts -->', f'<!-- Scripts -->\n{script_tags}')
    
    html_parts.append(footer)
    
    # Ecriture
    output_path.write_text('\n'.join(html_parts), encoding='utf-8')
    print(f"  [OK] {filename} genere")

def build_all():
    """Genere toutes les pages"""
    print("=" * 50)
    print("BEAULIEU PROPERTY - BUILD SYSTEM")
    print("=" * 50)
    print()
    
    # Verifier le dossier sources
    sources_path = Path(CONFIG['sources_dir'])
    if not sources_path.exists():
        print(f"ERREUR: Dossier {CONFIG['sources_dir']} non trouve")
        print("Creez le dossier et ajoutez vos pages sources")
        sys.exit(1)
    
    # Charger les partials
    print("Chargement des partials...")
    partials = load_partials()
    print()
    
    # Liste des pages
    source_files = list(sources_path.glob('*.html'))
    print(f"{len(source_files)} pages a generer")
    print()
    
    # Generer chaque page
    success = 0
    failed = 0
    
    for source_file in source_files:
        try:
            build_page(source_file, partials)
            success += 1
        except Exception as e:
            print(f"  [ER] Erreur sur {source_file.name}: {e}")
            failed += 1
    
    print()
    print("=" * 50)
    print(f"Termine: {success} succes, {failed} echecs")
    print("=" * 50)
    print()

def watch_mode():
    """Mode surveillance automatique"""
    try:
        import time
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
        
        class RebuildHandler(FileSystemEventHandler):
            def on_modified(self, event):
                if event.src_path.endswith('.html'):
                    print(f"\nModification detectee: {event.src_path}")
                    time.sleep(0.5)
                    build_all()
                    print("\nSurveillance en cours... (Ctrl+C pour arreter)")
        
        print("=" * 50)
        print("MODE WATCH ACTIF")
        print("=" * 50)
        print("Modifiez les fichiers pour regenerer automatiquement")
        print("Appuyez sur Ctrl+C pour arreter")
        print()
        
        # Build initial
        build_all()
        
        # Observer
        observer = Observer()
        handler = RebuildHandler()
        
        observer.schedule(handler, CONFIG['sources_dir'], recursive=False)
        observer.schedule(handler, CONFIG['partials_dir'], recursive=False)
        observer.start()
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
            print("\n\nArret du mode watch")
        
        observer.join()
        
    except ImportError:
        print("Mode watch necessite: pip install watchdog")
        print("Utilisez: python generate.py")

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Generateur de pages Beaulieu')
    parser.add_argument('--watch', '-w', action='store_true', help='Mode surveillance')
    
    args = parser.parse_args()
    
    if args.watch:
        watch_mode()
    else:
        build_all()
