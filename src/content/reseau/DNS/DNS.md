---
title: "DNS : Fonctionnement, Sécurité et Bonnes Pratiques"
description: Cet article explique le processus DNS lors du chargement d'une page web, détaillant les types de requêtes, les enregistrements clés et les bonnes pratiques de configuration et de sécurité.
pubDate: 2025-06-27T00:00:00.000Z
author: Madhbouh Yassine
tags:
  - DNS
  - BIND
  - DNSSEC
  - DoT
  - DoH
  - DNS_Security
  - Records
---


# Les DNS et le chargement d’une page web

## 1. Les 4 serveurs DNS impliqués dans le chargement d’une page web

- **DNS recursor (récursive)** :  
    On peut le voir comme un bibliothécaire qui cherche un livre précis dans une grande bibliothèque.  
    C’est un serveur qui reçoit les requêtes DNS des clients (navigateurs, applications). Il est responsable de faire d’autres requêtes (vers les serveurs racines, TLD, serveurs autoritaires) pour résoudre complètement la requête.
    

---

## 2. Les 3 types de requêtes DNS

### Requête DNS Récursive

- Le client (souvent appelé "résolveur DNS") demande au serveur DNS une réponse complète et définitive.
    
- Le serveur DNS prend en charge tout le processus de recherche, jusqu’à obtenir la réponse finale ou un message d’erreur si la résolution échoue.
    
- **Caractéristique principale** : Le client ne fait qu’une seule requête, tout le travail est effectué par le serveur récursif qui retourne la réponse complète.
    

**Avantages :**

- Centralisation du contrôle.
    

**Inconvénients :**

- Cible possible d’attaques de type _cache poisoning_.
    
- Charge importante sur le serveur, qui doit gérer toute la résolution.
    

---

### Requête DNS Itérative

- Le serveur DNS répond soit par une réponse complète, soit par une "référence" (referral) à un autre serveur DNS.
    
- C’est alors au client de poursuivre la recherche en interrogeant lui-même les serveurs indiqués, jusqu’à obtenir la réponse finale.
    

**Caractéristique principale** :

- Le client effectue plusieurs requêtes successives à différents serveurs DNS en suivant les références.
    

---

### Requête DNS Non Récursive

- Utilisée lorsque le serveur DNS possède déjà la réponse en cache.
    
- Il répond directement sans interroger d’autres serveurs.
    

---

#### Résumé des différences d’utilisation

| Type de requête | Qui l’utilise ?                           | Fonctionnement principal                              | Avantages                                | Inconvénients                                   |
| --------------- | ----------------------------------------- | ----------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Récursive       | Clients finaux (ordinateurs, smartphones) | Le serveur DNS résout entièrement la requête          | Simplicité côté client, réponse complète | Charge importante sur serveur, cible d’attaques |
| Itérative       | Serveurs DNS entre eux                    | Le client interroge plusieurs serveurs successivement | Répartition de la charge, plus flexible  | Complexité côté client                          |
| Non récursive   | Serveur avec cache                        | Réponse immédiate à partir du cache                   | Très rapide si réponse en cache          | Limité aux réponses en cache                    |

---

## 3. Les différents types d’enregistrements DNS (DNS Records)

### MX (Mail Exchange Record)

- Indique les serveurs de messagerie d’un domaine.
    
- Une requête DNS sur un domaine pour un email retourne un ou plusieurs enregistrements MX.
    
- La priorité est indiquée par un nombre : plus le nombre est bas, plus la priorité est élevée.
    

---

### NS (Name Server Record)

- Spécifie les serveurs DNS responsables de la gestion des enregistrements DNS d’un domaine (serveurs autoritaires).
    
- Un enregistrement NS contient un nom de domaine pointant vers un serveur DNS.
    
- On interroge les serveurs indiqués par les enregistrements NS pour obtenir la gestion DNS du domaine.
    

---

### PTR (Pointer Record)

- Enregistrement de reverse DNS (inverse d’un A record). Il associe une IP à un nom de domaine.
    
