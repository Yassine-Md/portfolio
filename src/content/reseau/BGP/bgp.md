---
title: Cresrzfqd
description: zfsdcxwqd
pubDate: 2025-06-27T00:00:00.000Z
author: Ton Nom
tags:
  - re
---
**Question :** BGP est-il le seul protocole de routage extérieur (entre différents AS) ?

**Réponse :** Oui, BGP (Border Gateway Protocol) est actuellement le seul protocole de routage extérieur (EGP - Exterior Gateway Protocol) utilisé pour l'échange de routes entre les systèmes autonomes (AS) sur Internet. Historiquement, un autre protocole appelé EGP (Exterior Gateway Protocol) existait, mais il a été remplacé par BGP en raison de ses limitations. Aujourd'hui, BGP est incontournable pour assurer l'interconnexion des réseaux

- **ASN Publics**
    
    - Un ASN public est utilisé pour identifier un réseau qui doit échanger du trafic avec d'autres AS sur Internet via **BGP**.
        
    - Ces ASN sont attribués par les registres Internet régionaux (**RIR**, comme RIPE, ARIN, APNIC, LACNIC, AFRINIC).
        
    - Exemples : Un fournisseur d’accès Internet (ISP) ou une grande entreprise connectée à plusieurs opérateurs peut avoir un ASN public.
        
- **ASN Privés**
    
    - Un ASN privé est utilisé pour les réseaux qui n'ont pas besoin d'être directement visibles sur Internet, par exemple pour **des interconnexions internes ou privées**.
        
    - Ces ASN sont réservés et ne sont pas annoncés sur Internet.
        
    - Plage des ASN privés (RFC 6996) :
        
        - **64512 - 65534** (ASN 16 bits)
            
        - **4200000000 - 4294967294** (ASN 32 bits)

![PrivateASN.png](/reseau/BGP/PrivateASN.png)
