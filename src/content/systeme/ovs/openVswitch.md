---
title: "Open vSwitch (OVS) : Virtualisation Réseau et SDN pour Infrastructures Cloud"
description: Découvrez Open vSwitch (OVS), le commutateur virtuel open source clé des architectures SDN et cloud. Cet article explore son architecture, son intégration avec OpenFlow, ses optimisations matérielles
pubDate: 2025-06-27T00:00:00.000Z
author: Madhbouh Yassine
tags:
  - OVS
  - OVSDB
  - SDN
  - Open-vSwitch
  - QoS
  - OpenFlow
  - SegmentationRéseau
---

# Open vSwitch (OVS) : Virtualisation et Contrôle des Commutateurs Réseaux

Open vSwitch (OVS) est un logiciel conçu pour virtualiser les fonctionnalités des commutateurs réseaux en émulant leur comportement au niveau logiciel. Il constitue une brique essentielle dans la construction d’architectures SDN (Software Defined Networking). OVS permet d’assurer les fonctionnalités classiques d’un commutateur (filtrage, transfert, acheminement) entre machines virtuelles (VMs) ou conteneurs Docker.

OVS joue un rôle clé en connectant des VMs ou des conteneurs dans un réseau virtualisé. Il est fréquemment utilisé conjointement avec des contrôleurs SDN qui pilotent les règles de commutation, faisant d’OVS un agent d’exécution des règles définies par ces contrôleurs.

De plus, Open vSwitch peut être contrôlé à distance via des protocoles standards tels qu’OpenFlow, permettant une gestion centralisée des règles réseau.

------------------------------------------------------------------------
## Architecture d’Open vSwitch

OVS se compose principalement de deux parties :

- **Le datapath (plan de données)**  
    Implémenté généralement sous forme d’un module noyau (`openvswitch.ko`), le datapath assure un transfert rapide des paquets au niveau kernel. Il maintient en mémoire une table de flux (flow table) correspondant aux règles applicables.
    
    - Si un paquet correspond à une règle, il est traité directement dans le noyau.
        
    - Sinon, il est transmis au plan de contrôle pour décision.

- **Le daemon `ovs-vswitchd` (plan de contrôle local)**  
    C’est un processus utilisateur chargé de gérer la configuration du commutateur, la communication avec le contrôleur SDN, et la gestion des règles de flux.
    
    - Il échange avec les contrôleurs SDN via des protocoles comme OpenFlow.
        
    - Il traite les paquets ne correspondant à aucune règle dans le datapath (paquets "miss").
        
    - Lorsqu’un paquet ne correspond à aucune règle, il est envoyé à `ovs-vswitchd`, qui décide de l’action à prendre (installation d’une règle, envoi au contrôleur, suppression du paquet).
        
    - Il orchestre la communication avec le contrôleur SDN, garantissant ainsi la cohérence de la politique réseau globale.

---

## Distinguer le rôle des différents plans dans Open vSwitch 

**ressources** : Open vSwitch Architectural Overview (documentation officielle)

Dans Open vSwitch, bien que la séparation classique entre plan de données (datapath) et plan de contrôle soit respectée, le plan de contrôle n’est pas uniquement délégué au contrôleur SDN externe. Le daemon `ovs-vswitchd` contient en effet un **plan de contrôle local** qui peut prendre des décisions de manière autonome, sans systématiquement consulter le contrôleur SDN distant.

Consulter à chaque fois le contrôleur SDN externe pour prendre une décision réseau pourrait entraîner des délais importants, surtout dans des environnements à fort trafic où la latence est critique. Pour optimiser la performance et la réactivité, `ovs-vswitchd` agit donc comme un intermédiaire intelligent .

### Fonctionnement concret

- Lorsqu’un paquet arrive et ne correspond à aucune règle dans le datapath, il est envoyé à `ovs-vswitchd`.
    
- Ce dernier analyse le paquet et peut décider d’installer immédiatement une nouvelle règle dans le datapath pour gérer les paquets similaires à venir, ce qui évite de surcharger le contrôleur.
    
- Si la situation nécessite une politique globale ou plus complexe, `ovs-vswitchd` communique avec le contrôleur SDN pour obtenir des instructions spécifiques.

