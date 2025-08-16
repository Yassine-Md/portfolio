---
title: >-
  MPLS : Tout comprendre sur le routage par labels – Fonctionnement, avantages
  et cas d'usage
description: >-
  MPLS (Multiprotocol Label Switching) révolutionne le routage en remplaçant les
  adresses IP par des labels pour un transit ultra-rapide des données. Cet
  article détaille : *) Les Fondamentaux  *) Les Protocoles associés  *) Les
  Optimisations etc .
pubDate: 2025-06-27T00:00:00.000Z
author: Madhbouh Yassine
tags:
  - MPLS
  - QoS
  - L3VPN
  - Traffic_Engineering
  - RSVP-TE
  - LDP
  - BGP
  - VRF
  - VPN-MPLS
---


### Introduction

Le protocole MPLS (Multiprotocol Label Switching) se distingue par son fonctionnement unique : il n’utilise ni adresses IP, ni routage classique, ni notion de « hops » (sauts).

Initialement conçu pour **connecter des réseaux LAN à travers des réseaux WAN**, MPLS offre bien plus que cela. On peut même le considérer comme un **protocole de tunneling** permettant d’acheminer efficacement des données entre différents nœuds d’un réseau.

Ce protocole est particulièrement utilisé par des entreprises de grande taille, souvent dispersées géographiquement, pour **interconnecter plusieurs sites distants** via un réseau privé performant.

La connexion s’effectue directement avec le réseau auquel le dispositif doit être relié, ce qui permet un acheminement des données particulièrement rapide.

Cette particularité confère à MPLS plusieurs avantages majeurs :

- **Qualité de service (QoS)** optimisée,
    
- **Traffic Engineering** avec le protocole RSVP-TE,
    
- Pas besoin d’intermédiaire pour diriger le trafic, garantissant une gestion plus fluide,
    
- Support natif des **VPN MPLS**, assurant la séparation des flux entre différents clients,
    
- **Redondance et basculement rapide** pour une meilleure disponibilité,
    
- Support multi-protocoles, offrant une grande flexibilité.


**Objectifs principaux :**

- **Améliorer les performances** et le coût des équipements réseau,
    
- **Optimiser le routage**, surtout dans les grands réseaux,
    
- **Ajouter de nouveaux services de routage** sans changer les équipements du cœur de réseau

---
## Pourquoi MPLS est appelé couche 2.5 ?

On considère que MPLS fonctionne sur la couche **OSI 2.5**, car :

- Ce **n’est pas un protocole de couche 3** (réseau) : il ne fait pas de routage IP classique.
- Ce **n’est pas un protocole de couche 2** (liaison de données) : il ajoute un **label** entre la couche 2 et la couche 3.
- Le label est inséré **entre la trame de la couche 2 et l’en-tête IP (couche 3)**.

>  C’est donc une couche intermédiaire : la "2.5".

---
## Fonctionnement de MPLS

- À l’entrée du réseau MPLS, un **label** est ajouté au paquet (étiquette MPLS).
    
- Les routeurs MPLS, appelés **Label Switch Routers (LSR)**, commutent les paquets en se basant uniquement sur ce label, ce qui est plus rapide que le routage IP classique.
    
- À la sortie du réseau MPLS, le label est retiré, puis le paquet est transmis à sa destination finale.
    
- MPLS permet la création de chemins préétablis appelés **LSP (Label Switched Paths)**, facilitant ainsi le contrôle du chemin emprunté par les données.

---
## Composants MPLS

- **P (Provider Router)** : routeur du fournisseur de services situé au cœur du réseau MPLS. Il commute les paquets en se basant uniquement sur les labels, sans prendre en compte les adresses IP.
    
- **PE (Provider Edge)** : routeur situé en bordure du réseau MPLS. Il applique les labels aux paquets entrant dans le réseau et retire les labels à leur sortie.
    
- **CE (Customer Edge)** : équipement du client connecté au réseau MPLS via un PE. C’est souvent un routeur local qui ne connaît pas MPLS.

---

### Terminologie MPLS

- **LER (Label Edge Router)** : routeur situé à la périphérie du réseau MPLS.  
    **LER = PE (Provider Edge)**
    
- **LSR (Label Switch Router)** : routeur situé à l’intérieur du réseau MPLS.  
    **LSR = P (Provider Router)**

---


## Analogie simple entre traitement IP et traitement MPLS:

### Imagine un réseau ferroviaire :

- Le **train** = le paquet.
    
- Le **numéro de train** (label) = sert à savoir où l’envoyer.
    
- Chaque **gare (routeur)** a un tableau :
    
    > “Train 105 entrant par voie 2 → repartir par voie 4 en tant que train 208”
    

Tu ne regardes pas la **destination finale écrite sur le billet** (adresse IP), mais seulement **le numéro du train** à chaque étape.

---
## pourquoi MPLS est-il plus rapide si l’IP a aussi ces optimisations ?

### **Fonctionnement d’un routeur IP (couche 3)**

- La **table de routage IP** contient des entrées comme :

Destination        | Sortie
------------------ | --------
192.168.1.0/24     | Port 2
192.168.2.0/24     | Port 3
192.168.0.0/16     | Port 4
0.0.0.0/0 (default)| Port 1

Le routeur :

- Analyse l’adresse IP destination (`192.168.2.5`)
    
- Cherche l’entrée **la plus spécifique** (longest prefix match)
    
- Envoie le paquet par le bon port

=> Ce processus peut être complexe, car il nécessite des algorithmes spécialisés et est répété sur chaque routeur traversé, ce qui crée une certaine redondance.

---
### **Fonctionnement avec MPLS (couche 2.5)**

=>Avec MPLS, la recherche est directe et simple : il suffit de comparer **une valeur exacte (le label)** pour déterminer le chemin. Cela permet un traitement plus rapide des paquets.