- Utilisé notamment pour la vérification d’identité des serveurs d’email (anti-spam).
    
- Les serveurs de messagerie utilisent souvent PTR pour valider qu’une IP correspond à un nom de domaine légitime.
    
- Améliore la confiance et réduit les risques d’abus comme le spam ou les attaques DDoS.
    
- Permet d’identifier facilement une machine derrière une adresse IP, important pour la sécurité.
    

---

### TXT Records

- Stocke des informations sous forme de texte (librement).
    
- Utilisé pour la prévention du spam et la vérification de propriété de domaine.
    
- Exemples :
    
    - **DKIM (DomainKeys Identified Mail)** : Permet de vérifier que les emails proviennent bien du domaine indiqué grâce à une signature cryptographique stockée dans un enregistrement TXT.
        
        - Limite : certains champs ne sont pas signés, ce qui peut être exploité.
            
    - **SPF (Sender Policy Framework)** : Définit quels serveurs sont autorisés à envoyer des emails pour un domaine donné.
        
        - Permet d’éviter l’usurpation d’adresse (spoofing).
            
        - Les emails qui ne passent pas SPF peuvent être rejetés ou marqués comme spam.
            

---

### SOA (Start Of Authority)

- Contient les informations administratives sur une zone DNS.
    
- Chaque zone DNS doit avoir un enregistrement SOA.
    
- Contient notamment :
    
    - MNAME (serveur maître)
        
    - RNAME (email de l’administrateur, format spécial avec `.` remplacé par `@`)
        
    - Numéro de série unique
        
    - Informations de timing (TTL, etc.)
        
- Généralement créé automatiquement lors de l’achat d’un domaine.
    
- Exemple : Si SOA pointe vers Google, cela signifie que Google gère la zone DNS du domaine.
    

---

### SRV Record

- Enregistrement spécifiant l’emplacement d’un service spécifique dans un domaine.
    
- Structure :
    
    - Name : spécifie le service, le protocole, et le domaine
        
    - Value : priorité, poids, port, cible (serveur)
        
- Permet la découverte de services réseau, facilitant la connexion sans connaître précisément le serveur.
    
- Utilités : abstraction, flexibilité, load balancing, redondance.
    
- Exemple : Pour un service VoIP (SIP), il indique le serveur, protocole, port et priorité.
    

---

### NAPTR Record (Naming Authority Pointer Record)

- Utilisé pour la réécriture dynamique des noms et l’orientation vers des services spécifiques.
    
- Analogie : un central téléphonique qui oriente vers le bon service selon la touche appuyée.
    
- Peut enchaîner plusieurs redirections jusqu’au service final (qui peut être identifié par un SRV ou A/AAAA record).
    

---

## 4. Les serveurs racines DNS

- Il existe 13 serveurs racines principaux, identifiés de A à M.
    
- Chaque serveur est exploité par une organisation différente et est en réalité un réseau de serveurs répartis mondialement.
    
- Liste des opérateurs :
    
    - A-root : VeriSign, Inc.
        
    - B-root : University of Southern California (ISI)
        
    - C-root : Cogent Communications
        
    - D-root : University of Maryland
        
    - E-root : NASA Ames Research Center
        
    - F-root : Internet Systems Consortium, Inc. (ISC)
        
    - G-root : U.S. Department of Defense (NIC)
        
    - H-root : U.S. Army Research Lab
        
    - I-root : Netnod
        
    - J-root : VeriSign, Inc.
        
    - K-root : RIPE NCC
        
    - L-root : ICANN
        
    - M-root : WIDE Project
        
- Ces serveurs ont des adresses IP principales, mais sont déployés en multiples serveurs de redondance à travers le monde.


# Configuration et fichiers de Bind

## Fichiers de zones "db.*"

Les fichiers `db.<nom>` sont des fichiers de zones fournis par défaut dans Bind pour une configuration de base, permettant au serveur DNS de démarrer avec des zones essentielles.

