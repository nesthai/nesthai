#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de correction complète des problèmes d'encodage
Remplace les ?? et les accents mal encodés
"""

import os
from pathlib import Path

# Mapping des corrections
CORRECTIONS = {
    # Émojis et symboles
    '"??"': '"💬"',  # WhatsApp
    '>??<': '>🔍<',  # Recherche
    '>?? Description': '>📋 Description',
    '>?? Caract': '>📋 Caract',
    '?? Caractàristiques': '📋 Caractéristiques',
    '?? Description': '📋 Description',
    '?? +66': '📞 +66',
    '<span>??</span>': '<span>⚖️</span>',
    '<span>???</span>': '<span>🛏️</span>',
    
    # Puces simples ? → ✓
    '? <strong>Piscine': '✓ <strong>Piscine',
    '? <strong>Jardin': '✓ <strong>Jardin',
    '? <strong>Cuisine': '✓ <strong>Cuisine',
    '? <strong>Garage': '✓ <strong>Garage',
    '? <strong>Sàcurità': '✓ <strong>Sécurité',
    '? <strong>Proche': '✓ <strong>Proche',
    '? <strong>Vue': '✓ <strong>Vue',
    '? <strong>Accès': '✓ <strong>Accès',
    '? <strong>Onsen': '✓ <strong>Onsen',
    '? <strong>Conciergerie': '✓ <strong>Conciergerie',
    
    # Accents mal encodés (à suivant d'une consonne → é)
    'Ràsidence': 'Résidence',
    'ràsidence': 'résidence',
    'ràsidentiel': 'résidentiel',
    'Intàressà': 'Intéressé',
    'intàressà': 'intéressé',
    'tranquillità': 'tranquillité',
    'sàrànità': 'sérénité',
    'Privàe': 'Privée',
    'privàe': 'privée',
    'commoditàs': 'commodités',
    'Sàcurità': 'Sécurité',
    'sàcurità': 'sécurité',
    'àlot': 'îlot',
    'à vendre': 'à vendre',  # Celui-ci est correct
    'Là oà': 'Là où',
    'oà': 'où',
    'chuchoteà': 'chuchote',
    'enlaceà': 'enlace',
    'inspirà': 'inspiré',
    'paysagà': 'paysagé',
    'entretenuà': 'entretenu',
    'dàtention': 'détention',
    'sociàtà': 'société',
    'adaptàe': 'adaptée',
    'àtrangers': 'étrangers',
    'acquàrir': 'acquérir',
    'bàtiment': 'bâtiment',
    'làgale': 'légale',
    'juridiqueà': 'juridiques',
    'environnementà': 'environnement',
    'ambianceà': 'ambiance',
    'diffàrent': 'différent',
    'franàais': 'français',
    'Thaàlande': 'Thaïlande',
    'immàdiatement': 'immédiatement',
    'nàcessaire': 'nécessaire',
    'pràfàrence': 'préférence',
    'expàrience': 'expérience',
    'complàte': 'complète',
    'dàpart': 'départ',
    'arrivàe': 'arrivée',
    'pràvision': 'prévision',
    'tempàrature': 'température',
    'climatisationà': 'climatisation',
    'balconà': 'balcon',
    'terrasseà': 'terrasse',
    'jardinà': 'jardin',
    'rànovà': 'rénové',
    'rànovation': 'rénovation',
    'àquipà': 'équipé',
    'meublà': 'meublé',
    'meublàe': 'meublée',
    'cafeà': 'café',
    'dàjeuner': 'déjeuner',
    'situà': 'situé',
    'situàe': 'située',
    'Caractàristiques': 'Caractéristiques',
    'caractàristiques': 'caractéristiques',
    'dàbordement': 'débordement',
    'accàs': 'accès',
    'publià': 'publié',
    'pràcàdent': 'précédent',
    'suivantà': 'suivant',
    'ocàan': 'océan',
    'dàtail': 'détail',
    'DàTAIL': 'DÉTAIL',
    'SUPPRIMà': 'SUPPRIMÉ',
    '4àme': '4ème',
    'mà': 'm²',
    'àm2': 'm²',
    'Nouveautàs': 'Nouveautés',
    'Ràf': 'Réf',
    
    # Symboles devises
    '>à <span': '>€ <span',  # Euro
    'à</span> à': '€</span> €',  # Correction double euro
    'à <span class="amount">--</span> à': '€ <span class="amount">--</span> €',
    
    # Icônes features (remplacer ?? par des emojis pertinents)
    '<span>??</span>\n                                <div><strong>Chambres': '<span>🛏️</span>\n                                <div><strong>Chambres',
    '<span>??</span>\n                                <div><strong>Salles de bain': '<span>🚿</span>\n                                <div><strong>Salles de bain',
    '<span>??</span>\n                                <div><strong>Surface': '<span>📐</span>\n                                <div><strong>Surface',
    '<span>??</span>\n                                <div><strong>Terrain': '<span>🌿</span>\n                                <div><strong>Terrain',
    '<span>??</span>\n                                <div><strong>Piscine': '<span>🏊</span>\n                                <div><strong>Piscine',
    '<span>??</span>\n                                <div><strong>Garage': '<span>🚗</span>\n                                <div><strong>Garage',
}

def fix_file(filepath):
    """Corrige un fichier HTML"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        original = content
        
        # Appliquer toutes les corrections
        for old, new in CORRECTIONS.items():
            content = content.replace(old, new)
        
        # Sauvegarder si modifié
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"  Erreur sur {filepath}: {e}")
        return False

print("=" * 60)
print("CORRECTION COMPLÈTE DES CARACTÈRES")
print("=" * 60)
print()

# Tous les fichiers HTML
files_fixed = 0
total_files = 0

for pattern in ['*.html', 'condo-*.html', 'maison-*.html', 'terrain-*.html', 'projet-*.html', 'guide-*.html']:
    for filepath in Path('.').glob(pattern):
        if filepath.is_file():
            total_files += 1
            if fix_file(filepath):
                print(f"[CORRIGÉ] {filepath.name}")
                files_fixed += 1

print()
print("=" * 60)
print(f"RÉSULTAT: {files_fixed} fichiers corrigés sur {total_files}")
print("=" * 60)