- appliquant les flux OpenFlow déjà installés localement. Ce n’est **qu’en l’absence totale de règles correspondantes** qu’il transmet le paquet au contrôleur — **et seulement si un contrôleur est configuré**.
    
- Le **datapath ne supporte pas les wildcards** : il ne conserve que des règles exact-match pour garantir un traitement rapide des paquets.
    
- En revanche, **`ofproto-dpif` contient la table OpenFlow complète**, avec des **règles wildcardées** plus générales. Lorsqu’un paquet correspond à l’une de ces règles, `ovs-vswitchd` **exécute les actions** prévues, puis **installe une règle exacte dans le datapath** afin d’accélérer le traitement des paquets similaires à l’avenir — **sans devoir remonter à nouveau**.

```

        +-------------------+
        |  Contrôleur SDN   | (OpenFlow)
        +---------+---------+
                  |
        +-------------------+
        |   ofproto (wild)  |  <-- Règles avec wildcards
        +---------+---------+
                  |
        +-------------------+
        |   Datapath (fast) |  <-- Exact-match uniquement
        +---------+---------+
                  |
                Paquet
```


---

## Introduction au SDN (Software Defined Networking)

Le SDN est une architecture réseau visant à rendre les réseaux plus flexibles, programmables et centralisés en séparant les fonctions du réseau en deux plans distincts :

1. **Plan de contrôle** : Partie qui prend les décisions sur l’acheminement des paquets.
    
2. **Plan de données** : Partie qui achemine effectivement les paquets d’un point à un autre.
    

Dans cette architecture, les décisions sont centralisées dans un contrôleur SDN, tandis que les équipements réseau au niveau du plan de données exécutent les instructions reçues sans prendre de décisions locales.

L’abstraction offerte par le SDN masque les détails physiques du réseau (emplacement des équipements, chemins d’acheminement) au profit d’une gestion simplifiée basée sur des politiques globales définies par les administrateurs.

Les contrôleurs SDN utilisent des protocoles comme OpenFlow pour communiquer avec les équipements réseau.

---

## Avantages du SDN

- **Réduction des coûts** : En séparant le plan de contrôle du plan de données, SDN permet d'utiliser des équipements réseau plus simples (souvent appelés white boxes), car ils n'ont pas besoin d'inclure des fonctionnalités avancées de routage. Cela peut conduire à des économies en matière de matériel.
    
- **Évolutivité** : Capacité à gérer facilement des réseaux de grande taille.
    
- **Automatisation et orchestration** : Mise en place aisée de processus automatisés pour la gestion réseau.
    
- **Flexibilité et agilité** : Modification en temps réel des politiques de routage, de sécurité ou de gestion de la bande passante.

Le SDN facilite la configuration centralisée et l’optimisation des réseaux, rendant la gestion plus efficace qu’avec une configuration manuelle et locale de chaque équipement.

---

## Logiciels SDN et dispositifs de plan de données

Pour mettre en œuvre une architecture SDN, il est nécessaire d’avoir :

- **Contrôleurs SDN (plan de contrôle)** : OpenDaylight, ONOS, Ryu, Cisco, etc. Ces logiciels agissent comme le « cerveau » de l’architecture.
    
- **Dispositifs physiques ou virtuels (plan de données)** : Commutateurs ou routeurs (réels ou virtualisés) qui exécutent les ordres du contrôleur SDN.

---

## Protocole OpenFlow

OpenFlow est un protocole clé qui permet la communication entre un contrôleur SDN centralisé et les équipements réseau (switches, routeurs). Il offre un mécanisme pour configurer dynamiquement les tables de flux des équipements.

### Fonctionnalités principales

- Communication entre contrôleur et équipements via des messages spécifiques :
    
    - **Packet-In** : Le switch informe le contrôleur de l’arrivée d’un paquet inconnu.
        
    - **Flow-Mod** : Le contrôleur installe ou modifie une règle de flux dans le switch.
        
    - **Packet-Out** : Le contrôleur demande au switch d’envoyer un paquet spécifique.
        

### Mode de fonctionnement