- **db.local** : Résolution du nom `localhost`
    
- **db.127** : Zone inverse pour l’adresse IP `127.0.0.1` (loopback)
    
- **db.root** : Contient la liste des serveurs de noms racine (root servers) d’Internet (comme `a.root-servers.net`, `b.root-servers.net`, etc.)
    
    - Ce fichier configure la zone racine, essentielle pour que le serveur DNS puisse démarrer la résolution en partant des serveurs racine.
        

---

## Fichiers principaux de configuration Bind

### named.conf.options

C’est l’un des fichiers de configuration principaux de Bind, servant à définir les options globales du serveur DNS.

Exemple de structure générale :
options {
    directory "/var/cache/bind";          # Répertoire de travail
    listen-on port 53 { 127.0.0.1; };    # IPv4 écoutée
    listen-on-v6 port 53 { ::1; };        # IPv6 écoutée
    allow-transfer { none; };             # Transferts de zone interdits par défaut
    recursion yes;                       # Activation de la récursion
    allow-recursion { localnets; localhost; };  # Autorisation de récursion
    forwarders {
        8.8.8.8; 8.8.4.4;                # Serveurs vers lesquels transférer les requêtes non résolues
    };
    querylog yes;                        # Journalisation des requêtes
    dnssec-validation auto;              # Validation DNSSEC activée
    auth-nxdomain no;                   # Ne pas se comporter comme serveur autoritaire pour NXDOMAIN
    rate-limit { responses-per-second 10; };    # Limitation des requêtes
    max-cache-ttl 86400;                # TTL max cache positif (24h)
    max-ncache-ttl 3600;                # TTL max cache négatif (1h)
};


**Explications des options clés :**

- **directory** : répertoire où Bind stocke fichiers temporaires et caches
    
- **listen-on / listen-on-v6** : adresses IP/ports écoutés
    
- **allow-transfer** : restriction des transferts de zone
    
- **recursion / allow-recursion** : activation et contrôle de la récursion DNS
    
- **forwarders** : serveurs DNS vers lesquels on transmet les requêtes non résolues
    
- **querylog** : pour journaliser les requêtes, utile en debug
    
- **dnssec-validation** : sécurisation via DNSSEC
    
- **rate-limit** : protection contre abus et attaques DDoS
    
- **max-cache-ttl / max-ncache-ttl** : durée de vie des caches positifs et négatifs
    

---

### named.conf.local

Ce fichier sert à déclarer les zones DNS spécifiques à votre configuration.

---

### named.conf.default-zones

Contient les définitions des zones par défaut incluses avec Bind.

---

## Sécuriser l'accès : ACL dans BIND

Avant de définir les options globales du serveur DNS dans le fichier `named.conf.options`, **il est possible (et recommandé) de définir des ACL (Access Control Lists)**.

Exemple :

acl "lan" {
    192.168.1.0/24;
    localhost;
    localnets;
};

**Cette ACL doit être déclarée avant le bloc `options`.**  

Une ACL dans BIND permet de **regrouper plusieurs adresses IP ou plages d'adresses sous un nom unique**, ce qui facilite la configuration.  

Le **nom de l’ACL** peut être utilisé ensuite dans :

- `allow-query`
    
- `allow-transfer`
    
- `allow-recursion`
    

**`localnets`** est un mot-clé spécial qui **représente toutes les adresses IP associées aux interfaces réseau locales de la machine**. Cela inclut automatiquement toutes les IP des sous-réseaux connectés, sans besoin de les déclarer manuellement.


### Utilité du DNS Cache Server dans des cas spécifiques

#### Connexion partagée (ex : modem, point d’accès)

Lorsque vous utilisez une machine pour **partager une connexion Internet**, plusieurs appareils (ordinateurs, téléphones, tablettes) doivent résoudre des noms de domaine.

Si aucun serveur DNS de cache n’est utilisé :

- **Chaque appareil envoie sa propre requête DNS** vers un serveur externe (ex : Google DNS)
    
