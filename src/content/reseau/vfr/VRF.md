---
title: 'Comprendre LVM : Logical Volume Manager sous Linux'
description: 'Une introduction complète à LVM, ses avantages, limitations et cas d’usage'
pubDate: 2025-06-27T00:00:00.000Z
author: Ton Nom
tags:
  - LVM
  - Linux
  - RAID
  - Storage
---

# Comprendre le Concept de VRF et VRF-Lite

## Définition de VRF

**VRF** (_Virtual Routing and Forwarding_) est une technologie qui permet à plusieurs instances de tables de routage de coexister sur un même routeur. Cela revient à diviser un routeur physique en plusieurs routeurs virtuels indépendants.

Cette isolation permet notamment :

- D’éviter les conflits d’adresses IP entre différents clients ou réseaux.
    
- De séparer le trafic entre différents environnements.
    
- D’optimiser la sécurité et la segmentation.
    

> Sans VRF, le trafic peut être librement acheminé d’une interface à une autre (ex. G0/0 → G1/2).  
> Avec VRF, chaque interface appartient à un contexte distinct, et les routes ne peuvent pas interagir par défaut.

## Fonctionnement de VRF

VRF permet de créer **plusieurs tables de routage indépendantes** sur un même routeur. En temps normal, un routeur ne possède qu’une seule table de routage. Avec VRF, on segmente ces tables pour isoler les routes selon les besoins.

Chaque VRF peut avoir :

- Ses propres interfaces.
    
- Son propre protocole de routage dynamique (OSPF, BGP, etc.).
    
- Ses propres routes et voisins.
    

## Exemple d’utilisation

Les fournisseurs de services utilisent souvent VRF pour permettre à **un seul équipement** de transporter le trafic de **plusieurs clients**. Cela permet :

- L’isolation du trafic entre clients.
    
- La possibilité pour chaque client d’utiliser les **mêmes plages d’adresses IP privées**, sans conflit.


```
+------------------+
|     Routeur             |
|  +------------+     |   <-- Client A : 192.168.1.0/24
|  | VRF-A         |      |
|  | 192.168.1.1   |      |
|  +------------+     |
|  +------------+     |   
|  | VRF-B         |      |   <-- Client B : 192.168.1.0/24 
|  | 192.168.1.1  |       |  (même IP que A)     
|  +------------+     |
+------------------+
```

---

## Comportement des Interfaces avec VRF

### Attribution d’une Interface à un VRF

Lorsqu’une interface est assignée à un VRF :

- **Elle change de contexte de routage** (passe du contexte "global" à celui du VRF).
    
- **Toute adresse IP existante est supprimée.**
    

> Cela est dû au fait que l’adresse IP appartient à une table de routage donnée, et ne peut pas être conservée lors du changement de contexte.

### Cas Pratique

Avant affectation :

- Interface dans le **VRF par défaut** (souvent appelé _global_).
    

Après affectation :

- Interface associée à une **nouvelle table de routage**, distincte du global.
    

---

## VRF Leaking : Communiquer entre VRFs

**VRF leaking** est une méthode permettant à des VRFs distincts de **partager des routes spécifiques** entre eux.

Cela se fait généralement par :

- L’import/export de **route-targets**.
    
- L’utilisation de protocoles de routage dynamiques ou de routes statiques.
    

---

## VRF avec Protocoles de Routage Dynamiques

Chaque VRF étant isolée, il faut créer **une instance indépendante par VRF** pour chaque protocole de routage :

- OSPF, BGP, EIGRP, RIP, etc.
    
- Chaque instance apprend et maintient ses propres routes dans son contexte.
    

### Avantages

- Permet d’isoler totalement le routage par client ou par segment réseau.
    
- Permet de faire du routage dynamique même avec **chevauchement d’adresses IP**.
    
- Recommandé dans des environnements **multi-tenant** ou **multi-services**.
    

---

## VRF vs VRF-Lite

### VRF-Lite

**VRF-Lite** est une version allégée de VRF, utilisée **sans MPLS**. Elle permet d'isoler localement des segments réseau au sein d’un seul routeur.

