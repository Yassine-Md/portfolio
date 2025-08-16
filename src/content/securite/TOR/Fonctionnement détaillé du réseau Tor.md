---
title: "Tor : Fonctionnement, Sécurité et Dark Web – Guide Complet des Relais et de l'Anonymat"
description: "Le réseau Tor (The Onion Router) est un outil essentiel pour la confidentialité en ligne, permettant un accès anonyme à Internet. Cet article explore en détail :    *)Architecture de Tor   *)Contournement de la censure  *)Sécurité   *)Dark Web  etc."
pubDate: 2025-06-27T00:00:00.000Z
author: Madhbouh Yassine
tags:
  - DarkWeb
  - HiddenServices
  - VPN-MPLS
  - Anonymat
  - Storage
  - Obfs4
  - Snowflake
---
## 1. Tour générale

Dans une connexion Tor, **trois relais** sont généralement impliqués :

- **Relais d'entrée (nœud d'entrée)** :  
    Premier relais que votre trafic atteint. Il connaît votre adresse IP, mais ne sait pas quel site vous visitez.
    
- **Relais intermédiaire (nœud intermédiaire)** :  
    Relaye les données entre l’entrée et la sortie. Il ne connaît ni votre adresse IP d’origine ni la destination finale, il ne fait que relayer les données.
    
- **Relais de sortie (nœud de sortie)** :  
    Dernier relais avant que les données ne quittent le réseau Tor pour atteindre leur destination. Il connaît l’adresse du site que vous visitez, mais pas votre adresse IP d’origine.
    

---

## 2. Obfs4 Bridge

Un pont obfs4 est un type spécial de relais Tor conçu pour contourner les mécanismes de censure. Les autorités ou pare-feu peuvent bloquer l’accès à Tor, et les ponts obfs4 utilisent une technique de camouflage pour rendre le trafic Tor difficile à détecter et à bloquer.

---

## 3. Snowflake Proxy

Un proxy Snowflake est une technologie plus légère et accessible qui permet aux utilisateurs de partager leur bande passante pour aider à contourner la censure. Contrairement aux relais Tor traditionnels ou aux ponts obfs4, Snowflake permet à des utilisateurs ayant moins de ressources ou de compétences techniques de contribuer au réseau Tor en utilisant leur bande passante pour faire transiter le trafic des autres.

> **Lorsque tu utilises Snowflake, tu partages une partie de ta bande passante avec des utilisateurs de Tor qui sont bloqués par la censure.**  
> Autrement dit, les utilisateurs qui ont besoin d’accéder à Tor, mais dont l’accès est limité, peuvent passer par ton proxy Snowflake pour se connecter à Tor et contourner la censure.  
> Ton rôle est de fournir la connexion à Internet aux utilisateurs qui ne peuvent pas se connecter directement à Tor. Tu es comme un relais temporaire, aidant les personnes à accéder au réseau Tor via ton propre réseau.

---

## 4. Comment Tor choisit les nœuds (relays) ?

### Sélection automatique des nœuds

Le navigateur Tor (ou tout autre client Tor) crée automatiquement un circuit Tor composé de trois nœuds : un nœud d’entrée, un nœud intermédiaire et un nœud de sortie. Ce processus est effectué sans intervention de l’utilisateur.  
Source : [Types de relais Tor](https://tpo.pages.torproject.net/web/community/fr/relay/types-of-relays/?utm_source=chatgpt.com)

### Nombre de nœuds

Le nombre de nœuds par circuit est normalement fixé à trois (entrée, intermédiaire et sortie) pour des raisons de performance et d’anonymat. Cependant, ce nombre peut varier en fonction des paramètres du réseau ou de l’utilisateur, mais dans la majorité des cas, il est de trois. Le client Tor gère ce processus en fonction de la configuration par défaut.

> Le chemin entre ces relais est déterminé au moment de la connexion, mais pas à l’avance.

*) Chaque relais ne connaît que la machine précédente et suivante, mais pas l’intégralité du chemin (il y a tout un processus d’établissement de circuit qui se fait en arrière-plan lorsqu’on se connecte au réseau Tor, par exemple juste en ouvrant un navigateur Tor).

### Sélection aléatoire et rotation

- Les nœuds sont choisis aléatoirement parmi les nœuds disponibles dans le réseau Tor.
    
- De plus, les circuits sont régulièrement changés, ce qui peut entraîner la sélection de nouveaux nœuds pour un même utilisateur afin de garantir un niveau élevé d’anonymat.  
    Source : [Recherche sur la rotation des Guard nodes](https://blog.torproject.org/research-problem-better-guard-rotation-parameters)
    

*) Tor utilise des algorithmes distincts pour sélectionner les nœuds Guard, Middle et Exit (parmi les critères de choix : la sûreté, la bande passante, la stabilité...).

### Personnalisation avancée

Pour les utilisateurs avancés, il existe des options dans Tor pour influencer la sélection des nœuds (par exemple, choisir des nœuds spécifiques via les "bridge relays" ou modifier des paramètres dans le fichier de configuration), mais cela reste une fonctionnalité avancée. En règle générale, le navigateur Tor s’occupe de tout.

