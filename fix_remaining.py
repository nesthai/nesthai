#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path

replacements = {
    '"??"': '"💬"',
    '>??<': '>🔍<',
    '>?? Description': '>📋 Description',
    '?? Caractéristiques': '📋 Caractéristiques',
    '?? Description': '📋 Description',
    '?? +66': '📞 +66',
}

feature_patterns = [
    ('<span>??</span>\n                                <div><strong>Chambres', '<span>🛏️</span>\n                                <div><strong>Chambres'),
    ('<span>??</span>\n                                <div><strong>Salles de bain', '<span>🚿</span>\n                                <div><strong>Salles de bain'),
    ('<span>??</span>\n                                <div><strong>Surface', '<span>📐</span>\n                                <div><strong>Surface'),
    ('<span>??</span>\n                                <div><strong>Terrain', '<span>🌿</span>\n                                <div><strong>Terrain'),
    ('<span>??</span>\n                                <div><strong>Piscine', '<span>🏊</span>\n                                <div><strong>Piscine'),
    ('<span>??</span>\n                                <div><strong>Garage', '<span>🚗</span>\n                                <div><strong>Garage'),
]

print('Correction finale des ??...')
fixed = 0

for filepath in Path('.').glob('*.html'):
    if not filepath.is_file():
        continue
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        original = content
        
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        for old, new in feature_patterns:
            content = content.replace(old, new)
        
        # Remplacer les ?? restants dans les span
        content = content.replace('<span>??</span>', '<span>✓</span>')
        content = content.replace('<span>???</span>', '<span>🛏️</span>')
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'[CORRIGÉ] {filepath.name}')
            fixed += 1
            
    except Exception as e:
        print(f'[ERREUR] {filepath.name}: {e}')

print(f'Terminé ! {fixed} fichiers corrigés.')