- Cela **multiplie inutilement les requêtes**, surtout sur des connexions lentes
    

Le **serveur DNS cache** permet d’**éviter les résolutions répétées** et d’**améliorer les performances réseau**, en particulier pour :

- les connexions bas débit (ex : modem RTC)
    
- les passerelles de partage de connexion
    

---

### Ordre des serveurs interrogés : impact sur la performance

L’ordre dans lequel le résolveur DNS choisit les serveurs à interroger est **important pour la rapidité et la fiabilité** :

#### Ordre des **Forwarders**

- Si le premier serveur DNS est lent ou ne répond pas, **le résolveur passe au suivant**
    
- Un bon ordre garantit **des réponses rapides et fiables**
    

#### Ordre des **Serveurs NS (autoritatifs)**

Quand un domaine a plusieurs serveurs (ex : `ns1`, `ns2`, ...), le résolveur choisit **comment** interroger :

1. **Round-Robin** :  
    ➝ Répartition équitable entre les serveurs pour équilibrer la charge
    
2. **Latency-Based Routing** :  
    ➝ Choisit le serveur ayant le **meilleur temps de réponse**
    

Choix stratégique :

- Round-Robin : charge équilibrée
    
- Latency-based : performance maximale

---

## Sécurisation et bonnes pratiques

- `version "SECRET";` masque la version de Bind pour limiter l’exposition aux vulnérabilités.
    
- Interdire ou restreindre les transferts de zone via `allow-transfer` pour éviter les fuites d’informations DNS.
    

---

## Résolution sans forwarders

Si l’option `forwarders` est désactivée ou absente, le serveur DNS fera la résolution en interrogeant directement les serveurs racine, puis les TLD, et enfin les serveurs autoritaires.  
Cela augmente la charge réseau et de calcul sur votre serveur DNS.

---

## Serveurs DNS autoritaires et haute disponibilité

- Un domaine peut avoir plusieurs serveurs DNS autoritaires (NS records), ce qui permet :
    
    - Haute disponibilité
        
    - Tolérance aux pannes
        
    - Répartition de charge
        
    - Résilience aux attaques
        
- L’ordre de spécification des serveurs (forwarders, NS records) peut impacter performances et fiabilité.
    

---

## Transfert de zone

Permet la réplication des données DNS entre serveurs maître et esclaves.

- **AXFR** : transfert complet de la zone.
    
- **IXFR** : transfert incrémentiel, ne transmet que les changements.
    

**Sécurité :**

Le **transfert de zone** est un mécanisme fondamental du DNS permettant de répliquer les données entre serveurs (ex : d’un serveur maître à un secondaire).

**Ce processus est une cible potentielle pour les attaques.**

#### Mécanismes de sécurité recommandés :

1. **ACL (Access Control List)**  
    ➝ Restreindre le transfert de zone aux serveurs DNS de confiance  
    ➝ Exemple : autoriser seulement certaines IP à faire un `zone transfer`
    
2. **Chiffrement (VPN, DNSSEC)**  
    ➝ Permet de **protéger les échanges** DNS lors du transfert  
    ➝ Peu utilisé dans les déploiements simples, mais possible dans des environnements critiques
    
3. **TSIG (Transaction Signature)**  
    ➝ Utilise des **clés partagées** pour signer les messages DNS  
    ➝ Assure **authenticité** et **intégrité** des messages entre serveurs
    

> **À noter** :  
> TSIG **ne chiffre pas** les messages DNS. Il **les signe**, à la manière du **chiffrement asymétrique**, pour vérifier qu'ils proviennent bien du bon serveur et qu’ils n’ont pas été modifiés.

---

### Rappel essentiel :

> Il y a **toujours un serveur maître (primaire)** pour chaque zone DNS. C’est lui qui fait autorité sur les enregistrements, et les serveurs secondaires synchronisent leurs données à partir de celui-ci.

---

## Structure d’un fichier de zone

