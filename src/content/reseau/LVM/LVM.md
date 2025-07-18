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

# Comprendre LVM : Logical Volume Manager sous Linux

## Peut-on partager un point de montage sur plusieurs disques à la fois ?

![LVM.png](/reseau/LVM/LVM.png)

Est-ce qu’un point de montage, un répertoire, peut être partagé sur plus d’un disque à la fois (plusieurs partitions) ?

**Réponse :**

Non, un point de montage ou un répertoire dans un système de fichiers Linux ne peut pas être monté directement sur plusieurs disques ou partitions à la fois.

Si vous tentez de monter une deuxième partition sur le même point de montage, cela masque automatiquement le contenu de la partition précédemment montée (pour garantir l’hierarchie du système Linux).

Lorsqu’une partition ou un disque est monté à un point spécifique, ce point est utilisé exclusivement pour accéder au contenu de cette partition.

**Cependant**, cette limitation, qui semble contraignante, n’est plus un vrai problème grâce à LVM (Logical Volume Manager). LVM agit comme une couche d’abstraction entre les partitions physiques et le système de fichiers, ce qui permet de regrouper plusieurs partitions ou disques physiques en un seul volume logique. Ce volume logique unique peut ensuite être monté sur un point de montage classique, rendant ainsi transparente la gestion de plusieurs disques sous un même "espace" logique.

---

## Introduction à LVM (Logical Volume Manager)

LVM introduit un concept d'abstraction des disques, ce qui simplifie énormément la gestion du stockage. Grâce à LVM, il n'est plus nécessaire de se préoccuper des détails physiques des partitions et des disques, car LVM offre une couche flexible entre le matériel et les systèmes de fichiers.

### Limites de la gestion classique sans LVM

- Par exemple, pour pouvoir étendre une partition, comme `/`, il faut qu'elle ait de l'espace disponible **derrière** elle sur le disque, ce qui n'est pas toujours facile à prévoir.
- Il est également nécessaire de définir à l'avance la taille exacte de chaque partition, ce qui peut entraîner un gaspillage d'espace si une partition est surdimensionnée ou des limitations si elle est trop petite.
- La gestion devient encore plus complexe lorsque plusieurs disques sont impliqués, car il n'est pas possible de créer une partition qui s'étend sur plusieurs disques. On est limité à ce que chaque disque peut contenir.

---

## Avantages de LVM

Avec LVM, ces limitations sont levées :

- Il est possible d'agrandir ou de réduire les volumes logiques dynamiquement, indépendamment de leur emplacement physique.
- LVM permet de regrouper plusieurs disques ou partitions en un seul pool (le groupe de volumes), ce qui facilite l'allocation d'espace et permet de créer des volumes logiques qui peuvent s'étendre sur plusieurs disques.

---

## Fonctionnalités avancées de LVM

- **Snapshots** : LVM permet de faire des snapshots, c’est-à-dire des copies instantanées d’un volume à un instant donné.
- **Striping** : technique pour améliorer les performances d’entrées/sorties (I/O) en distribuant les données sur plusieurs disques physiques.

### Striping dans LVM (parallélisme d’écriture/lecture)

- Les données sont divisées en segments (ou "stripes") de taille fixe, qui sont ensuite écrits sur plusieurs disques physiques de manière parallèle.
- Par exemple, si vous avez deux disques physiques (D1 et D2) et que vous configurez un volume logique avec striping, la première portion de données sera écrite sur D1, la suivante sur D2, et ainsi de suite.
- En lecture ou en écriture, plusieurs disques peuvent être sollicités simultanément, ce qui permet de cumuler les performances I/O des disques.
- Cela optimise les performances, particulièrement utile dans les scénarios de grande volumétrie ou de hautes performances (bases de données, applications à gros débit).

---

## Les volumes logiques (LVs) dans LVM : une vue simplifiée

- Un volume logique joue un rôle similaire à celui d'une partition classique, en ce sens qu'il contient un système de fichiers et peut être monté à un point de montage comme `/`, `/home`, ou `/var`.
- Cependant, contrairement aux partitions fixes d'un disque, un volume logique est abstrait du matériel physique et repose sur une couche intermédiaire.
- Les volumes logiques peuvent être configurés avec des options avancées comme le striping, les snapshots ou la redondance (via RAID logiciel).

---

## Gestion des groupes de volumes (VG) dans LVM

### Plusieurs VG (Groupes de volumes distincts)

- Dans cette configuration, chaque VG est indépendant et contient son propre ensemble de PV (Physical Volumes) et de LV (Logical Volumes).

**Avantages :**

- Isolation des ressources : Chaque VG peut être utilisé pour une application, un utilisateur ou un service différent.

**Inconvénients :**

- Complexité accrue : Vous devez gérer plusieurs VG séparément.
- Moins de flexibilité : Les disques physiques d’un VG ne peuvent pas être utilisés pour un autre VG, sauf si vous les réaffectez manuellement.
- Plusieurs VG ne peuvent pas partager le même disque physique (PV) en même temps. Un disque ou une partition marquée comme Physical Volume (PV) peut être assigné à un seul VG à la fois.


### Mirroring (Redondance des données)

LVM permet de configurer des volumes logiques en **miroir**, c’est-à-dire que les données sont automatiquement dupliquées sur plusieurs disques physiques. Cela correspond au fonctionnement du **RAID 1**, où chaque écriture est répliquée sur deux (ou plusieurs) disques pour assurer la redondance.

#### À différencier du RAID logiciel classique (`mdadm`)

Bien que le **mirroring LVM** fournisse une forme de redondance, il est important de ne pas le confondre avec le **RAID logiciel pur**, comme celui géré par `mdadm`.