---

## Différences de performance entre IP et MPLS

Une étude comparative, présentée dans le [rapport de Kathiresan (Université SFU)](https://www.sfu.ca/~ljilja/cnl/pdf/kathiresan.pdf), met en évidence les écarts de performance entre les réseaux IP classiques et les réseaux MPLS.

### Résultats clés (voir chapitre 7 du rapport) :

- Dans **toutes les conditions de test**, le réseau **MPLS surpasse le réseau IP**, notamment en termes de :
    
    - **Latence** (temps de transit réduit),
        
    - **Débit** (meilleure gestion du trafic),
        
    - **Temps de convergence** (réactivité face aux changements),
        
    - **Utilisation efficace des liens**.

Ces résultats confirment que **MPLS est plus performant** qu’un réseau IP classique, surtout dans des environnements à forte charge ou nécessitant de la redondance.

---

## Traffic Engineering (TE) dans un réseau MPLS

Le **Traffic Engineering (TE)** est un **ensemble de techniques** visant à optimiser l’acheminement du trafic à travers un réseau pour améliorer les performances, l’efficacité et la résilience.

Dans un réseau MPLS, TE permet de dépasser la logique classique du routage IP (chemin le plus court) en prenant en compte :

- La **qualité de service (QoS)**,
    
- La **source du trafic**,
    
- Des **politiques de routage spécifiques** définies par l’opérateur.

> Grâce à cela, on peut **forcer certains chemins de transit** (par exemple, pour éviter un lien saturé ou privilégier un lien plus rapide), ce qui permet une **meilleure répartition de la charge** et une **utilisation plus efficace des ressources réseau**.

--> _Pour un aperçu complet des principes de TE dans MPLS, voir le [**chapitre 3 du rapport de Kathiresan**_.](https://www.sfu.ca/~ljilja/cnl/pdf/kathiresan.pdf)

---

## RSVP-TE : le protocole au service du Traffic Engineering

Pour **mettre en œuvre le Traffic Engineering dans MPLS**, on utilise notamment le protocole **RSVP-TE** (_Resource Reservation Protocol – Traffic Engineering_).

Ce protocole permet :

- De **réserver des ressources réseau** (comme la bande passante) sur un **chemin explicite** prédéfini,
    
- De **créer des tunnels MPLS-TE** respectant des **contraintes précises** : capacité, latence, évitement de certains nœuds/lignes, etc.

Ainsi, **RSVP-TE est le mécanisme de signalisation** qui permet de concrétiser les intentions du TE dans le réseau MPLS.

-> Les mécanismes de RSVP-TE sont détaillés dans le **chapitre 3** du rapport susmentionné.

---

## MPLS Fast Reroute (FRR) : protection rapide grâce à RSVP-TE

**Fast Reroute (FRR)** est **une fonctionnalité de haute disponibilité** intégrée dans l’architecture **MPLS-TE** via le protocole **RSVP-TE**.

Son objectif est de **minimiser le temps de coupure** en cas de panne d’un lien ou d’un nœud du réseau.

### Fonctionnement :

- Un **chemin de secours (backup path)** est **pré-calculé** localement, à proximité du point de défaillance potentiel.
    
- En cas de panne, le **trafic est immédiatement redirigé** vers ce chemin alternatif,  
    ➜ sans attendre la reconvergence des protocoles de routage comme OSPF ou BGP.

### Résultat :

- Le **basculement s’effectue en quelques millisecondes**,  
    comparé à plusieurs secondes dans les architectures IP traditionnelles.

---

## MPLS : Labels réservés

_Référence : [RFC 3032 - MPLS Label Stack Encoding](https://datatracker.ietf.org/doc/html/rfc3032)_

MPLS utilise une **plage spéciale de labels réservés** (valeurs 0 à 15) pour des usages bien définis. Ces labels ont une signification particulière et sont interprétés de façon standardisée par tous les équipements MPLS.

| Label | Nom du label                             | Signification / Utilisation principale                                                                                                                                           |
| ----- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0** | **IPv4 Explicit Null**                   | Indique que le paquet est destiné à être routé en IP (niveau 3). Le label est gardé et indique au routeur de faire le traitement IP normal (souvent utilisé pour préserver QoS). |
| **1** | **Router Alert**                         | Le paquet doit être inspecté par le routeur (ex : RSVP, OAM). C’est l’équivalent d’un "stop et regarde ce paquet".                                                               |
| **2** | **IPv6 Explicit Null**                   | Même fonction que label 0, mais pour des paquets IPv6.                                                                                                                           |
| **3** | **Implicit Null**                        | Indique au routeur précédent de **ne pas envoyer de label** (label est "poppé"). Permet de faire le traitement IP final plus simplement. Appelé aussi "label POP".               |
| 4–15  | **Réservés (non utilisés actuellement)** | Pour usages futurs. Peut être réservé pour extensions, expérimentations ou autres RFC.                                                                                           |

### Labels dynamiques (à partir de 16)

À partir du **label 16**, les valeurs **ne sont plus fixes**. Ces labels sont :

- **Attribués dynamiquement** par les routeurs,
    
- **Distribués automatiquement** via des protocoles comme **LDP** ou **RSVP-TE**,
    
- Utilisés pour les **chemins spécifiques (LSP)** définis dans le réseau MPLS.

---

## Différences fondamentales entre routage IP et MPLS

En IP, chaque paquet est routé indépendamment, ce qui peut entraîner des chemins différents pour un même flux. En MPLS, tous les paquets d’un flux suivent un chemin prédéfini, appelé **Label Switched Path (LSP)**, assurant ainsi un routage plus stable et contrôlé.

---

## Assurer la Qualité de Service (QoS) en réseau MPLS : quels défis et quelles solutions ?

**Comment garantir un traitement prioritaire des flux critiques dans un réseau MPLS soumis à une saturation de bande passante ?**

Dans un réseau MPLS, les paquets sont acheminés via des labels qui identifient les flux, mais cette identification seule ne suffit pas à garantir la disponibilité des ressources nécessaires en cas de congestion. Il est donc indispensable d’adopter des mécanismes spécifiques pour gérer efficacement la QoS.

### Deux approches complémentaires pour gérer la QoS en MPLS

#### 1. MPLS + QoS « classique » : classification et priorisation au niveau IP

Cette méthode s’appuie sur la classification des paquets par labels MPLS associés à des classes de service (CoS). Chaque classe est liée à une file d’attente avec une politique de scheduling (priorité stricte, Weighted Fair Queuing, etc.) gérée principalement au niveau IP ou sur les interfaces réseau.

**Avantages :**

- Priorisation efficace de certains flux critiques face au trafic moins urgent.
    
- Mise en œuvre simple et intégrée aux équipements IP/MPLS existants.
    

**Limites :**

- Pas de contrôle sur le chemin emprunté par les paquets.
    
- Pas de garantie stricte de bande passante ou de latence en cas de congestion importante.
    
- Gestion locale, sans vision globale du réseau.
    

---

#### 2. MPLS-TE (Traffic Engineering) : contrôle dynamique des chemins et réservation de ressources

Pour dépasser ces limites, MPLS intègre la fonction **Traffic Engineering (TE)**, qui permet de choisir dynamiquement des chemins réseau optimisés selon la congestion, de réserver explicitement de la bande passante et de garantir la QoS via des protocoles tels que **RSVP-TE** ou **Segment Routing**.

**Avantages :**

- Attribution d’un chemin déterminé pour chaque flux, évitant les zones saturées.
    
- Réservation explicite de bande passante assurant la QoS.
    
- Contrôle global et dynamique de l’ensemble du réseau MPLS.
    

**Limites :**

- Complexité de déploiement et d’exploitation plus importante.
    
- Nécessite un pilotage centralisé et l’utilisation de protocoles spécialisés.
    

---

## Détermination des chemins MPLS : automatique et dynamique

Dans MPLS, les chemins (**Label Switched Paths - LSPs**) sont **déterminés à l’avance**, avant l’envoi des paquets. Cette détermination peut être :

- **Automatique (dynamique)** : via des protocoles de signalisation comme **RSVP-TE** (Resource Reservation Protocol – Traffic Engineering) ou **CR-LDP** (Constraint-Based Routing Label Distribution Protocol). Ces protocoles permettent aux routeurs de négocier la réservation de bande passante et d’établir des chemins optimisés selon la topologie et l’état actuel du réseau. Ces chemins sont recalculés automatiquement en fonction des contraintes (bande passante, latence, congestion).
    
- **Manuelle** : configuration statique par l’administrateur réseau.
    

Cette dynamique permet de modifier un tunnel MPLS ou d’augmenter la bande passante **sans interrompre la connexion**, garantissant ainsi la continuité et la qualité du service (voir [RFC 3209, section 4.6.4](https://www.rfc-editor.org/rfc/pdfrfc/rfc3209.txt.pdf)).

---

### Notes complémentaires :

Le protocole **CR-LDP** est une extension de LDP qui supporte le routage contraint, assurant ainsi la qualité des chemins MPLS en fonction des contraintes définies ([source mémoire en ligne](https://www.memoireonline.com/09/13/7405/m_Conception-et-deploiement-de-la-technologie-MPLS-dans-un-reseau-metropolitain8.html)).

---

## Partage des labels et équilibrage de charge

Dans les environnements MPLS à grande échelle, il est crucial d’assurer une **répartition efficace du trafic** pour éviter la surcharge de certains liens et exploiter au mieux la capacité réseau. MPLS intègre plusieurs mécanismes pour y parvenir, notamment **l’ECMP** et l’**intégration avec des outils SDN**.

---

### 1. ECMP (Equal-Cost Multi-Path)

**ECMP** est une stratégie de routage qui permet à MPLS de **répartir les flux de trafic** sur plusieurs chemins ayant **le même coût métrique**.

- La répartition est faite à l’aide d’un **algorithme de hachage** basé sur des éléments du paquet (adresse IP source/destination, ports TCP/UDP, etc.).
    
- Cela assure un **équilibrage de charge** efficace tout en maintenant **l’ordre des paquets** pour chaque flux (flow-based hashing).
    

  **Exemple** :  
Deux chemins MPLS entre le routeur PE1 et PE2 ont le même coût. Le trafic est automatiquement réparti entre eux, par exemple :

- Flux VoIP → Chemin A
    
- Flux vidéo → Chemin B
    

**Référence** : [RFC 4928 - ECMP dans MPLS](https://datatracker.ietf.org/doc/html/rfc4928)


---

## Optimisation de la gestion des labels dans MPLS

Dans un réseau MPLS, l’utilisation des labels ne se fait pas de manière naïve (un label par route IP). Au contraire, MPLS intègre des **mécanismes d’optimisation puissants** pour éviter la surcharge des tables de commutation et assurer une **scalabilité efficace**, même dans des environnements très complexes (comme les réseaux de fournisseurs de services ou les grandes entreprises multisites).

Voici les **trois principaux mécanismes d’optimisation** utilisés :

### Agrégation des routes par FEC (Forwarding Equivalence Class)

Dans MPLS, les paquets sont classés en **FEC** — des groupes de paquets qui seront traités de la même manière (même sortie, même QoS, etc.).

   **But** : Un seul label est utilisé pour acheminer tous les paquets appartenant à la même FEC, même s'ils proviennent de sous-réseaux IP différents.

   **Exemple** :  
Un fournisseur dessert plusieurs sous-réseaux internes du client A :  
`192.168.1.0/24`, `192.168.2.0/24`, `192.168.3.0/24`  
Tous ces réseaux peuvent être **regroupés sous un seul FEC**, donc **1 seul label MPLS** est nécessaire pour les transporter.


### Label unique par client (VPN MPLS - L3VPN)

Dans le cadre d’un MPLS VPN (Layer 3), chaque client est isolé dans un **VRF (Virtual Routing and Forwarding)**. Le trafic est identifié par un **label VPN unique**, ce qui permet de router l’ensemble du trafic client sans avoir à gérer chaque route individuellement dans le cœur du réseau.

   **But** : Réduire le nombre de labels dans le cœur MPLS et simplifier la gestion par client.

   **Exemple** :  
Le client B dispose de 100 sites avec 200 routes IP.  
Le routeur PE attribue **un label VPN unique au client B**, peu importe le nombre de sous-réseaux, ce qui évite d’avoir 200 labels différents dans le backbone.


### Label stacking (pile de labels)

MPLS permet l’utilisation de **plusieurs labels empilés** dans un paquet. Cela permet de séparer les fonctions de **transport** (dans le backbone) et de **service** (VPN, QoS, etc.).

   **But** : Isoler les responsabilités entre le cœur du réseau (label de transport) et les services finaux (label de service), tout en gardant une architecture simple et performante.

   **Exemple** :  
Un paquet destiné au client C peut avoir :

- Label 1 (en haut de pile) : pour traverser le backbone MPLS jusqu’au routeur de sortie.
    
- Label 2 : pour identifier le VPN du client C à la sortie.

 Les routeurs du cœur ne traitent que le **label de transport**, sans se préoccuper de l’identité du client ou de ses routes.

## Résumé 

Ces trois mécanismes d’optimisation permettent à MPLS d’être **hautement évolutif**, **performant** et **facile à gérer**, même dans des réseaux contenant **des milliers de routes et de clients**
Grâce à ces optimisations, MPLS dépasse les limites du routage IP traditionnel et s'impose comme une **technologie de choix pour les réseaux multisites à grande échelle**, avec des **besoins élevés en performance, isolation, et qualité de service**.

---

## MPLS et l’intégration des protocoles de routage : une approche collaborative

Bien que **MPLS** soit une technologie puissante de commutation basée sur les labels, il est important de noter que **MPLS n'est presque jamais déployé seul**.  
   En pratique, **MPLS fonctionne en étroite collaboration avec d'autres protocoles de routage et technologies réseau**, qui lui permettent de **découvrir les chemins**, de **distribuer les labels**, et d’**optimiser la gestion du trafic**.

Cette coopération entre MPLS et les protocoles de niveau 3 permet d’obtenir un réseau :

- plus **résilient**,
    
- plus **performant**,
    
- et **plus intelligent** dans la gestion des flux critiques (VoIP, données temps réel, etc.).

---

### Pourquoi MPLS a besoin d’autres protocoles

MPLS ne fournit **ni la découverte de topologie**, ni la **décision de routage IP** par lui-même. Il repose sur :

- des **protocoles de routage IGP (OSPF, IS-IS)** pour connaître la topologie réseau,
    
- des **protocoles de signalisation** comme **LDP** ou **RSVP-TE** pour établir et maintenir les LSP (Label Switched Paths),
    
- et parfois **BGP** pour transporter les routes VPN (dans le cas des MPLS L3VPN).

---

## Rôle de BGP dans le cœur MPLS : transport des routes clients

Dans une architecture MPLS L3VPN, les routeurs **PE (Provider Edge)** connectés aux clients doivent pouvoir **échanger les routes IP des réseaux clients** entre eux, afin de garantir l’interconnexion des sites distants. Pour cela, ils utilisent un protocole capable de transporter ces routes avec leur **contexte de VPN**.

   C’est ici que **BGP** (plus précisément **MP-BGP**, BGP Multiprotocol) entre en jeu.


### Pourquoi utiliser MP-BGP dans MPLS VPN ?

- MP-BGP permet aux routeurs PE d’échanger :
    
    - les **routes clients (IPv4)**,
        
    - les **labels associés** à ces routes (utilisés dans la pile MPLS),
        
    - et les **informations de VPN (Route Distinguisher, Route Target)**.
        

  Chaque PE sait alors **quel label pousser** sur les paquets destinés à un client distant, et via quel tunnel MPLS.

## Full Mesh iBGP et exclusion des routeurs P

En BGP classique, pour que tous les routeurs puissent échanger leurs routes via iBGP, **une full mesh iBGP** est requise dans un même AS (Autonomous System).  
Mais MPLS introduit une **optimisation majeure** :

### Les routeurs P (Provider) **ne participent pas à BGP**

- Les routeurs P n’ont **aucune session BGP**.
    
- Ils ne connaissent **aucune route client**.
    
- Ils **commutent simplement les labels** (comme des commutateurs MPLS).

Donc, même si on parle de **full mesh BGP entre les PE**, cela ne **viole pas** les règles de BGP, car :

- les routeurs **P ne sont pas des routeurs BGP**,
    
- la **full mesh ne s’applique qu’aux routeurs BGP**, ici les PE uniquement.

Cela permet de **garder le backbone MPLS (P routers) léger, rapide et simple**.


## Pourquoi MPLS + BGP est plus efficace que du routage IP pur

Si on n’utilisait **pas MPLS**, alors chaque routeur de l’infrastructure (y compris les P) devrait :

- Apprendre **toutes les routes de tous les clients**.
    
- Maintenir des **VRF**, des politiques, et des centaines de milliers de routes IP.

### Exemple sans MPLS :

Imaginons :

- 200 clients, chacun avec 500 routes → 100 000 routes.
    
- Chaque routeur P doit les apprendre et stocker.

Résultat :

- Grosse charge CPU et mémoire.
    
- Risque d’instabilité.
    
- Complexité de gestion accrue.

---

### Exemple avec MPLS :

- Les PE échangent leurs routes clients via **MP-BGP**.
    
- Les P routers n’apprennent **aucune route client**.
    
- Ils ne voient que les **labels MPLS**.
    
- Ils commutent les paquets **sans consulter la table IP**.
    

Résultat :

- Le cœur du réseau est **plus rapide**, **plus stable**, et **scalable**.
    
- Les clients sont isolés les uns des autres via **VRF + BGP + MPLS**.

---

## BGP, MPLS et la mise en œuvre des L3VPN

En plus de permettre l’échange des routes clients entre les routeurs PE, **BGP offre des capacités supplémentaires qui en font le protocole idéal pour intégrer des services avancés sur une infrastructure MPLS.**

-> **BGP fournit bien plus qu’un simple routage** :  
Il permet notamment d’exploiter ce qu’on appelle des **VPN de niveau 3 (L3VPN)** dans une topologie MPLS, une solution largement utilisée par les fournisseurs de services pour **interconnecter des sites clients** distants de manière isolée, sécurisée et scalable.

---

### Qu’est-ce qu’un L3VPN dans MPLS ?

Un **L3VPN MPLS** est un service réseau où chaque client dispose :

- de son propre **espace d’adressage IP** (grâce aux **VRF** sur les routeurs PE),
    
- d’une **isolation logique** entre ses routes et celles des autres clients,
    
- et d’un **acheminement transparent à travers le réseau MPLS du fournisseur**.
    

Le routage entre les sites du client est assuré **via BGP**, qui transporte :

- les routes client (IPv4, IPv6),
    
- les **labels MPLS** associés à ces routes,
    
- et les métadonnées comme les **Route Distinguisher (RD)** et **Route Target (RT)** pour identifier chaque VPN.

---

### Rôle de BGP dans les L3VPN MPLS

BGP permet :

- d’**associer les routes à des clients distincts** via des identifiants de VPN (RD/RT),
    
- de **transporter ces routes entre les PE**, sans impliquer les routeurs P,
    
- et de **fournir une évolutivité énorme** grâce à la séparation logique des tables de routage.

  **Exemple** :  
Le client X a deux sites, à Paris et à Lyon.  
Les deux PE connectés à ces sites échangent leurs routes via **MP-BGP**, avec un **label VPN spécifique**.  
-> Les P routers ne voient que les **labels MPLS**, sans jamais connaître les routes client.

---

## Routage classique vs MPLS : RIB, FIB, LIB et LFIB

### Routage classique (sans MPLS)

1. **RIB (Routing Information Base)**  
    C’est la **table de routage globale** dans laquelle le routeur stocke toutes les routes apprises par ses protocoles de routage (OSPF, BGP, etc.).
    
2. **FIB (Forwarding Information Base)**  
    La FIB est une **table dérivée de la RIB**, ne contenant que les **meilleurs chemins** (routes optimales) sélectionnées.  
    Elle est généralement implémentée en matériel (ASIC) pour un traitement rapide des paquets.

---

### Quand MPLS est activé : apparition des tables LIB et LFIB

Avec MPLS et le protocole **LDP (Label Distribution Protocol)**, de nouvelles structures sont créées pour gérer les labels :

1. **LIB (Label Information Base)**
    
    - Le protocole LDP attribue **localement un label à chaque préfixe contenu dans la RIB**.
        
    - La LIB est donc une table qui associe **chaque préfixe à un label localement significatif**.
        
    - Important : ces labels sont **uniques seulement au niveau du routeur local** et ne sont pas forcément les mêmes chez les voisins.

2. **LFIB (Label Forwarding Information Base)**
    
    - La LFIB est la table utilisée **pour la commutation de paquets MPLS en temps réel** (forwarding).
        
    - Elle est dérivée de la LIB et optimisée pour un accès rapide (souvent en matériel).
        
    - Elle contient pour chaque label reçu :
        
        - le label à retirer (pop),
            
        - ou le label à remplacer (swap),
            
        - ou le label(s) à pousser (push) en cas de stack de labels,
            
        - ainsi que l’interface de sortie.

---

### Comment se construit la LFIB à partir de la LIB ?

- La **LIB contient tous les labels locaux attribués aux préfixes**.
    
- La LFIB se construit en tenant compte des **labels annoncés et reçus via LDP par les voisins**.
    
- Grâce à ces échanges, le routeur sait **quel label utiliser pour envoyer un paquet à son voisin vers un préfixe donné**.
    
- La LFIB est ainsi une **table optimisée qui traduit le label entrant en actions de commutation MPLS** et interface de sortie.

---

### Points clés à retenir

- Les **labels sont locaux** à chaque routeur, donc chaque routeur doit savoir quel label son voisin utilise pour un préfixe donné.
    
- LDP permet cette **synchronisation des labels entre voisins**.
    
- Le routeur utilise la **LFIB pour router efficacement les paquets MPLS en fonction des labels**, sans avoir à refaire une recherche complète dans la RIB ou FIB à chaque paquet.

---

## Différence entre LIB et LFIB dans MPLS

### 1. **LIB (Label Information Base)**

- C’est une **base de données logique** qui contient la correspondance **préfixe IP ↔ label local** attribué par le protocole LDP.
    
- Chaque routeur construit sa LIB **à partir des préfixes présents dans sa RIB**, en attribuant un label unique pour chaque préfixe qu’il peut atteindre.
    
- **Les labels dans la LIB sont locaux et abstraits** : ils indiquent simplement « ce routeur a ce label pour ce préfixe », sans préciser comment traiter un paquet reçu avec un label.
    

### 2. **LFIB (Label Forwarding Information Base)**

- La LFIB est la **table de commutation MPLS réellement utilisée pour router les paquets**.
    
- Elle est dérivée de la LIB, mais intègre aussi les **labels reçus des voisins via LDP**.
    
- Pour chaque label d’entrée, la LFIB indique l’action à faire (swap, pop, push) et l’interface de sortie.
    
- **C’est la table qui permet de prendre des décisions rapides en fonction des labels reçus sur les paquets MPLS.**

---

## Exemple concret

Supposons un réseau simple :

- Routeur A connaît le préfixe 10.1.0.0/16 dans sa RIB.
    
- LDP lui attribue le label local 100 pour ce préfixe (dans la LIB).
    
- Routeur B annonce à A qu’il utilise le label 200 pour 10.1.0.0/16.
    

Dans la **LFIB de A** :

- Pour un paquet avec un label entrant correspondant au chemin vers 10.1.0.0/16, A saura qu’il doit remplacer (swap) le label 100 par 200 et envoyer le paquet vers B.
    

La LFIB contient donc les instructions concrètes de traitement des paquets labelisés, alors que la LIB est une simple correspondance préfixe-label locale, sans informations sur le forwarding des paquets reçus.

---

## LDP : le protocole d’échange automatique des labels dans MPLS

Le **Label Distribution Protocol (LDP)** est le protocole qui permet aux routeurs MPLS, qu’ils soient PE (Provider Edge) ou P (Provider), de **créer automatiquement des adjacences LDP** entre toutes leurs interfaces MPLS actives.

### Comment ça fonctionne ?

- Chaque routeur MPLS génère localement un **label pour chacun des préfixes IP** qu’il connaît dans sa table de routage (RIB).
    
- Il **annonce ensuite ces labels à ses voisins LDP**, établissant ainsi une correspondance préfixe-label partagée.
    
- Ce mécanisme permet de **peupler les tables LIB et LFIB** en synchronisant les informations de labels entre voisins.
    

Grâce à LDP, les routeurs savent quel label utiliser pour faire transiter un paquet vers un préfixe donné, en se basant sur les labels attribués localement et ceux reçus des voisins.

---

## gestion et visibilité des labels MPLS

Par défaut, chaque routeur MPLS attribue des labels localement, ce qui fait que **le même numéro de label peut apparaître sur plusieurs routeurs différents sans conflit**, car ces labels n’ont de sens que localement.

Pour faciliter la compréhension et le suivi du cheminement des paquets, on peut configurer sur chaque routeur une **plage spécifique de labels**. Cela permet de voir clairement l’évolution des labels au fur et à mesure qu’ils traversent le réseau, rendant l’analyse et le dépannage plus simples.

---

## VRF : isolation du trafic client dans un réseau MPLS

Une des fonctionnalités étroitement liées à MPLS est la **VRF (Virtual Routing and Forwarding)**.

### Qu’est-ce que la VRF ?

Les VRF permettent aux **fournisseurs d’accès Internet (FAI)** de **séparer et isoler le trafic de chaque client sur un même réseau MPLS**.  
Cela revient à faire comme si chaque client avait son propre réseau privé, même si physiquement ils partagent la même infrastructure.

### Exemple concret

Un FAI dessert deux entreprises, **Entreprise A** et **Entreprise B**, via un réseau MPLS commun.  
Pour éviter que leurs données se mélangent, le FAI crée :

- une VRF nommée **"A"** pour l’Entreprise A,
    
- une VRF nommée **"B"** pour l’Entreprise B.
    

Ainsi, même si les deux entreprises partagent un même routeur PE, leur trafic reste totalement séparé et sécurisé, comme si chaque client disposait d’un réseau dédié.

---

### Où sont configurées les VRF ?

- Les VRF sont configurées **uniquement sur les routeurs PE (Provider Edge)**.
    
- Les **routeurs P (Provider)**, qui forment le cœur du réseau MPLS, **ne connaissent pas les VRF**.
    
- Leur rôle est simplement de faire transiter les paquets via les labels MPLS, sans se soucier de la source ou du client d’origine.


---

## MPLS : un principe proche des circuits virtuels

MPLS fonctionne sur le principe des **circuits virtuels**, où un chemin prédéfini (LSP) est établi pour faire transiter les paquets avec des labels.  
Cela permet un acheminement rapide, cohérent et efficace, contrairement au routage IP classique qui décide chemin par chemin.  
Ce mécanisme facilite aussi la gestion de la QoS et la haute disponibilité.

---

## Labels MPLS : Label extérieur vs Label intérieur (VPN Label)

| Label                             | Rôle                                                                                                                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Label extérieur (outer label)** | Sert à router le paquet dans le backbone MPLS. Il identifie le **PE de destination** et est utilisé par les routeurs P pour commuter les paquets à travers le réseau MPLS. |
| **Label intérieur (VPN label)**   | Sert à **délivrer le paquet à la bonne VRF** sur le PE de destination. Il indique la session client cible.                                                                 |

### Exemple de paquet MPLS avec double label :

```
[Outer Label: 200]  → Routage jusqu’au PE de sortie
[Inner Label: 300]  → Livraison vers la VRF du client B
[IP Payload]

```

Le **label extérieur** est ce que le PE de destination demande aux routeurs du backbone d’utiliser pour acheminer le paquet jusqu’à lui.  
Le **label intérieur** (VPN Label), distribué via **MP-BGP**, permet au PE final d’identifier la bonne VRF et donc de router le paquet vers le client adéquat.

---
### Exemple d’annonce MP-BGP

```
RD: 100:1
IP Prefix: 10.0.1.0/24
Next-hop: 192.0.2.1
VPN Label: 300
```

Cela signifie :

> Pour atteindre le préfixe `10.0.1.0/24` dans le VPN identifié par le RD `100:1`, envoie le paquet via le routeur `192.0.2.1` avec le **VPN Label 300**. Ce label permet au PE de destination d’acheminer le paquet vers la bonne VRF client.

---
### Concepts clés et rôles des composants MPLS VPN

| Terme                        | Rôle                                                                                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RD (Route Distinguisher)** | Permet de rendre uniques les préfixes IP dans un VPN MPLS, même si plusieurs clients utilisent les mêmes adresses IP. Sert à distinguer les routes des différents clients. |
| **RT (Route Target)**        | Utilisé pour contrôler l’import/export des routes entre les VRF via MP-BGP. Définit quelles routes sont partagées entre quels VPN.                                         |
| **VPN Label**                | Identifie la VRF cible sur le PE de destination, pour délivrer le paquet au bon client.                                                                                    |
| **MP-BGP**                   | Transporte les labels VPN ainsi que les attributs RD et RT dans les annonces des routes VPN.                                                                               |
| **Label extérieur**          | Utilisé par les routeurs P pour acheminer le paquet jusqu’au PE de sortie via le backbone MPLS.                                                                            |
| **PE de sortie**             | Lit le VPN Label et délivre le paquet dans la bonne VRF correspondant au client.                                                                                           |

> [!NOTE]
> **RD et RT** : sont détaillés dans l’article **[VRF](https://ym-port-folio.netlify.app/blog/reseau/mpls/mpls)** !
> 

---

## **Où intervient le Route Distinguisher (RD) ?**

#### **Le RD est utilisé uniquement dans le _plan de contrôle_** c’est-à-dire :

- Dans les annonces **MP-BGP VPNv4/VPNv6** entre les routeurs **PE**.
    
- Il sert à rendre les préfixes IP **uniques globalement**, même si plusieurs clients utilisent les **mêmes plages d'adresses privées**.
    

>  Le **RD est attaché à une route**, **pas à un paquet**.  
>  Il **n’est jamais encapsulé dans le paquet MPLS** envoyé dans le réseau.  
>  Il **n’est jamais vu ni traité par les routeurs P**.

## **Dans le plan de données : seul MPLS est utilisé**

Quand PE1 envoie un paquet vers 10.2.2.2 :

- Il ajoute **2 labels** :
    
    1. **Outer Label** (transport LSP jusqu’à PE2)
        
    2. **Inner Label** (VPN Label reçu via BGP)
        
- Ce paquet **ne contient jamais le RD**, ni d'information BGP.
    
- Le **label VPN** est suffisant pour PE2 pour savoir **à quelle VRF** remettre le paquet.

---

### **VPN Label = Label MPLS interne utilisé pour identifier la VRF sur le PE de destination**

- Il est **ajouté par le PE d’entrée (source)**.
    
- Il est **utilisé par le PE de sortie (destination)** pour **savoir dans quelle VRF remettre le paquet**.
    
- C’est **là que MPLS rencontre le concept de VPN/VRF**, dans le **plan de données**.

C’est ce label qui **indique au PE dans quelle VRF remettre le paquet**.  
Sans ce label, PE2 ne pourrait pas savoir **quel client** est concerné (surtout si plusieurs clients utilisent les **mêmes plages IP** !).

---

## MPLS Encapsulation : le header MPLS

Un **header MPLS** (ou label MPLS) est un **en-tête de 4 octets (32 bits)** inséré entre la trame Ethernet et la couche réseau (IP).  
Il contient :

|Champs|Taille (bits)|Description|
|---|---|---|
|**Label**|20|L’étiquette MPLS utilisée pour le forwarding|
|**TC (Traffic Class)**|3|Priorité QoS (anciennement EXP)|
|**S (Bottom of Stack)**|1|Indique si c’est le dernier label de la pile|
|**TTL (Time to Live)**|8|Durée de vie du paquet (comme en IP)|

### Exemple d’empilement de labels MPLS :

Un paquet peut avoir plusieurs headers MPLS empilés (stacked labels), par exemple :

```
| Label Transport | Label VPN | Paquet IP |
```


![struct_mpls_header_encapsulation.png](/reseau/MPLS/struct_mpls_header_encapsulation.png)


---

## MPLS est activé **par interface** : Explication complète


Cela signifie que :

> **Même si le routeur supporte MPLS globalement**, il **n’active réellement le traitement MPLS que sur les interfaces où on l’ordonne explicitement**.

Autrement dit :

- **MPLS ne fonctionne pas "automatiquement" sur toutes les interfaces**.
    
- Tu dois **manuellement activer MPLS** sur **chaque interface** où tu veux que les paquets soient étiquetés ou traités via MPLS.

### Deux niveaux d’activation MPLS

|Niveau de configuration|Commande|Rôle principal|
|---|---|---|
|Global (plan de contrôle)|`mpls ip`|Active le **support MPLS** sur le routeur (processus, LDP, gestion de labels).|
|Interface (plan de données)|`mpls ip` sur interface|Autorise **le traitement MPLS** (insertion/lecture de labels) sur cette interface.|

### Que se passe-t-il si on oublie l’activation par interface ?

Même si :

- Tu actives `mpls ip` en global,
    
- Tu configures LDP et autres protocoles MPLS,
    

**Aucun paquet ne sera étiqueté ou traité en MPLS tant que les interfaces n’ont pas `mpls ip`.**

De plus :

- **LDP ne formera pas de session** avec les voisins via ces interfaces.
    
- Aucune **échange de labels** ne sera possible.


##### RESSOURCES :
- **Cisco IOS XE MPLS LDP Autoconfig**  
    _"LDP must first be enabled globally by means of the global **mpls ip** command."_  
    [https://www.cisco.com/c/en/us/td/docs/ios/ios_xe/mpls/configuration/guide/convert/mp_ldp_book_xe/mp_ldp_autoconfig_xe.html](https://www.cisco.com/c/en/us/td/docs/ios/ios_xe/mpls/configuration/guide/convert/mp_ldp_book_xe/mp_ldp_autoconfig_xe.html)
    
- **Cisco IOS MPLS LDP Configuration Guide**  
    _"If the Label Distribution Protocol (LDP) is disabled globally, the mpls ldp autoconfig command fails and generates a console message explaining that LDP must first be enabled globally by using the mpls ip global configuration command."_  
    [https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mp_ldp/configuration/xe-3s/asr903/mp-ldp-xe-3s-asr903-book/mp-ldp-autoconfig.html](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mp_ldp/configuration/xe-3s/asr903/mp-ldp-xe-3s-asr903-book/mp-ldp-autoconfig.html)
    
- **Cisco Community Discussion**  
    [https://community.cisco.com/t5/switching/quot-mpls-ip-quot-global-vs-interface-level-command/td-p/2450365](https://community.cisco.com/t5/switching/quot-mpls-ip-quot-global-vs-interface-level-command/td-p/2450365)
    
- **Cisco MPLS Command Reference**  
    _"If LDP is disabled globally, the mpls ldp autoconfig command fails. LDP must be enabled globally by means of the global mpls ip command first."_  
    [https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mpls/command/mp-cr-book/mp-m2.html](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mpls/command/mp-cr-book/mp-m2.html)

---
## SCÉNARIO COMPLET

- **Client 1 (C1)** est dans le **site A** d’une entreprise connectée au routeur **PE1**.
    
- **Client 2 (C2)** est dans le **site B** de la même entreprise, connecté au **PE2**.
    
- Entre PE1 et PE2, il y a un backbone MPLS (cœur de réseau du provider), avec des routeurs **P1, P2**, etc.
    
- Le backbone MPLS fait partie d’un **AS fournisseur**.
    
- L'entreprise cliente utilise un **VPN L3 MPLS (VRF séparée)**.
    
- Le **ping de C1 à C2** passe donc par ce **réseau MPLS**.


## ARCHITECTURE

```
C1 -- CE1 -- PE1 --- P1 --- P2 --- PE2 -- CE2 -- C2
              |                     |
            VRF_A                  VRF_A
```


## PHASES DU FONCTIONNEMENT EN DÉTAIL

### 1. Configuration initiale & VRF

- **Chaque PE (PE1 et PE2)** a une **VRF (Virtual Routing and Forwarding)** séparée pour le client, ici appelée `VRF_A`.
    
- **CE1** connecte C1 à PE1. CE2 connecte C2 à PE2.
    
- Chaque CE routeur utilise **BGP, OSPF ou static** pour annoncer ses routes au PE.
    
- PE1 apprend le réseau de C1 (ex: 10.1.1.0/24).
    
- PE2 apprend le réseau de C2 (ex: 10.2.2.0/24).


### 2. Échange de routes VPN via MP-BGP (iBGP)

- PE1 et PE2 sont **peers iBGP VPNv4** (via loopbacks).
    
- PE2 exporte le préfixe `10.2.2.0/24` avec un **Route Distinguisher (RD)** pour le rendre unique (ex: `65000:10:10.2.2.0/24`) et un **Route Target (RT)** `target:100:1`.
    
- PE1 importe les routes associées à `RT:100:1` (via `import RT`) dans `VRF_A`.

**Maintenant PE1 connaît l’IP de C2 (10.2.2.2)** grâce au MP-BGP VPNv4.


### 3. Résolution et sélection du chemin

- Lorsque C1 envoie un **ping ICMP vers 10.2.2.2**, CE1 envoie le paquet à PE1.
    
- PE1 consulte sa **VRF_A** : il a une route vers `10.2.2.2`, avec comme **next-hop PE2**.
    
- Grâce à BGP/MPLS, PE1 associe ce trafic à :
    
    - **Un label d’inner (label VPN)** pour identifier la **VRF cible sur PE2**
        
    - **Un label d’outer (transport label)** pour acheminer le trafic via MPLS à PE2.

### 4. Encapsulation MPLS : push des labels

PE1 encapsule le paquet comme suit :

|Stack|Contenu|
|---|---|
|Label 1 (outer)|Transport MPLS (ex: LDP vers PE2)|
|Label 2 (inner)|Label VPN vers VRF_A sur PE2|
|Payload|Paquet IP ICMP de C1 → C2|

Les **routeurs P (P1, P2)** voient **uniquement les labels**, pas les adresses IP source/destination du paquet original.

### 5. Commutation MPLS dans le cœur (routeurs P)

- Les routeurs **P1, P2** font de la **Label Switching** :
    
    - Ils **regardent uniquement le label d’en-tête**.
        
    - Ils n'ont **aucune idée du contenu IP** (ni source ni destination).
        
    - Ils échangent les labels selon leur table LFIB MPLS (LDP ou Segment Routing).
        

**À ce niveau, on n’utilise plus l’IP routing**, mais **MPLS switching** → c’est pourquoi le cœur est scalable et rapide.

### 6. Réception sur PE2

- PE2 reçoit le paquet avec :
    
    - Outer label → supprimé (pop)
        
    - Inner label → indique que le paquet est destiné à **VRF_A**
        
- PE2 utilise ce label pour **router dans VRF_A** vers C2 (10.2.2.2).
    
- Le paquet est transmis à CE2, puis à C2.


---

### Ressources :

- [What is MPLS? – Cloudflare](https://www.cloudflare.com/fr-fr/learning/network-layer/what-is-mpls/)
    
- [Introduction à MPLS – FrameIP](https://www.frameip.com/mpls/)
    
- [Série de vidéos très bien expliquées sur MPLS – YouTube](https://www.youtube.com/watch?v=vBi4T5dl_YM)


---