1. Directive `$TTL`
    
2. Enregistrement `SOA` (Start of Authority)
    
3. Enregistrement `NS` (serveurs autoritaires)
    
4. Enregistrements `A` / `AAAA` (IP)
    
5. Enregistrement `MX` (mail)
    
6. ...
    
7. Enregistrement `SRV` (services spécifiques)
    

---

## Délégation de sous-domaines

- Nécessaire lorsque le sous-domaine est géré par un serveur DNS différent du domaine parent.
    
- Le domaine parent conserve uniquement l’enregistrement NS pointant vers le serveur délégué.
    
- Sans délégation, le sous-domaine ne sera pas résolu (`NXDOMAIN`).
    

**Cas particuliers :**

- Si sous-domaines sur le même serveur/dans le même fichier de zone, la délégation n’est pas nécessaire.
    
- La synchronisation des enregistrements NS entre zones parent et enfant est cruciale pour éviter les erreurs de résolution.
    

---

## Vérification de la délégation

Commande :

	dig <nom_domaine> NS

Une réponse dans la section `ANSWER` avec des serveurs NS indique la délégation.

---

## Les limites techniques de la délégation DNS

### 1. Les enregistrements NS et leur présence dans les deux zones (parent et enfant) :

Les enregistrements **NS (Name Server)** spécifient les serveurs DNS autoritaires pour un domaine donné. Normalement, ces enregistrements sont stockés à la fois dans la zone de l'enfant et dans la zone parent.

- **Zone enfant** : l'enregistrement NS indique les serveurs DNS autoritaires qui sont responsables de la gestion du domaine ou du sous-domaine.
    
- **Zone parent** : ces mêmes enregistrements doivent aussi être présents dans la zone parent. La zone parent, par exemple le domaine `.fr` dans le cas d’un domaine `caf.fr`, doit contenir des enregistrements NS pointant vers les serveurs DNS responsables de `caf.fr`.
    

**Problème** : Ces enregistrements NS doivent être **identiques dans les deux zones** (parent et enfant). Cependant, ce n'est pas toujours le cas, et cette **incohérence peut causer des erreurs** lors de la résolution DNS.  
Les résolveurs DNS, lorsqu'ils cherchent à résoudre un nom de domaine, commencent par les serveurs DNS racines, puis suivent la chaîne de délégations à travers les enregistrements NS. Si les enregistrements ne sont pas synchronisés entre la zone parent et la zone enfant, cela peut entraîner des **échecs de résolution**.

---

### 2. Limitation des enregistrements NS (pas de détails sur les caractéristiques des serveurs DNS) :

Les enregistrements NS ne donnent que les **noms des serveurs DNS autoritaires**, mais ne fournissent **aucune information supplémentaire**, telle que :

- Le **port utilisé** (qui est normalement le port 53, mais il pourrait y avoir des cas particuliers).
    
- La **capacité de communication sécurisée** par **DNS over TLS (DoT)**.
    

**Problème** : En l'absence d'informations sur la sécurité (comme DoT), les clients DNS ne savent pas à l'avance si le serveur DNS qu'ils contactent peut utiliser des connexions sécurisées.  
Actuellement, très peu de serveurs DNS prennent en charge DoT ou d'autres formes de communication sécurisée par défaut, ce qui pose un **risque de sécurité**.

---

### 3. Les enregistrements DS (DNSSEC) et leur gestion dans le domaine parent :

Les enregistrements **DS (Delegation Signer)** sont utilisés dans **DNSSEC** (DNS Security Extensions) pour sécuriser les zones DNS. Ces enregistrements contiennent des informations sur les **clés publiques** des serveurs DNS de la zone enfant, permettant de **vérifier l'intégrité des données DNS**.

- Ces enregistrements ne se trouvent que **dans la zone parent**.
    
    > C'est une exception à la règle, car normalement, tous les enregistrements sont supposés être dans la zone qu'ils concernent.  
    > Dans ce cas, les enregistrements DS sont dans la zone parent pour permettre de vérifier que la zone enfant est bien authentique et que les données n'ont pas été altérées.
    