---

## 5. Tor Directory

### Système décentralisé qui stocke les infos des différents nœuds (c’est un répertoire décentralisé)

### 1. Rôle du Tor Directory

Le Tor Directory sert à fournir des informations sur les nœuds du réseau Tor. Cela inclut :

- Les adresses IP et les clés publiques des relais Tor
    
- Les informations de consensus concernant l’état et la validité des relais
    
- Les mises à jour du consensus qui indiquent quels relais sont fiables, disponibles, et en bon état pour être utilisés dans le réseau


> Ces informations sont utilisées pour construire un circuit Tor en permettant au client de savoir quels relais sont disponibles et comment se connecter à eux de manière sécurisée.

### 2. Fonctionnement du Tor Directory

Le réseau Tor repose sur un mécanisme de répertoire décentralisé qui permet aux clients de récupérer les informations nécessaires pour établir des circuits. Voici comment cela fonctionne :

- Les "Directory Authorities" (autorités de répertoire) sont des serveurs spéciaux qui maintiennent une copie à jour des informations sur les relais Tor. Elles signent des informations sur les relais et les stockent dans un fichier de consensus.
    
- Le fichier de consensus contient des informations comme :
    
    - L’adresse IP de chaque relais
        
    - La clé publique du relais
        
    - L’état du relais (fonctionnel ou non)
        
    - Le rôle du relais (entrée, intermédiaire, sortie)
        
- Lorsqu’un client Tor veut se connecter au réseau, il récupère d’abord le fichier de consensus à partir des autorités de répertoire.
    
- Ensuite, en utilisant ce fichier, le client sélectionne aléatoirement trois relais (un d’entrée, un intermédiaire, un de sortie) et établit un circuit sécurisé à travers eux.

### 3. Importance du Tor Directory

- Il protège le processus de sélection de relais contre les attaques potentielles, comme les attaques Sybil (où un attaquant crée plusieurs relais pour contrôler le réseau).
    
- Il permet de garantir que les relais ne peuvent pas cacher leur identité ou leur activité en jouant sur des informations fausses dans un réseau de répertoire. Les autorités de répertoire assurent une certaine intégrité des informations.

---

## 6. Directory Authorities

- Le but de ces autorités est de garantir qu’aucune seule entité ne puisse contrôler ou manipuler la sélection des relais ou l’intégrité des informations dans le réseau Tor. Cela rend le système plus résilient et décentralisé.
    
- Elles génèrent le "consensus".

Sources :

