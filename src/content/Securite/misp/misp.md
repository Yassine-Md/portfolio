# **MISP : Plateforme Collaborative de Partage de Renseignements sur les Menaces**

## **Résumé**

La prolifération des menaces cybernétiques exige des solutions efficaces pour la détection, la corrélation et le partage d'indicateurs de compromission (IoC). MISP (Malware Information Sharing Platform & Threat Sharing) s'impose comme une plateforme open source incontournable pour faciliter la collaboration entre organisations. Cet article présente une vue d'ensemble complète de MISP, ses fonctionnalités clés, son architecture, ses mécanismes d'intégration, ainsi que ses cas d'usage concrets.

---

## **1. Introduction**

La gestion de la menace cybernétique repose de plus en plus sur la capacité à détecter, analyser et partager rapidement les indicateurs de compromission. Dans ce contexte, MISP constitue un système centralisé mais interconnecté permettant aux entreprises, agences gouvernementales et chercheurs en cybersécurité de mutualiser leurs connaissances. Ce système permet de construire une base de données collective et exploitable à des fins de détection proactive et de réponse rapide.

---

## **2. Présentation Générale de MISP**

### 2.1 Définition

MISP est une plateforme de Threat Intelligence développée pour faciliter le partage, le stockage et la corrélation d'informations sur les menaces (cyberattaques, fraudes, vulnérabilités, etc.). Elle est utilisée pour structurer et automatiser l'échange d’indicateurs de compromission entre partenaires de confiance.

> _“MISP is a threat intelligence platform for sharing, storing and correlating Indicators of Compromise of targeted attacks, threat intelligence, financial fraud information, vulnerability information or even counter-terrorism information.”_

### 2.2 Philosophie du Partage

MISP repose sur la collaboration volontaire entre communautés de confiance, appelées _sharing communities_. Chaque organisation peut choisir les données qu’elle souhaite partager et en définir la portée (locale, inter-communautaire, publique). La plateforme agit à la fois comme moteur de recherche interne et référentiel global de connaissances partagées.

---

## **3. Fonctionnalités Clés**

### 3.1 Structure de Données

- **Événements** : unité centrale contenant les IoC, métadonnées, taxonomies, etc.
    
- **Attributs** : informations précises (IP, hash, domaine…) liées à un événement.
    
- **Tags / Taxonomies** : classification selon des standards (ex. TLP, Admiralty Scale).
    
- **Objects** : structures avancées (ex : email, phishing, malware analysis).
    
- **Galaxies** : regroupement d'informations contextuelles (APT groups, malware families...).
    

### 3.2 Corrélation Automatique

MISP permet une corrélation locale et inter-serveurs des événements à travers les attributs. Ces corrélations révèlent des liens entre différentes attaques ou campagnes malveillantes.


## Taxonomie et Classification dans MISP

### 3.3 Traffic Light Protocol (TLP)

Le TLP est un système de classification standardisé pour contrôler la diffusion d'informations sensibles :

- **TLP:RED** : Information strictement confidentielle, limitée aux participants spécifiques
    
- **TLP:AMBER** : Information restreinte à l'organisation et ses partenaires de confiance
    
- **TLP:GREEN** : Information communautaire, partageable au sein de la communauté cyber
    
- **TLP:WHITE** : Information publique, sans restriction de diffusion


### 3.4 Définition des Galaxies

Les **galaxies** dans MISP sont des **ensembles de données prédéfinies et structurées** qui permettent de regrouper, catégoriser et enrichir les événements MISP avec des informations contextuelles. Elles facilitent l'analyse des menaces en fournissant des "contextes" ou "dimensions" communes et standardisées.

On peut voir une galaxie comme un **catalogue thématique** regroupant des objets qui représentent, par exemple, des groupes de cybercriminels, des logiciels malveillants, des techniques d'attaque, ou encore des campagnes de menaces.

### 3.4.1 Détails techniques

- Une galaxie est un fichier JSON structuré qui contient un ensemble de "clusters" (groupes).
    