- Le rôle du **registre parent** (comme le TLD ou la zone racine) est de **publier un haché cryptographique de la clé publique (DNSKEY)** de la zone enfant. Cela permet d’établir une **chaîne de confiance vérifiable via DNSSEC**.
    
- Lorsqu’un résolveur DNS rencontre une délégation (NS), il demande aussi le **DS dans la zone parent**, puis utilise ce DS pour **valider la signature DNSKEY** dans la zone enfant.

---

#### Cycle de déploiement / gestion

##### Zone Enfant (ex: example.com)

1. Génère ses clés :
   - ZSK (signe les enregistrements DNS)
   - KSK (signe la ZSK)

2. Publie dans sa zone :
   - Enregistrements DNSKEY (ZSK publique + KSK publique)

3. Transmet à la zone parente :
   - Hash de la KSK → pour créer le DS

##### Zone Parente (ex: .com)

4. Publie dans sa propre zone :
   - Enregistrement DS (hash de la KSK reçue)

##### Résolveur DNS 

5. Vérifie la chaîne de confiance :
   - DS (parente) → KSK (enfant) → ZSK → Données DNS


---

### 4. Glue Records dans le système DNS

Les **glue records** jouent un rôle essentiel dans la **résolution DNS** en évitant une dépendance circulaire, souvent désignée comme le **chicken-and-egg problem**.

Ce scénario se produit lorsqu’un serveur DNS autoritaire pour un domaine est lui-même désigné par un **nom de domaine situé dans la zone qu’il sert**.

Exemple :

- Domaine fictif : `example.tld`
    
- Serveur DNS autoritaire : `ns1.example.tld`
    

Pour interroger ce serveur, un résolveur DNS doit d’abord résoudre le nom `ns1.example.tld` afin d’obtenir son adresse IP.  
Cependant, la résolution de ce nom dépend elle-même de la zone `example.tld`, laquelle **ne peut être atteinte qu’en contactant `ns1.example.tld`**. Cela crée une **boucle de dépendance**.

**Solution** :  
La zone **parent** (dans ce cas `.tld`) doit inclure non seulement les **enregistrements NS** qui délèguent la zone `example.tld` à `ns1.example.tld`, mais également un **enregistrement A (ou AAAA)** fournissant **explicitement l’adresse IP** de `ns1.example.tld`.

Cette adresse IP ajoutée dans la zone parent constitue un **glue record**.  
Elle permet au résolveur de **contacter directement le serveur autoritaire**, sans avoir à résoudre son nom via le domaine qu’il dessert.

---

#### Exemple d’enregistrements dans la zone parent :

example.tld.     IN NS   ns1.example.tld.
ns1.example.tld. IN A    192.0.2.53

**Sans ce glue record**, le résolveur se retrouverait dans une **impasse** où il ne pourrait jamais atteindre le serveur autoritaire.

**L’inclusion de glue records est donc une exigence fondamentale** pour garantir la résolvabilité de zones utilisant des serveurs autoritaires internes à leur propre nom.

---


### Notes techniques complémentaires

#### Port par défaut (lié aux enregistrements NS)

> **Limitation des enregistrements NS : aucun port n'est précisé.**

- Par **défaut**, un client DNS suppose que le serveur qu’il contacte utilise le **port 53** (UDP ou TCP) pour les requêtes DNS.
    
- Les **enregistrements NS ne permettent pas de spécifier un port alternatif**. Si un serveur DNS fonctionne sur un port différent (ex : 1053 pour raisons de sécurité ou de configuration spécifique), le client **doit être configuré explicitement** pour en tenir compte.
    
- Sinon, le client **essaiera toujours** d’établir la connexion via **le port 53**, ce qui peut entraîner un **échec de communication** si le serveur n’écoute pas sur ce port.
    

**À retenir :** Cela limite la flexibilité des configurations DNS avancées côté client/serveur.