- Lorsqu’un paquet arrive sur un switch OpenFlow, celui-ci vérifie s’il existe une règle dans sa table de flux :
    
    - Si oui, l’action définie est appliquée (transmettre, modifier, bloquer).
        
    - Sinon, le paquet est envoyé au contrôleur via un message Packet-In.
        
- Le contrôleur décide de l’action à prendre, installe une règle correspondante via Flow-Mod, ce qui permet au switch de gérer ensuite ce type de paquet localement.

Grâce à cette architecture, le contrôleur dispose d’une vue globale du réseau, facilitant la gestion, la surveillance et la détection d’anomalies.

---

## Intégration matérielle d’Open vSwitch

L’un des atouts majeurs d’Open vSwitch réside dans sa capacité à s’intégrer non seulement dans des environnements purement logiciels (machines virtuelles, conteneurs), mais aussi à s’adapter au matériel réseau physique pour offrir des performances de traitement encore plus élevées. Cette fonctionnalité est connue sous le nom **d’intégration matérielle** (_hardware integration_).

### Offloading vers le matériel : une optimisation du datapath

Par défaut, le chemin de données d’OVS (datapath) est exécuté au niveau du noyau Linux via un module (`openvswitch.ko`), ce qui permet un traitement efficace des paquets. Cependant, ce datapath est conçu pour être **"déporté"**, c’est-à-dire transféré, vers du **matériel spécialisé**, tel que :

- des **commutateurs physiques** (châssis de switch classiques avec des chipsets spécialisés),
    
- ou des **cartes réseau intelligentes (SmartNICs)** hébergées sur les serveurs finaux.
    

Ce mécanisme d’offloading permet de déléguer le traitement des paquets à des circuits matériels (ASIC, FPGA, etc.) capables d’exécuter les mêmes règles de flux définies dans OVS, tout en offrant **une latence plus faible**, **un débit plus élevé** et **une consommation CPU réduite**.

### Support de chipsets matériels

Plusieurs fabricants travaillent activement à rendre leurs puces compatibles avec OVS

### Contrôle unifié des environnements physiques et virtuels

Un autre avantage stratégique de cette intégration est la possibilité d’appliquer une **même logique de gestion réseau** à la fois sur des équipements physiques et des systèmes virtualisés. Cela signifie que :

- Les **switches matériels** peuvent exposer les mêmes **interfaces de contrôle (OpenFlow, OVSDB)** qu’un OVS logiciel,
    
- Le **contrôleur SDN** peut piloter uniformément tous les équipements — qu’ils soient logiciels ou matériels — à travers une **interface de gestion centralisée**.
    

Ainsi, que l’infrastructure soit composée de serveurs virtualisés, de conteneurs, ou de commutateurs physiques, le plan de contrôle (via OVS) peut appliquer **les mêmes politiques réseau automatisées**, favorisant l’homogénéité, la programmabilité et la maintenance simplifiée.


---

## Gestion de la QoS, des ACLs et des politiques de sécurité avec OVS

Open vSwitch ne se limite pas à la simple commutation de paquets entre machines virtuelles ou interfaces réseau. Il intègre également des **fonctionnalités avancées de réseau**, permettant de **garantir la performance**, **renforcer la sécurité**, et **appliquer des politiques de gestion du trafic** précises. Ces fonctionnalités sont essentielles dans les environnements cloud, virtualisés et SDN.

### Qualité de service (QoS)

Open vSwitch prend en charge des **mécanismes de QoS (Quality of Service)**


### Listes de contrôle d’accès (ACL)

OVS permet également la définition de **règles ACL (Access Control List)** pour filtrer le trafic réseau selon divers critères

* Ces règles sont définies au niveau des tables de flux OpenFlow ou via OVSDB


### Sécurité dynamique et micro-segmentation via SDN

En environnement SDN, l’un des apports majeurs d’OVS est sa capacité à **appliquer des politiques de sécurité dynamiques** et granulaires, pilotées à distance par un contrôleur.

* La **micro-segmentation** consiste à isoler le trafic entre unités logiques (VMs, services, conteneurs) au sein d’un même réseau physique ou virtuel.

