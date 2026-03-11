#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de correction d'encodage UTF-8
Remplace les caracteres mal encodes par les bons caracteres
"""

import os
import re
from pathlib import Path

# Mapping des caracteres mal encodes -> bons caracteres
REPLACEMENTS = {
    '\ufffd': "'",  # Caractere de remplacement Unicode
    '�': "'",
}

# Extensions de fichiers a traiter
EXTENSIONS = ['.html', '.css', '.js', '.txt', '.md', '.json', '.xml']

def fix_file_encoding(filepath):
    """Corrige l'encodage d'un fichier"""
    try:
        # Lire le fichier en UTF-8
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Compter les remplacements
        original_content = content
        
        # Remplacer le caractere de remplacement
        content = content.replace('\ufffd', "'")
        content = content.replace('�', "'")
        
        # Verifier si des modifications ont ete faites
        if content != original_content:
            # Sauvegarder le fichier corrige
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            count = original_content.count('\ufffd') + original_content.count('�')
            return count
        
        return 0
        
    except Exception as e:
        print(f"  Erreur sur {filepath}: {e}")
        return -1

def scan_and_fix():
    """Scanne et corrige tous les fichiers"""
    print("=" * 60)
    print("CORRECTION D'ENCODAGE UTF-8")
    print("=" * 60)
    print()
    
    total_files = 0
    total_fixed = 0
    total_errors = 0
    
    # Patterns de fichiers a verifier
    patterns = [
        "condo-*.html",
        "maison-*.html", 
        "terrain-*.html",
        "projet-*.html",
        "guide-*.html",
        "*.html"
    ]
    
    for pattern in patterns:
        files = list(Path('.').glob(pattern))
        
        for filepath in files:
            if filepath.is_file() and filepath.stat().st_size > 0:
                # Verifier si c'est un fichier HTML/CSS/JS
                if filepath.suffix.lower() in EXTENSIONS:
                    count = fix_file_encoding(filepath)
                    
                    if count > 0:
                        print(f"[CORRIGE] {filepath.name:50} -> {count} caracteres fixes")
                        total_fixed += count
                        total_files += 1
                    elif count == -1:
                        total_errors += 1
    
    print()
    print("=" * 60)
    print(f"RESULTAT: {total_files} fichiers corriges, {total_fixed} caracteres remplaces")
    if total_errors > 0:
        print(f"ATTENTION: {total_errors} erreurs rencontrees")
    print("=" * 60)

if __name__ == '__main__':
    scan_and_fix()