---

#### Sécurité par défaut : pas de DoT ou DoH

> **Aucune information sur les capacités de sécurité du serveur dans l'enregistrement NS.**

- Par défaut, les requêtes DNS sont effectuées **en clair** sur le port 53 (pas de chiffrement).
    
- Cela signifie que :
    
    - Les requêtes peuvent être **interceptées** ou **altérées**.
        
    - Le client **ne sait pas** si le serveur DNS supporte **DoT (DNS over TLS)** ou **DoH (DNS over HTTPS)**.
        
- Pour établir une connexion sécurisée :
    
    - Le **client** doit être **configuré** pour utiliser DoT ou DoH avec un serveur spécifique.
        
    - Le **serveur DNS** doit **annoncer cette capacité**, mais **rien dans les enregistrements DNS standards (NS)** ne le permet.
        

**Conséquence :**  
La sécurité des communications DNS dépend de **configurations manuelles** et **hors bande** (non déduites du DNS lui-même).

---

### Sécurité & Contrôle dans BIND

#### `rndc` – _Remote Name Daemon Control_

`rndc` est l’outil utilisé pour **contrôler le serveur BIND à distance** (redémarrage, rechargement de zone, vidage du cache, etc.) sans redémarrer manuellement le service.

**Clé de contrôle (`rndc.key`) :**

- Par défaut, `rndc` utilise une clé **partagée (TSIG)** pour authentifier les commandes.
    
- Si cette clé est absente ou mal configurée, **le serveur refuse toute commande `rndc`**, ce qui **évite les manipulations non autorisées**.
    

> **Bonne pratique :**  
> Toujours utiliser un fichier `rndc.key` généré automatiquement ou manuellement pour sécuriser l’accès à l’administration distante.  
>> Sinon, certaines configurations peuvent permettre un **contrôle non authentifié**, ce qui est un **risque majeur de sécurité**.

---

### Mises à jour dynamiques DNS (_Dynamic DNS Updates_)

BIND permet de mettre à jour dynamiquement les enregistrements DNS **sans modifier le fichier de zone manuellement**.

#### Activation via `allow-update` :

Dans le fichier de configuration de la zone (dans `named.conf`), la directive suivante autorise les mises à jour dynamiques :
```
allow-update { ... };
```

---

#### Dangers de `allow-update { any; }`

Autoriser les mises à jour depuis n'importe quelle source (`any`) est **extrêmement risqué** :

- **DNS Spoofing & Cache Poisoning :**
    
    > Un attaquant peut injecter de faux enregistrements (ex: rediriger vers des serveurs malveillants).
    
- **Attaques DoS :**
    
    > En envoyant massivement de fausses mises à jour, un serveur peut être surchargé ou désorganisé.
    
- **Manipulation de données critiques :**
    
    > Des enregistrements DNS vitaux (comme les enregistrements `NS`, `A`, `MX`) peuvent être supprimés ou modifiés à volonté.
    

---


### Ressources : 

- Fondamentaux du DNS : Concepts et Résolution de Noms : https://courses.cs.duke.edu/fall16/compsci356/DNS/DNS-primer.pdf

- [https://www.cloudflare.com/fr-fr/learning/dns/dns-records/dnskey-ds-records/](https://www.cloudflare.com/fr-fr/learning/dns/dns-records/dnskey-ds-records/)
    
- [https://serverfault.com/questions/180881/adding-ds-record-to-parent-in-dns](https://serverfault.com/questions/180881/adding-ds-record-to-parent-in-dns)
    
- [https://dn.org/glue-records-and-parent-child-zone-integrity-in-dns](https://dn.org/glue-records-and-parent-child-zone-integrity-in-dns)
    
- [https://notes.kodekloud.com/docs/Demystifying-DNS/DNS-as-a-System/Walking-the-DNS-Tree](https://notes.kodekloud.com/docs/Demystifying-DNS/DNS-as-a-System/Walking-the-DNS-Tree)