- Chaque **cluster** correspond à un élément spécifique : un malware (ex : Emotet), un acteur (ex : APT28), une campagne, une technique ATT&CK, etc.
    
- Ces clusters peuvent être attachés aux événements dans MISP pour enrichir les données.

### 3.4.2 Exemples concrets

#### Exemple 1 : Galaxy "Threat Actor"

- Galaxy : "Threat Actor" (Acteurs de menaces)
    
- Clusters : APT28 (groupe russe), Lazarus Group (groupe nord-coréen), etc.
    
- Utilisation : Si un événement MISP mentionne une attaque attribuée à APT28, on peut attacher ce cluster à l'événement.

#### Exemple 2 : Galaxy "Malware"

- Galaxy : "Malware"
    
- Clusters : Emotet, WannaCry, TrickBot, etc.
    
- Utilisation : En cas d'infection détectée par Emotet, attacher le cluster correspondant pour mieux contextualiser.

#### Exemple 3 : Galaxy "MITRE ATT&CK"

- Galaxy : "MITRE ATT&CK"
    
- Clusters : Techniques et tactiques utilisées dans les cyberattaques.
    
- Utilisation : Identifier les techniques utilisées lors d'un incident, par exemple T1059 (Execution Command).

### 3.5 Qu’est-ce qu’un **Cluster** ?

Un **cluster** est un **élément** ou une **entité spécifique** au sein d’une galaxie.

#### Pour simplifier :

- Imagine que la galaxie est une bibliothèque.
    
- Chaque cluster est un livre dans cette bibliothèque.
    
- Chaque "livre" décrit un sujet bien précis (par exemple, un malware précis comme Emotet, un groupe d’attaquants comme APT28 (Fancy Bear), ou une technique d’attaque).


### 3.5.1 Comment un cluster enrichit un événement dans MISP ?

Un événement MISP est une **collection d’informations sur une menace**, comme des adresses IP, des fichiers suspects, des URL, etc.

#### Sans galaxie :

- L’analyste doit décrire manuellement le contexte : "Cet événement est lié à Emotet".
    
- Cela reste souvent peu structuré et peut être oublié.

#### Avec galaxie & cluster :

- L’analyste peut **attacher directement le cluster "Emotet" à l’événement**.
    
- Cela donne à l’événement une **étiquette normalisée et riche en contexte**.

---

## **4. Collecte et Enrichissement de Données**

### 4.1 Feeds et Sources Externes

La plateforme peut consommer des flux externes de données provenant de sources publiques, commerciales ou communautaires. L’ajout de ces flux s’effectue via :

- `Sync Actions → List Feeds`
    
- Activation des _feeds_ via _"Load default feed metadata"_
    

Le statut des flux peut être vérifié dans `Administration → Jobs`.

### 4.2 Enrichissement Automatique

MISP intègre des modules d’enrichissement permettant de compléter automatiquement les attributs via des services externes (ex: VirusTotal, PassiveTotal, CIRCL…). Ces enrichissements peuvent être appliqués :

- À l’ensemble d’un événement
    
- À un attribut spécifique via l’interface
    

**Activation** :  
`Administration → Server Settings & Maintenance → Plugin Settings → Enrichment`

Les résultats sont ajoutés sous forme de nouveaux attributs ou de commentaires.

---

## **5. Intégration avec des Outils Tiers**

### 5.1 Protocoles de Communication

MISP supporte des standards d’échange comme :

- **STIX / TAXII**
    
- **API REST** (via PyMISP ou scripts personnalisés)
    
- **Export CSV, JSON, NIDS, etc.**
    

### 5.2 Automatisation de la Réponse

Les informations peuvent être automatiquement transmises aux outils de sécurité :

- **Firewalls** (Palo Alto, Fortinet)
    
- **IDS/IPS** (Suricata, Snort)
    
- **EDR/AV** (CrowdStrike, SentinelOne…)
    

**Exemples :**

- Blocage automatique d'une IP par le firewall si elle figure dans les IoC.
    
- Mise en quarantaine d'un fichier malveillant connu par son hash.
    