les règles peuvent être générées ou modifiées en temps réel selon le comportement du réseau.


## Sécurité automatisée

Dans une architecture SDN, le contrôleur central peut surveiller le comportement du réseau en recevant des messages `packet-in` envoyés par les switches (comme OVS) lorsqu’un paquet ne correspond à aucune règle.

Lorsqu’un **comportement anormal** est détecté par exemple un **scan de ports**, une **tentative d’accès non autorisé entre segments réseau**, ou un **débit inhabituel** le contrôleur peut :

- **générer une alerte** en temps réel ;
    
- **transmettre cette alerte** à un système de détection ou de supervision externe (SIEM)

Cela permet une **intégration fluide avec des outils de sécurité**

---

### **OVSDB : la base de données de configuration d’Open vSwitch**

**ressource** : https://docs.openvswitch.org/en/latest/ref/ovsdb.7/

Open vSwitch utilise une base de données appelée **OVSDB (Open vSwitch Database)** pour gérer toute sa configuration locale, de façon **indépendante du plan de contrôle OpenFlow**. Il s'agit d'une base de données **transactionnelle légère**, conçue spécifiquement pour répondre aux besoins de gestion réseau. OVSDB stocke des informations structurées telles que la configuration des **bridges**, des **interfaces**, des **ports**, des **VLANs**, ou encore l’adresse du **contrôleur SDN**.

En interne, OVSDB fonctionne comme un **serveur local accessible via une API JSON-RPC**, généralement exposé sur le port **6640**. Cette base peut être manipulée directement avec des outils comme `ovs-vsctl`, mais elle est aussi **pilotable à distance via l’API**, ce qui permet son intégration dans des plateformes de gestion comme **OpenStack**, **Kubernetes** (via les plugins CNI), ou d'autres orchestrateurs de réseau.

Grâce à cette architecture, OVSDB permet à Open vSwitch de disposer d’une configuration **persistante, modifiable dynamiquement**, et parfaitement adaptée aux environnements **automatisés ou distribués**.

* OVSDB est décrite par un **schéma JSON**
* Il s’agit d’une base de données **NoSQL orientée colonnes**, fortement typée, et modifiable à chaud.
* La base est maintenue par le processus **`ovsdb-server`**, qui peut gérer plusieurs bases (par ex. `Open_vSwitch`, `hardware_vtep`, etc.).
* peut assurer des **transactions atomiques** avec des garanties d'intégrité.
* Le protocole supporte les (notification en temps réel des changements)
* `ovsdb-server` interagit avec `ovs-vswitchd` en interne : ce dernier lit la configuration via une **connexion locale (Unix socket)**.
- Le processus `ovs-vswitchd` applique dynamiquement les changements issus d’OVSDB sans redémarrage
- Il est possible de sécuriser l’accès via **certificats TLS**, notamment pour les connexions distantes à l’API.



-----------------------
## Ressources

[**Data Centre Networking: What is OVS?** – Ubuntu Blog](https://ubuntu.com/blog/data-centre-networking-what-is-ovs)  

[**Open vSwitch Architectural Overview** – Documentation officielle](https://docs.openvswitch.org/en/latest/topics/porting/#open-vswitch-architectural-overview)  
Description détaillée de l’architecture interne d’OVS, utile pour comprendre les interactions entre les composants (`ovs-vswitchd`, datapath, OVSDB…).

[**Understanding Open vSwitch (Part 1, 2 et 3)** – Medium Ozcan Kasal](https://medium.com/%40ozcankasal/understanding-open-vswitch-part-1-fd75e32794e4))
Un excellent article en trois parties qui vulgarise les concepts fondamentaux d’OVS, avec illustrations et explications progressives.

[**Recherche OVS sur le site NVIDIA**](https://www.nvidia.com/en-us/search/?q=ovs&page=1)  

https://www.intel.com/content/www/us/en/developer/articles/technical/implementing-an-openstack-security-group-firewall-driver-using-ovs-learn-actions.html

https://docs.openvswitch.org/en/latest/howto/qos

---

https://www.redhat.com/en/blog/amazing-new-observability-features-open-vswitch


