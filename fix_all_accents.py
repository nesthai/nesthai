#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path

# Correspondances : à + consonne → é
ACCENT_FIXES = {
    'Idàal': 'Idéal',
    'idàal': 'idéal',
    'Dàcouvrez': 'Découvrez',
    'dàcouvrez': 'découvrez',
    'opportunità': 'opportunité',
    'viabilisà': 'viabilisé',
    'm²tres': 'mètres',
    'SPàCIFIQUES': 'SPÉCIFIQUES',
    'spàcifiques': 'spécifiques',
    'CORRIGàE': 'CORRIGÉE',
    'corrigàe': 'corrigée',
    'màtres': 'mètres',
    'caractàristiques': 'caractéristiques',
    'Caractàristiques': 'Caractéristiques',
    'dàtail': 'détail',
    'Dàtail': 'Détail',
    'pràcédent': 'précédent',
    'suivanté': 'suivant',
    'diffàrent': 'différent',
    'franàais': 'français',
    'Thaàlande': 'Thaïlande',
    'immàdiatement': 'immédiatement',
    'nàcessaire': 'nécessaire',
    'pràférence': 'préférence',
    'expàrience': 'expérience',
    'complète': 'complète',
    'dàpart': 'départ',
    'arrivàe': 'arrivée',
    'pràvision': 'prévision',
    'tempàrature': 'température',
    'climatisationà': 'climatisation',
    'balconà': 'balcon',
    'terrasseà': 'terrasse',
    'jardinà': 'jardin',
    'sàcurité': 'sécurité',
    'sàcurisé': 'sécurisé',
    'ràcemment': 'récemment',
    'rànové': 'rénové',
    'rànovation': 'rénovation',
    'équipà': 'équipé',
    'meublà': 'meublé',
    'meublàe': 'meublée',
    'cafà': 'café',
    'dàjeuner': 'déjeuner',
    'situà': 'situé',
    'situàe': 'située',
    'ambianceà': 'ambiance',
    'environnementà': 'environnement',
    'piscineà': 'piscine',
    'à vendre': 'à vendre',  # correct
    'Là où': 'Là où',  # correct
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
    'Ràsidence': 'Résidence',
    'ràsidence': 'résidence',
    'ràsidentiel': 'résidentiel',
    'Intàressé': 'Intéressé',
    'intàressé': 'intéressé',
    'tranquillità': 'tranquillité',
    'sérànità': 'sérénité',
    'Privàe': 'Privée',
    'privàe': 'privée',
    'commoditàs': 'commodités',
    'Sàcurité': 'Sécurité',
    'sàcurité': 'sécurité',
    'àlot': 'îlot',
    'chuchoté': 'chuchote',
    'enlacé': 'enlace',
    'payésagé': 'paysagé',
}

print('Correction des accents...')
fixed = 0

for filepath in Path('.').glob('*.html'):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        original = content
        
        for old, new in ACCENT_FIXES.items():
            content = content.replace(old, new)
        
        # Remplacer les ?? restants
        content = content.replace('??', '✓')
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'[CORRIGÉ] {filepath.name}')
            fixed += 1
    except Exception as e:
        print(f'[ERREUR] {filepath.name}: {e}')

print(f'Terminé: {fixed} fichiers corrigés')