- Mise à jour des règles Suricata via les attributs MISP.
    

---

## **6. Cas d’Usage**

### 6.1 Détection Locale et Corrélation

Une organisation peut charger ses propres IoC et les corréler avec ceux présents dans les bases de données locales ou partagées. Cette analyse permet de détecter des attaques en cours ou passées.

### 6.2 Partage Sélectif

Les IoC collectés peuvent être partagés selon des règles personnalisées :

- Par communauté
    
- Par classification (TLP, etc.)
    
- Par type d’attribut
    

### 6.3 Import de Données

L’interface permet :

- L’ajout manuel ou via fichier (texte, CSV, JSON)
    
- L’import groupé via l’outil _Free Text Import_
    

---

## **7. Fonctionnalités Avancées**

### 7.1 Système de Sightings

Les _sightings_ permettent aux utilisateurs de signaler qu’un attribut a été observé, confirmant ainsi sa validité ou au contraire son obsolescence.

### 7.2 Decay Model

Un attribut peut être associé à un modèle de dépréciation, afin qu’il perde en pertinence au fil du temps (ex : une IP utilisée seulement durant une attaque ponctuelle).

### 7.3 Export Personnalisé

En cas d’incompatibilité directe avec un outil, MISP permet l’export des données :

- Par format (CSV, STIX, NIDS)
    
- Par filtre (tag, event ID, source…)


### **7.4 Advanced Correlation dans MISP**

##### Définition :
La **corrélation avancée** est le mécanisme par lequel MISP relie automatiquement les événements et attributs similaires, connexes ou identiques.

#### Types de corrélation :

#### 1. **Exact matching**

- Deux attributs identiques (e.g., même IP, même hash) → corrélation immédiate.
    
- Affichage dans la colonne "Related Events".

#### 2. **Type-based correlation**

- Corrélation entre différents types mais de même catégorie logique (ex : URL ↔ domaine).
    
- Utilisé dans certains modules et objets.

Certains types d’attributs sont **logiquement liés** mais ne sont pas identiques.
    
- Exemples :
    
    - Un domaine (`domain`) peut être lié à une URL (`url`) si la URL contient ce domaine.
        
    - Une adresse IP publique peut être liée à un nom d’hôte.
        
- MISP peut appliquer des règles spécifiques par type pour détecter ce genre de corrélation, notamment dans le cadre d’objets complexes ou enrichissements.

#### 3. **Fuzzy Hashing / ssdeep**

- Les **hashs flous (fuzzy hashes)** sont des empreintes de fichiers permettant de détecter des similitudes **approximatives** entre fichiers.
    
- MISP utilise notamment le **ssdeep**, un algorithme de fuzzy hashing très populaire.
    
- Par exemple, deux malwares dont les fichiers ont un ssdeep similaire à 80% sont considérés comme apparentés.
    
- Cette méthode permet de détecter :
    
    - Des variantes de malwares modifiées légèrement.
        
    - Des campagnes liées utilisant des familles de malwares apparentées.
        
- L’analyse fuzzy hashing se fait souvent via des modules d’enrichissement ou plugins dans MISP.

#### 4. **Correlation via Galaxy / Tag **

- MISP utilise aussi des **galaxies** (clusters thématiques) pour regrouper des événements.
    
- Deux événements tagués avec le même cluster (ex : `APT28`, `Emotet`) seront considérés comme liés.
    
- Cette corrélation est sémantique et permet d’établir des connexions basées sur des concepts de menace connus.
    
- Les tags et taxonomies jouent aussi un rôle de lien entre différents événements ou attributs.

#### **5. Corrélation d’objets complexes**

- Un **objet MISP** est une structure regroupant plusieurs attributs (ex : un objet "email" avec expéditeur, destinataire, sujet, pièce jointe).
    
- Si deux objets similaires (même type, mêmes valeurs clés) sont détectés dans différents événements, MISP peut les corréler.
    
- Exemple : plusieurs événements contenant un objet "file" avec le même hash SHA256 sont liés.
#### 6. **Cross-server correlation**