- [Directory Authority Policies](https://community.torproject.org/relay/governance/policies-and-proposals/directory-authority/)
    
- [Tor Directory Specification](https://spec.torproject.org/dir-spec/outline.html)
    
- [Relay Status Metrics](https://metrics.torproject.org/rs.html#search/flag:authority)

---

## 7. Temps de rotation des relais

- **Relais Guard** : fréquence de rotation par défaut de 60 jours (2 mois), avec un mécanisme pouvant déclencher un changement plus tôt en cas d’inactivité ou de compromis.
    
- **Relais Middle et Exit** : ne sont pas concernés par cette rotation longue. Ces relais sont sélectionnés dynamiquement pour chaque circuit, qui dure environ 10 minutes. Leur rotation est donc fréquente et automatique.

Sources :

- [Durée de vie d’un circuit](https://tor.stackexchange.com/questions/262/for-how-long-does-a-circuit-stay-alive)
    
- [Timeouts et spécifications du chemin](https://tpo.pages.torproject.net/core/torspec/path-spec/learning-timeouts.html)

---

## 8. Options de configuration du relais Tor

- [Manuel officiel Tor](https://2019.www.torproject.org/docs/tor-manual.html.en)

---

## 9. Sélection du chemin et contraintes

- Le chemin est choisi pour chaque nouveau circuit **avant sa construction**, basé sur les dernières informations de répertoire.
    
- Le nœud de sortie est choisi **en premier**, suivi des autres nœuds dans l’ordre (exemple pour un circuit à 3 nœuds : sortie (hop 3), entrée (hop 1), puis intermédiaire (hop 2)).
    
- Un nœud peut avoir plusieurs rôles (middle, exit, etc.) dans des circuits différents, mais **pas dans un même circuit**.

Sources :

- [Spécifications du chemin](https://spec.torproject.org/path-spec/path-selection-constraints.html)
    
- [Options pour ne pas être middle relay](https://tor.stackexchange.com/questions/12727/can-i-opt-to-be-not-middle-relay)
    
- [Configuration des relais de sortie](https://community.torproject.org/fr/relay/setup/exit/)

---

## 10. Protocoles de base

- [Documentation officielle du protocole Tor](https://spec.torproject.org/index.html)

---

## 11. Limitations liées à la détection et à la sécurité

> **Note importante** : lorsque vous déchiffrez une couche, vous ne savez pas combien de couches restent.

client ---A---(tor node) ----- .... ---B--- server

### Inconvénients

- Si vous écoutez au point A (relais d’entrée), vous voyez uniquement que le client utilise Tor, rien d’autre.
    
- Si vous écoutez au point B (relais de sortie), vous découvrez qu’un utilisateur Tor visite un certain site web.

### Que se passe-t-il si un attaquant contrôle à la fois A et B ?

- Oui, il peut commencer à découvrir ce qui se passe grâce à une **analyse de trafic (traffic correlation)** : même si le contenu est chiffré, le rythme, la taille et le nombre de messages peuvent suffire à deviner ce qui se passe.
    
- Tor tente d’éviter cela en ayant un profil standard pour tous les utilisateurs (via les attributs du navigateur), et en utilisant des paquets de taille fixe (512 octets) quel que soit le contenu, afin de rendre plus difficile la corrélation.
    

> Cette attaque est difficile mais possible, c’est un point faible de Tor. Elle peut être atténuée en multipliant les relais, diversifiant les nœuds (pays différents) et utilisant des techniques de camouflage.

### Hidden Services (Dark Web)

- Le serveur se déplace à l’intérieur du réseau Tor, ne quittant jamais le réseau Tor.
    
- Le circuit ne sort jamais vers Internet public, ce qui rend toute corrélation de trafic quasi impossible.
    
- Le trafic est simplement des messages Tor qui se ressemblent tous.

---

## 12. Ce qui peut nuire à l’anonymat même avec Tor

1. Logiciels qui créent des connexions directes (ex: Flash, Skype) qui ignorent Tor et exposent votre vraie IP.
    
2. Fichiers contenant des métadonnées (ex: photos avec GPS).
    
3. Empreinte numérique du navigateur (fingerprinting).
    
4. Connexion à des comptes liés à votre vraie identité.

---

## 13. Comprendre les Hidden Services et le Dark Web

Les **Hidden Services** sont au cœur du Dark Web. Ce sont des sites web ou services qui fonctionnent entièrement à l’intérieur du réseau Tor, sans jamais quitter ce dernier. Grâce à ce mécanisme, les serveurs restent invisibles et très difficiles à localiser, renforçant ainsi la confidentialité et l’anonymat des utilisateurs et des opérateurs.

Pour mieux comprendre en détail le principe et le fonctionnement des Hidden Services, ainsi que leur rôle central dans le Dark Web, l’un des meilleurs articles disponibles est celui publié dans la revue scientifique MDPI :  
**“A Survey on the Dark Web: Concepts, Platforms, and Challenges”**  
accessible ici : [https://www.mdpi.com/2624-800X/1/3/25](https://www.mdpi.com/2624-800X/1/3/25)

Cet article explique en profondeur comment fonctionnent les Hidden Services, leurs spécificités techniques et leur importance dans l’écosystème du Dark Web.

---

# Ressources complémentaires

- [Types de relais Tor](https://tpo.pages.torproject.net/web/community/fr/relay/types-of-relays/?utm_source=chatgpt.com)
    
- [Rotation des Guard nodes](https://blog.torproject.org/research-problem-better-guard-rotation-parameters)
    
- [Spécifications du chemin dans Tor](https://spec.torproject.org/path-spec/path-selection-constraints.html)
    
- [Manuel du relais Tor](https://2019.www.torproject.org/docs/tor-manual.html.en)
    
- [Autorités de répertoire Tor](https://community.torproject.org/relay/governance/policies-and-proposals/directory-authority/)
    
- [Spécifications du protocole Tor](https://spec.torproject.org/index.html)
    
- [Configuration des relais de sortie](https://community.torproject.org/fr/relay/setup/exit/)
    
- [Durée de vie d’un circuit Tor](https://tor.stackexchange.com/questions/262/for-how-long-does-a-circuit-stay-alive)
    
- [Fonctionnement des Onion Services (Hidden Services)](https://community.torproject.org/onion-services/overview/)

### Vidéos explicatives

- **Tor Hidden Service (c’est le Dark Web)**  
    [https://www.youtube.com/watch?v=lVcbq_a5N9I](https://www.youtube.com/watch?v=lVcbq_a5N9I)
    
- **Deep & Dark Web**  
    [https://www.youtube.com/watch?v=joxQ_XbsPVw](https://www.youtube.com/watch?v=joxQ_XbsPVw)  
    [https://www.youtube.com/watch?v=oiR2mvep_nQ](https://www.youtube.com/watch?v=oiR2mvep_nQ)
    
- **How do Onion Services work?**  
    [https://www.youtube.com/watch?v=gIkzx7-s2RU](https://www.youtube.com/watch?v=gIkzx7-s2RU) (différence entre VPN et Tor)
    
- **How Tor Works (chiffrement)**  
    [https://www.youtube.com/watch?v=LAcGiLL4OZU](https://www.youtube.com/watch?v=LAcGiLL4OZU)
    
- **Simulation pour expliquer ce que Tor fait et HTTPS**  
    [https://tor-https.eff.org/](https://tor-https.eff.org/)