#### LVM RAID : une alternative intégrée

Depuis LVM2, il est possible de créer des **volumes logiques de type RAID** (RAID 1, RAID 5, RAID 6, RAID 10...) directement via LVM.  
Sous le capot, **LVM utilise `mdraid`** (le même moteur que `mdadm`) via le device-mapper, mais intègre cela dans l’écosystème LVM.

Ce mécanisme rend `mdadm` **facultatif**, mais ce **n’est pas une solution identique**.

#### Pourquoi `mdadm` reste parfois préférable ?

Bien que LVM RAID offre une abstraction pratique, **`mdadm` reste plus adapté dans des contextes critiques**, car il offre :

- **Un diagnostic plus précis**
    
- **Une gestion plus granulaire**
    
- **Une meilleure intégration avec les outils de supervision** (Prometheus, Nagios,...)
    

#### Exemple : Surveillance et alertes

- Avec `mdadm`, tu peux configurer des alertes par mail (`MAILADDR` dans `/etc/mdadm.conf`).
    
- Il s’intègre facilement à des outils de monitoring comme **Prometheus**, **Nagios**, **Zabbix**, etc.
    
- En revanche, **LVM RAID n’a pas de supervision native intégrée** : il faut mettre en place des solutions personnalisées.
    
> C’est le **prix de l’abstraction** : tu gagnes en simplicité, mais tu perds en contrôle fin.

---

### LVM avec chiffrement (LUKS/dm-crypt)

LVM peut être utilisé **en combinaison avec LUKS (Linux Unified Key Setup)**, un système de chiffrement standard basé sur **`dm-crypt`**, pour créer des **volumes logiques chiffrés**.

Ce type de configuration permet de **protéger les données au repos**, même si un disque est volé ou physiquement copié

---

### **Thin Provisioning (Volumes logiques fins)**

> LVM permet la création de volumes dits _thin-provisioned_, qui allouent l’espace disque à la demande au lieu de tout réserver à la création.

Ce mécanisme repose sur l’utilisation de **thin pools**, qui sont des pools d’espace de stockage partagé dans lesquels plusieurs volumes logiques fins (thin LVs) peuvent être créés. Le pool alloue physiquement l’espace uniquement quand les données sont effectivement écrites, ce qui optimise l’utilisation du stockage.

---

### Performances et limitations de LVM

L’utilisation de LVM ajoute une **couche d’abstraction logicielle** entre le système de fichiers et les disques physiques, via le **device-mapper** du noyau Linux. Cette architecture permet une grande flexibilité (redimensionnement, snapshots, RAID logiciel, thin provisioning...), mais soulève aussi des questions sur les performances.

> **Impact sur les performances ?**

Dans la majorité des cas, **l’impact de LVM sur les performances est +- faible**, parfois **négligeable**. En effet, le système Linux passe déjà par plusieurs couches de mappage pour traduire une opération comme “écris ce fichier” en blocs physiques sur disque. LVM ne fait que modifier cette étape de mappage sans ajouter d’étapes supplémentaires significatives dans le pipeline d’I/O.

**Deux limitations importantes à connaître**

1. **Compatibilité multi-systèmes** :  c'est dépendant de l'os. Un lvm linux ne fonctionne pas comme les disques dynamiques windows par exemple, donc... pas de multiboot, ni de multi-système avec ce genre de montage (mais tu peut faire un multi boot entre différentes distrib linux).

2. **Risque de perte de données** : si tu utilise un lvm réparti sur plusieurs disques, il faut bien être conscient que la perte d'un disque, te fait tout perdre. (c'est pour cela qu'on couple souvent du lvm avec des solutions raid).


----

## Remarques importantes

- On n’est pas obligé de créer des partitions pour créer un LV, mais c’est une pratique courante lorsqu’on souhaite créer un LV sans utiliser tout le disque, parce qu’une partie du disque peut être réservée à un autre VG.
- LVM permet d’étendre une partition à travers plusieurs disques.

---

## Conclusion

- Un point de montage ne peut pas être monté directement sur plusieurs partitions/disques à la fois.
- LVM offre une abstraction qui permet de gérer plusieurs disques comme un seul volume logique, monté sur un point unique.
- Cette abstraction facilite la gestion du stockage, la flexibilité d’allocation, la montée en charge, et offre des fonctionnalités avancées comme le striping, les snapshots, et la redondance.

--- 

## ressources : 
https://docs.redhat.com/fr/documentation/red_hat_enterprise_linux/6/html/logical_volume_manager_administration

* https://docs.redhat.com/fr/documentation/red_hat_enterprise_linux/6/html/logical_volume_manager_administration/striped_volumes
* https://tldp.org/HOWTO/LVM-HOWTO/
* https://recoverhdd.com/blog/comparison-and-difference-between-raid-lvm-and-mdadm.html (Comparison and difference between RAID lvm and mdadm)
* https://unix.stackexchange.com/questions/150644/raiding-with-lvm-vs-mdraid-pros-and-cons
* https://wiki.archlinux.org/title/Dm-crypt/Encrypting_an_entire_system (encreption Scenarios et ses limites)
* https://man7.org/linux/man-pages/man7/lvmthin.7.html  (man !!!!)
* https://unix.stackexchange.com/questions/7122/does-lvm-impact-performance (perfermance)
* https://hrcak.srce.hr/en/file/216661  {research paper}(LVM IN THE LINUX ENVIRONMENT: PERFORMANCE EXAMINATION) (Je n’ai pas tout lu, ce n’est pas toujours facile à tout saisir, mais c’est vraiment passionnant de creuser dans les détails.)