- Aucune extension WAN.
    
- Pas de transport entre plusieurs sites.
    
- Pas de MP-BGP, ni de Route Distinguisher.
    

> **Analogie** :  
> Imagine un immeuble (le routeur) contenant plusieurs appartements (les VRFs).  
> Chaque appartement est isolé et les locataires ne peuvent pas se parler, sauf si le propriétaire met en place un passage contrôlé (VRF leaking).

#### Cas d’usage VRF-Lite :

- Séparer production / invités / VoIP / IoT dans une entreprise.
    
- Créer des environnements segmentés au sein d’un même site.
    

### VRF (avec MPLS)

Lorsque VRF est couplé à **MPLS**, on parle de **VRF complet** :

- Utilise **MP-BGP** (Multiprotocol BGP) pour l’échange des routes.
    
- Utilise **Route Distinguisher (RD)** et **Route Target (RT)**.
    
- Permet de connecter des sites distants d’un même client sur un réseau WAN.
    

> **Analogie** :  
> Si chaque immeuble représente un site distant, **MPLS agit comme un système postal** reliant tous les appartements (VRFs) d’un même client entre ces immeubles.

#### Cas d’usage :

- Réseaux VPN MPLS pour clients multi-sites.
    
- Fournisseurs d’accès ou opérateurs.

---

## RD vs RT : Comprendre les Concepts Clés dans un Réseau MPLS VPN 