- Si plusieurs serveurs MISP sont synchronisés, les corrélations peuvent aussi être effectuées entre des **événements distants**.


#### 7. **Behavioral Correlation / TTPs Matching**

Corrélation comportementale basée sur les **TTPs (Techniques, Tactiques, Procédures)** d’un acteur malveillant, souvent représentés via **MITRE ATT&CK**.

Objectifs : 
- Identifier si des événements (ou groupes d’attributs) utilisent les **mêmes techniques** que celles connues pour un acteur APT.
    
- Détecter **l’empreinte comportementale** plutôt que la signature technique brute.

Fonctionnement :
- Les **galaxies MITRE ATT&CK** dans MISP listent les TTPs : ex. `T1059.001 - PowerShell`
    
- Lorsqu’un événement ou objet inclut des **commandes**, **scripts**, ou **actions** typiques, MISP peut faire une **corrélation par TTP**
    
- Ex : usage de `powershell -enc` → lié à `T1059.001`


#### 8. **Infrastructure Correlation**

Corrélation basée sur les **infrastructures réseau** ou techniques partagées par plusieurs campagnes ou événements :

- Adresses IP
    
- Serveurs C2
    
- Certificats SSL
    
- Fournisseurs Cloud / hébergeurs

Objectifs :
- Identifier une **infrastructure réutilisée** par un même groupe ou malware.
    
- Lier plusieurs campagnes à **un acteur commun** même sans IOC identique.

Mécanismes :
- Corrélation d'attributs réseau : IP, ports, ASN, certificat, DNS, WHOIS, etc.
    
- Corrélation sur objets : `network-connection`, `domain`, `x509`
    
- Corrélation enrichie via modules externes (ex : Shodan, Passive DNS, certificate transparency)

##### Exemple :

- Deux événements différents pointent vers des domaines différents mais avec **même adresse IP**, **même certificat**, ou **même ASN** → corrélation.

#### 9. **Pattern-Based Correlation (Corrélation Basée sur des Motifs)**

La **pattern-based correlation** (corrélation par motifs) est une méthode qui consiste à **détecter des similarités structurelles ou syntaxiques** entre des données, même si les valeurs exactes ne sont pas identiques.

> Contrairement à la corrélation par correspondance exacte (exact matching), ici l’objectif est de **repérer des structures ou des formes récurrentes** dans les indicateurs de compromission (IoCs), typiquement via **des expressions régulières**, **des préfixes**, **des chaînes de formats**, etc.


Objectif : 
- Repérer des **comportements constants** dans les attaques (ex : schémas d’URL, de nom de fichiers, d’e-mails, etc.).
    
- Détecter des **variantes** d’une même menace qui échappent à la détection par correspondance exacte.
    
- Identifier des IoCs **générés dynamiquement** ou **pseudo-aléatoires** mais selon un pattern identifiable.



---

## 9. Ressources Officielles

Pour approfondir l’utilisation de MISP et explorer ses fonctionnalités avancées, voici une sélection de **ressources officielles et documentées** issues du projet MISP :

### Liens Utiles

- **Dépôt principal du projet MISP (code source & issues)**  
    [https://github.com/MISP/MISP](https://github.com/MISP/MISP)
    - Le dépôt contient l’ensemble des composants du projet, incluant l’interface web, les scripts de synchronisation, les modules externes, etc.  
	- **Chaque module** (comme les modules d’enrichissement, de conversion, ou d’export) **dispose de son propre fichier `README.md`**. Ces fichiers fournissent des explications détaillées sur la configuration, l’usage, les dépendances, et parfois des exemples d’appel d’API

- **Annonce officielle de la version 2.4.93 avec les nouveautés clés**  
    [https://www.misp-project.org/2018/06/27/MISP.2.4.93.released.html](https://www.misp-project.org/2018/06/27/MISP.2.4.93.released.html/)
    
- **Documentation d’administration (README.md du MISP Book)**  
    [https://github.com/MISP/misp-book/blob/main/administration/README.md](https://github.com/MISP/misp-book/blob/main/administration/README.md)