**ressource** : [Explication détaillée RD vs RT – Chaker Bchir](https://www.chakerbchir.fr/routage-wan/route-distinguisher-rd-vs-route-target-rt)

### Le **Route Distinguisher (RD)**

Le **RD** (Route Distinguisher) est un identifiant utilisé pour distinguer des réseaux IP identiques appartenant à des clients différents, dans un environnement MPLS VPN.

#### Pourquoi le RD est-il nécessaire ?

- Plusieurs clients peuvent utiliser la **même plage d’adresses IP** (ex : 192.168.10.0/24).
    
- Sans RD, si un routeur reçoit plusieurs fois ce même réseau, il ne peut pas les différencier.
    
- Le RD permet d’**uniquement identifier chaque réseau client** dans la table de routage BGP du routeur PE (Provider Edge).

#### Fonctionnement :

- Le RD est **local** à chaque routeur PE.
    
- Chaque PE choisit un RD différent pour chaque VRF qu’il configure.
    
- Exemples :
    
    - PE1 → RD = `65220:130` pour VRF-ClientA
        
    - PE2 → RD = `65220:230` pour ce même ClientA
        

> Ainsi, même si deux clients utilisent le même réseau IP, les **routes sont différenciées** grâce au RD, qui crée des entrées uniques dans la table BGP.
> 

```
AS-Number:Site-ID
```

---

### Le **Route Target (RT)**

Le **RT** (Route Target) est un **attribut BGP étendu** utilisé pour **l’importation et l’exportation de routes** entre les VRFs sur différents routeurs PE.

#### Rôle du RT :

- Détermine **quelles routes une VRF exporte** vers le backbone MPLS.
    
- Détermine **quelles routes une VRF importe** depuis ce même backbone.
    

#### Caractéristiques du RT :

- Le RT est **configuré sur les routeurs PE**.
    
- Il est **globalement cohérent dans tout le réseau MPLS** :  
    Pour que l’échange de routes fonctionne, les PEs doivent utiliser des RT compatibles (même valeur, mais import/export inversé).
    
- Le RT permet **de partager ou d’isoler des routes entre VRFs**, qu’elles soient sur le **même PE ou sur plusieurs**.
    

#### Format du RT :
```
ASN:NN  ou  IP-Address:NN
```

#### Exemple d’usage :

- Sur PE1 – VRF-ClientA :
```
route-target export 100:1
```
* Sur PE2 – VRF-ClientA :
```
route-target import 100:1
```

**Résultat :** Les routes exportées par PE1 (VRF-ClientA) seront visibles et utilisées par PE2 (VRF-ClientA).

#### Exemple de mauvaise configuration :

- Sur PE2 – VRF-ClientB :
```
route-target import 100:1
```

**Conséquence :** Le PE va importer les routes destinées à ClientA dans la VRF de ClientB.

> **Cela représente une faille majeure d’isolation entre clients.**

---

### Qui configure le RD et le RT ?

- C’est le **fournisseur de services (SPI)** qui **gère l’infrastructure MPLS/VPN/VRF/MP-BGP**, y compris :
    
    - La création des VRFs sur les PEs
        
    - L’attribution des RDs
        
    - La définition des RT (import/export)
        
- Le **client** ne configure pas le RD ni le RT. Il **consomme le service comme un VPN managé**, et gère uniquement **son réseau interne**, derrière son routeur CE (Customer Edge).

---

## Sécurité et Isolation

### Ce que VRF **n’isole pas automatiquement**

Même si chaque VRF est isolée logiquement, elles **partagent toutes le même routeur PE**. Cela implique certaines limites :

- Un client qui **sature sa propre VRF** (ex. : en inondant de trafic) peut impacter le **CPU du PE**, car tous les processus tournent sur la même machine.
    
- Les VRFs **partagent la mémoire globale** du routeur.
    
- Sans **politiques QoS**, un client peut **monopoliser une interface physique**, affectant les autres.
    
- Une mauvaise configuration des **Route Targets (RT)** (import/export) peut entraîner une **fuite de routes** entre VRFs.
    
- Le **plan de contrôle** (ex. BGP, OSPF) reste global au routeur : une surcharge d’un protocole dans une VRF peut impacter l’ensemble.

---

### Mécanismes pour renforcer l'isolation

#### VRF + ACLs

Il est possible d’appliquer des **ACLs (Access Control Lists)** sur les interfaces associées à une VRF :

- Pour filtrer le trafic **entrant ou sortant**.
    
- Pour **restreindre** ou **contrôler l’accès** à certaines ressources.

#### VRF + QoS

L’ajout de **politiques QoS** (Quality of Service) permet de :

- **Limiter la bande passante** allouée à une VRF.
    
- **Éviter qu’un client** ne prenne tout le débit d’un lien.
    
- **Préserver les performances** des autres VRFs.

#### VRF + Zones de Firewall

Une architecture avancée peut consister à :

- Créer des **VRFs distinctes** (ex : `VRF-Dev`, `VRF-Prod`, `VRF-Guest`).
    
- **Forcer le trafic inter-VRF** à passer par un **firewall centralisé**.
    
- Mettre en place des **zones de sécurité** avec des règles explicites.

```
zone-Dev --> zone-Prod :   any	 Deny
```
Cela permet une **segmentation forte**, tout en maintenant un contrôle granulaire du trafic inter-VRF.

---

### Inconvénients et limitations

Même si VRF est puissant, il présente aussi certains défis :

- **Complexité de configuration** : Chaque VRF nécessite des routes, ACLs, QoS, etc.
    
- **Difficulté de troubleshooting** : La séparation des contextes complique le diagnostic des problèmes réseau.
    
- **Impact sur la performance** :
    
    - Multiples VRFs sollicitent le **même CPU, mémoire et plan de contrôle**.
        
    - Risques accrus si l’équipement n’est pas dimensionné correctement.

#### Limitations matérielles :

- Certains équipements ont un **nombre maximal de VRFs supportées**.
    
- Il existe une **limite du nombre de routes par VRF**, dépendant du **modèle et de la capacité matérielle** du routeur.


---

## Ressources complémentaires

- [Wikipédia - Virtual Routing and Forwarding](https://fr.wikipedia.org/wiki/Virtual_routing_and_forwarding)
    
- [Pumpkin Programmer – VRF et adresses IP chevauchantes](https://www.pumpkinprogrammer.pro/post/the-power-of-vrf-overlapping-ips-configuration-and-routing-explained)
    
- [IP With Ease – VRF vs VRF-Lite](https://ipwithease.com/vrf-vs-vrf-lite/)
    
- [YouTube – Introduction à VRF](https://www.youtube.com/watch?v=9LtigE12W3g)
