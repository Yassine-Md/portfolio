---
title: 'Linux File System: Structure, Implementation, Optimisation & Evolution'
description: >-
  Découvrez l'architecture des systèmes de fichiers Linux leur évolution et
  leurs mécanismes clés et les techniques d'optimisation pour performances
  accrues
pubDate: 2025-06-27T00:00:00.000Z
author: Madhbouh Yassine
tags:
  - Linux
  - FileSystem
  - Inodes
  - Superblock
  - journalisation
  - Fragmentation
---
# Les Systèmes de Fichiers Linux : Architecture, Évolution et Optimisation

## Résumé

Ce document présente une analyse complète des systèmes de fichiers Linux, depuis leurs fondements historiques jusqu'aux optimisations modernes. Il examine l'évolution de la famille Ext (Extended File System), les structures de données fondamentales comme les inodes et les superblocks, ainsi que les techniques d'optimisation pour la gestion de la mémoire et la réduction de la fragmentation.

## 1. Introduction

Un système de fichiers Linux constitue une couche essentielle du noyau d'un système d'exploitation, servant à gérer le stockage et l'organisation des données de manière hiérarchique. Il permet de structurer les fichiers sur un disque dur ou une partition (segment spécifique de mémoire), garantissant leur lecture, leur écriture et leur gestion tout en assurant leur sécurité et leur accessibilité.

Dans une machine, il peut y avoir plusieurs partitions, chacune comportant un système de fichiers dédié. Ces systèmes de fichiers sont cruciaux pour la gestion efficace des données tout en préservant l'intégrité des informations.

## 2. Contexte Historique et Philosophie de Conception

### 2.1 Origines UNIX

Les systèmes de fichiers Linux trouvent leurs racines dans l'évolution des systèmes UNIX. Au départ, UNIX a été influencé par Multics (Multiplexed Information and Computing Service), qui a introduit des concepts fondamentaux tels que la virtualisation, le multi-utilisateur et la sécurité mémoire. Cependant, c'est UNICS (Uniplexed Information and Computing Service), devenu UNIX, qui a simplifié et modularisé l'architecture, permettant une gestion plus flexible des données, influençant directement l'évolution de Linux.

### 2.2 Philosophie de conception

Le slogan "Simplicité et performance" résume bien la philosophie de UNIX et de ses dérivés, où la simplicité reste une priorité pour la conception de systèmes efficaces et robustes.

## 3. Vue d'Ensemble des Systèmes de Fichiers Linux

### 3.1 Évolution de la famille Ext

La famille Extended File System (Ext) représente l'évolution principale des systèmes de fichiers Linux :

- **Ext (Extended File System)** : Le tout premier système de fichiers pour Linux, conçu initialement pour MINIX.
    
- **Ext2** : Premier système à supporter jusqu'à 2 To de données. Bien qu'il ait marqué une avancée, il souffrait d'un manque de journalisation, ce qui exposait les données aux risques de corruption en cas de panne.
    
- **Ext3** : Ext2 avec la journalisation, offrant ainsi une meilleure fiabilité.
    
- **Ext4** : Version moderne et optimisée, introduisant des améliorations en termes de performance, de capacité, et de sécurité, mais restant limité dans certains domaines, comme la gestion avancée des volumes ou la déduplication des données.
    

### 3.2 Objectifs fondamentaux

La conception d'un système de fichiers repose sur plusieurs objectifs fondamentaux :

1. **Abstraction et facilité d'utilisation** : Offrir des abstractions permettant aux utilisateurs de manipuler les fichiers de manière intuitive, sans se soucier des détails internes du stockage.
    
2. **Performance élevée** : Optimiser les performances en réduisant les surcoûts et en facilitant un accès rapide aux données.
    
3. **Protection et sécurité** : Garantir une isolation entre les applications et le système d'exploitation pour éviter les interférences ou corruptions de données.
    
4. **Mobilité** : Adapter le système de fichiers à des appareils de plus en plus compacts et variés, comme les SSD (Solid State Drives).
    
5. **Gestion des périphériques persistants** : Fournir des interfaces efficaces pour la gestion des périphériques de stockage, garantissant leur intégrité.
    

## 4. État de l'Art des Systèmes de Fichiers Linux

### 4.1 Analyse comparative Ext2, Ext3 et Ext4

**Ext2** : Ce système a marqué un tournant, mais l'absence de journalisation a limité sa fiabilité. Il était plus rapide et économisait de l'espace disque en comparaison avec les versions suivantes.

**Ext3** : L'introduction de la journalisation a amélioré la récupération des données après une panne, mais le système est resté relativement peu performant.

**Ext4** : Ext4 a été largement optimisé, offrant des performances accrues et des capacités étendues. Il introduit la gestion de blocs contigus, la journalisation améliorée et un chiffrement natif pour la sécurité des données. Cependant, Ext4 reste limité dans certains aspects comme la gestion des volumes ou la compression transparente.

### 4.2 Gestion des fichiers volumineux

Les systèmes modernes gèrent efficacement les fichiers volumineux grâce à plusieurs techniques :

- **Allocation par blocs et taille de bloc adaptative** : Pour les fichiers plus grands, la taille des blocs peut être adaptée pour mieux utiliser l'espace.
    
- **Indexation et métadonnées** : Les structures de données comme les B-trees et les tables de hachage sont utilisées pour améliorer l'accès aux données.
    
- **Clustering et réduction de la fragmentation** : Le mécanisme de clustering, utilisé dans Ext4, permet de stocker de gros fichiers dans des blocs contigus, réduisant ainsi la fragmentation.
    

## 5. Structures de Données Fondamentales
https://www.kernel.org/doc/html/latest/filesystems/ext4/directory.html
https://en.wikipedia.org/wiki/Ext4
### 5.1 Le superblock

Le superblock est une structure fondamentale qui contient des informations générales sur la partition, telles que :

- La taille totale de la partition
- Le nombre total de blocs
- Le nombre d'inodes disponibles

Il constitue la "colonne vertébrale" du système de fichiers, jouant un rôle crucial en suivant l'état général de la partition et en facilitant la gestion des fichiers et des métadonnées.

### 5.1.1 Liste rapide des inodes libres dans le superblock

En plus des informations générales sur la partition, le **superblock** contient également une **liste accélérée d'inodes libres** (free inode list), conçue pour améliorer les performances lors de la création de fichiers. Plutôt que de parcourir l'intégralité du **bitmap des inodes** à chaque demande, le système consulte d’abord cette liste, qui agit comme une **mémoire tampon** des inodes disponibles. Lorsqu’un inode est requis, un élément est extrait de cette liste si elle n’est pas vide, ce qui évite une recherche disque coûteuse. Cette liste est mise à jour **de manière paresseuse (lazy update)** : elle est régénérée ou complétée en arrière-plan, lorsque le système est peu sollicité ou lors de cycles de maintenance internes. Cette approche permet une allocation plus rapide tout en limitant l’impact sur les ressources pendant les périodes d’activité intensive.

![sb_inode_free_list_optimisation.png](/systeme/File System/sb_inode_free_list_optimisation.png)

### 5.2 Les direntries (entrées de répertoire)

Les direntries (ou entrées de répertoire) représentent un mécanisme simple mais efficace pour organiser les fichiers dans les répertoires. Chaque direntry contient :

- Le nom du fichier ou du répertoire
- L'identifiant de l'inode associé

Cette structure permet de relier chaque entrée de répertoire aux métadonnées correspondantes, ce qui rend la navigation et la gestion des répertoires intuitive et rapide.

![repo_inode_ex.png](/systeme/File System/repo_inode_ex.png)
=> **Représentation simple (juste à titre d’illustration)**
### 5.3 Organisation des répertoires (Directory Entries / Direntries)

#### Objectif général

Un **répertoire** dans un système de fichiers Linux est **un fichier spécial** contenant une **liste d'associations** entre **noms de fichiers** (ou sous-répertoires) et leurs **inodes correspondants**. Ces associations sont appelées **directory entries** ou **direntries**.

Chaque `direntry` est une **structure de données** qui permet de retrouver l'inode associé à un nom de fichier, permettant ainsi l'accès à ses métadonnées et à son contenu.

#### Organisation physique : tableau linéaire par bloc

Un répertoire est physiquement **stocké comme une série de blocs de données** (par exemple de 4 Ko chacun). Chaque **bloc contient un tableau linéaire d'entrées de répertoire**. Ces entrées ne sont **jamais fragmentées entre plusieurs blocs**. En d'autres termes, chaque direntry est toujours entièrement contenue dans un seul bloc.

- **Fin de bloc** : La dernière entrée d’un bloc utilise un champ `rec_len` qui s’étend jusqu’à la fin du bloc, même si le nom du fichier est plus court. Cela permet une navigation sans erreur dans les blocs.
    
- **Fin de répertoire** : Elle est marquée tout simplement par la **fin du fichier** représentant le répertoire. Il n’existe aucun caractère ou code spécial de fin seule la taille logique du fichier est utilisée pour arrêter la lecture.
    

#### Comment sont stockées les direntries dans un répertoire ?

Un **répertoire est un fichier** dont le contenu est constitué de **plusieurs direntries placées de manière séquentielle** dans un ou plusieurs blocs de données (souvent 4 Ko).

Chaque bloc contient plusieurs direntries, chacune ayant une taille variable (grâce à `rec_len` attribut de la structure `dir_entry`). Cela permet :

- de **minimiser le gaspillage d’espace** (pas de taille fixe),
    
- et d’**accepter des noms de fichiers de longueur variable**.
    

Chaque entrée commence à l’endroit désigné, et `rec_len` permet de **passer à l’entrée suivante sans alignement fixe**. Cela permet aussi de **supprimer une entrée** facilement (en fusionnant les `rec_len` des entrées adjacentes).

#### Gestion des entrées supprimées

Lorsqu’un fichier est supprimé d’un répertoire, **l'entrée n’est pas immédiatement effacée**. À la place, son champ `inode` est **mis à zéro** (`inode = 0`), indiquant que cette entrée est libre et peut être réutilisée. Cela permet une gestion plus efficace de l’espace sans réécriture coûteuse des blocs de répertoire.

![ex_inode_data_block.png](/systeme/File System/ex_inode_data_block.png)
#### Accès et performance

- Le **champ `rec_len`** permet une navigation rapide d’une entrée à l’autre, sans avoir besoin de structures de type liste chaînée.
    
- Le **champ `file_type`**, présent dans `ext4_dir_entry_2`, permet au noyau de **déterminer le type de fichier sans devoir lire l'inode**, accélérant ainsi les opérations `ls` ou de parcours récursif.
    
- Pour les très grands répertoires, **Ext4 propose également un mode de hachage (`dir_index`)**, permettant d’accélérer l’accès aux fichiers via une table de hachage B-tree intégrée dans les blocs de répertoire.
    

#### Recherche dans les répertoires : Linear vs Optimisée

Dans **Ext2**, les entrées sont simplement stockées **séquentiellement**, donc une recherche est **linéaire** (`O(n)`), ce qui devient coûteux avec de très grands répertoires.

Dans **Ext3 et Ext4**, un **index HTree (Hashed Tree)** a été introduit pour optimiser les performances :

##### HTree (Ext3/Ext4)

- Basé sur un arbre **B-tree tronqué à 2 niveaux**, utilisant le **hash du nom du fichier** pour indexer.
    
- Utilise un fichier spécial caché `.dir_index`.
    
- Permet une recherche en **temps quasi constant**, même dans des répertoires avec des milliers de fichiers.
    

##### Structure de l’Htree

- La **racine de l’arbre est toujours située dans le premier bloc de données du répertoire**.
    
- Les deux entrées spéciales `.` et `..` sont placées en début de ce premier bloc, sous forme de deux entrées `struct ext4_dir_entry_2`, et ne font pas partie de l’arbre proprement dit.
    
- Le reste du premier bloc (appelé **dx_root**) contient des métadonnées sur l’arbre ainsi qu’une **table de correspondance entre hachage et numéro de bloc** pour accéder aux nœuds plus bas dans l’arbre.
    
- Si `dx_root.info.indirect_levels` est différent de zéro, cela signifie que l’arbre comporte deux niveaux :
    
    - Le premier niveau est un **nœud intérieur**, contenant des pointeurs vers d’autres blocs d’arbre.
        
    - Ces nœuds intérieurs contiennent une entrée `ext4_dir_entry_2` remplie de zéros suivie d’une table de correspondance entre un "hachage mineur" et un numéro de bloc.
        
- Le niveau inférieur est constitué des **feuilles**, qui contiennent un tableau linéaire d’entrées `ext4_dir_entry_2`. Toutes les entrées d’une feuille partagent le même hachage.
    
- En cas de dépassement, les entrées débordent simplement dans la feuille suivante, et un bit dans la table du nœud intérieur indique ce débordement.
    

#### Vérifier si un répertoire utilise le htree

Le flag `EXT4_INDEX_FL` dans l’inode du répertoire indique que l’indexation htree est activée.
```
sudo debugfs 'partition'

*then*

stat 'path/repo'
```

Exemple de sortie :
```
Inode: 2621441 Type: directory Mode: 0755 Flags: 0x80000 Generation: 208160985 Version: 0x00000000:00000001 User: 0 Group: 0 Project: 0 Size: 4096 File ACL: 0 Links: 2 Blockcount: 8 Fragment: Address: 0 Number: 0 Size: 0 ctime: 0x67e344af:46cfd3ec -- Wed Mar 26 01:05:03 2025 atime: 0x687f6777:1430b9dc -- Tue Jul 22 12:27:03 2025 mtime: 0x67e344af:46cfd3ec -- Wed Mar 26 01:05:03 2025 crtime: 0x67e344af:46cfd3ec -- Wed Mar 26 01:05:03 2025 Size of extra inode fields: 32 Inode checksum: 0x6529a2e8 EXTENTS: (0):10493984
```
L’analyse de la variable de flag révèle que `EXT4_INDEX_FL` est active, indiquant l’utilisation de la structure htree.

### 5.4 Gestion de la mémoire par bitmap

La gestion de la mémoire se fait via une structure bitmap, ce qui permet de suivre facilement l'état des blocs (libres ou occupés). Cette méthode est efficace, en particulier pour des disques de taille petite à moyenne. D'autres méthodes, comme les tables de hachage ou les B-trees, offrent des avantages, mais sont plus complexes à implémenter.

## 6. Architecture des Inodes et Gestion des Pointeurs

### 6.1 Structure de l'inode

Dans un système de fichiers comme Ext2/Ext3/Ext4, un **inode** (index node) est une structure de données essentielle qui décrit tout ce qu'il faut savoir sur un fichier, à l'exception de son nom (qui est stocké dans les répertoires via les direntries). Chaque inode contient des métadonnées associées au fichier :

- Type (fichier, répertoire, lien, etc.)
- Permissions (mode POSIX)
- UID/GID du propriétaire
- Taille du fichier en octets
- Timestamps (atime, ctime, mtime)
- Nombre de liens (link count)
- Pointeurs vers les blocs de données

### 6.2 Système de pointeurs de blocs

Le cœur technique de l'inode réside dans son système de pointeurs de blocs qui permet d'accéder aux données du fichier stockées sur disque. Typiquement, un inode standard dans Ext2 ou Ext3 contient **15 pointeurs**, organisés comme suit :

#### 6.2.1 Pointeurs directs (12 pointeurs)

Chacun pointe directement vers un bloc de données (souvent de 4 Ko). Si un fichier tient dans ces 12 blocs, aucune complexité supplémentaire n'est nécessaire : les données sont accessibles en un seul niveau d'indirection.

#### 6.2.2 Pointeur indirect simple (1 pointeur)

Ce pointeur pointe vers un bloc spécial appelé **bloc d'indirection**, qui ne contient pas de données utilisateur mais une table de pointeurs (par exemple, 1024 pointeurs de 4 octets chacun si le bloc fait 4 Ko). Chaque pointeur de cette table mène à un bloc de données. Ainsi, ce seul pointeur permet de gérer jusqu'à 1024 blocs supplémentaires.

#### 6.2.3 Pointeur doublement indirect (1 pointeur)

Ce pointeur pointe vers un bloc contenant des pointeurs vers d'autres blocs d'indirection (niveau 2), qui à leur tour pointent vers les blocs de données réels. Cela crée une structure hiérarchique à deux niveaux. En supposant une taille de bloc de 4 Ko et des pointeurs de 4 octets, on peut ainsi référencer 1024 × 1024 = **1 048 576 blocs de données** supplémentaires.

#### 6.2.4 Pointeur triplement indirect (1 pointeur)

Utilisé pour les très grands fichiers, ce pointeur ajoute un troisième niveau de redirection. Il pointe vers un bloc contenant des pointeurs vers des blocs intermédiaires, eux-mêmes pointant vers des blocs d'indirection, qui enfin pointent vers les blocs de données. Cela donne une capacité théorique d'adressage de 1024³ = **1 073 741 824 blocs de données**, soit environ 4 To si chaque bloc fait 4 Ko.

![inode_data_block.png](/systeme/File System/inode_data_block.png)

### 6.3 Compromis performance-capacité

Ce système hiérarchique de pointeurs permet un compromis entre performance et capacité. Les petits fichiers accèdent très rapidement à leurs données via les pointeurs directs, tandis que les fichiers volumineux sont pris en charge efficacement sans que l'inode lui-même devienne trop lourd.

### 6.4 Allocation et limitations des inodes

Les inodes sont alloués au moment de la création du fichier, et leur nombre est généralement fixe à la création du système de fichiers. Ainsi, un système peut manquer d'inodes avant même d'avoir rempli l'espace disque, en particulier si de nombreux petits fichiers sont créés. C'est pourquoi la gestion fine des inodes libres (par bitmap, liste chaînée, ou cache) est cruciale pour les performances et la longévité du système.


### **6.5 Algorithmes bas-niveau dans la gestion des inodes et blocs**

Au sein du système de fichiers Linux, plusieurs algorithmes bas-niveau sont indispensables pour la gestion fine des inodes et des blocs de données. L’algorithme **namei** est responsable de la résolution des chemins d’accès : il parcourt récursivement les répertoires pour traduire un chemin en inode, permettant ainsi d’identifier précisément le fichier ou répertoire ciblé. Une fois l’inode localisé, **iget** est utilisé pour charger cet inode en mémoire, exploitant un cache d’inodes pour optimiser les accès ultérieurs. Lorsque l’inode n’est plus utilisé, **iput** intervient pour libérer la structure en mémoire, en gérant la décrémentation du compteur de références et en déclenchant éventuellement la libération de l’inode si celle-ci est nécessaire. Pour la gestion des blocs physiques sur disque, les algorithmes **alloc** et **free** permettent respectivement d’allouer et de libérer les blocs, assurant une gestion efficace de l’espace disponible. De même, l’allocation et la libération des inodes sont assurées par **ialloc** et **ifree**, qui manipulent la création et la suppression des inodes dans les tables du système de fichiers. Ces algorithmes, bien que très bas-niveau, sont essentiels pour garantir la cohérence, la performance et la robustesse de la gestion des fichiers sous Linux.

![low_level_fs_algo.png](/systeme/File System/low_level_fs_algo.png)
## 7. Techniques d'Optimisation

### 7.1 Optimisation de l'allocation des inodes

Pour optimiser la recherche d'inodes libres au lieu de consulter les bitmaps à chaque besoin, il est possible d'implémenter une structure de liste chaînée dans un cache. Le système remplit cette liste lorsqu'il a le temps, permettant de récupérer rapidement un inode libre sans recherche sur disque. Lorsqu'un inode est libéré, il est ajouté à cette liste s'il y a encore de la place. Cette structure de liste chaînée peut être intégrée dans le superblock.

### 7.2 Optimisation de l'allocation des blocs de données

Le même principe peut être appliqué aux blocs de données, évitant ainsi la recherche sur disque à chaque fois qu'un bloc de données est nécessaire.

### 7.3 Gestion de la fragmentation par blocs de tailles variables

Pour optimiser la fragmentation, il est possible d'utiliser des blocs de tailles différentes :

- Commencer par implémenter dès le départ des blocs de taille standard
- Réserver une partie pour des blocs de taille plus petits
- Lorsque le reste d'un fichier n'utilise pas la totalité d'un bloc, le placer dans un bloc plus petit
- Pour éviter cette complexité, implémenter une approche dynamique en découpant les blocs standards en sous-blocs selon les besoins

### 7.4 Performances et scalabilité

Le système de fichiers **Ext4** intègre plusieurs mécanismes avancés visant à améliorer les performances d’accès, optimiser l’utilisation des ressources et garantir la scalabilité, même sous de fortes charges. Ces optimisations se concentrent notamment sur la gestion des écritures, la lecture anticipée, la mise en cache, et le journal.

#### Allocation différée (Delayed Allocation)

L’**allocation différée** est une technique clé utilisée par Ext4 pour réduire la fragmentation et améliorer les performances d’écriture.

- **Principe** : Lorsqu’un fichier est modifié ou créé, Ext4 ne réserve pas immédiatement l’espace disque pour les données à écrire. Il retarde l’allocation des blocs physiques jusqu’au moment où les données doivent effectivement être écrites sur disque (synchronisation).
    
- **Avantages** :
    
    - Optimise la disposition des blocs alloués en regroupant les allocations contiguës.
        
    - Réduit la fragmentation en attendant la taille finale des écritures.
        
    - Diminue le nombre d’opérations d’allocation, réduisant la charge CPU et disque.
        

#### Préallocation (Preallocation)

La **préallocation** complète l’allocation différée.

- **Principe** : Ext4 peut réserver à l’avance un nombre de blocs contigus pour un fichier, anticipant son extension future.
    
- **Utilisation** : Utile pour des applications prévoyant une croissance du fichier (bases de données, fichiers vidéo).
    
- **Avantages** :
    
    - Garantit la disponibilité de blocs contigus, limitant la fragmentation.
        
    - Améliore les performances lors d’écritures successives.
        
    - Réduit le travail du système pendant l’extension du fichier.
        

#### Journaling intelligent

Ext4 améliore la robustesse tout en minimisant l’impact sur la performance grâce à un **journaling optimisé**.

- **Modes de journaling** :
    
    - _Journal_ : journalise toutes les données et métadonnées (sécurisé mais plus lent).
        
    - _Ordered_ (par défaut) : journalise les métadonnées, écrit les données avant les métadonnées.
        
    - _Writeback_ : journalise les métadonnées sans garantie d’ordre sur les données (plus rapide mais moins sûr).
        
- **Optimisations** :
    
    - Regroupement intelligent des entrées de journal pour limiter les écritures.
        
    - Usage de **barrières d’écriture** (write barriers) pour assurer la cohérence sans forcer trop souvent les opérations disque.
        

#### Concepts de réservation, prélecture (read-ahead) et mise en cache

Pour optimiser les accès disques, Ext4 exploite :

- **Réservation** : réservation préalable de blocs pour éviter l’éparpillement.
    
- **Prélecture** : anticipation des lectures futures en lisant des blocs supplémentaires consécutifs, réduisant le temps d’attente en lecture séquentielle.
    
- **Mise en cache des blocs** : stockage en RAM des blocs récemment accédés, géré par le noyau avec des algorithmes de remplacement comme LRU.
    

#### Allocation contiguë et clustering

Ext4 tente de regrouper physiquement les blocs de fichiers afin de minimiser la fragmentation, ce qui améliore la lecture séquentielle et réduit la latence.

---

## 8. Ressources

Pour approfondir les concepts évoqués dans cet article, voici une sélection de ressources fiables, complètes et pertinentes sur les systèmes de fichiers Linux, en particulier Ext2/Ext3/Ext4, leur architecture interne, les optimisations, et les structures de bas niveau :

- **Code source du noyau Linux – Superblock Ext2**  
    [https://github.com/torvalds/linux/blob/master/fs/ext2/super.c](https://github.com/torvalds/linux/blob/master/fs/ext2/super.c)  
    → Accès direct à l'implémentation du superblock et des structures internes du système de fichiers Ext2 dans le noyau Linux.
    
- **The Linux Knowledge Base and Guide – File System**  
    [https://tldp.org/LDP/tlk/fs/filesystem.html](https://tldp.org/LDP/tlk/fs/filesystem.html)  
    → Guide détaillé sur la structure interne des systèmes de fichiers Linux, incluant les inodes, les pointeurs et la gestion mémoire.
    
- **Medium – Guide complet sur les systèmes de fichiers Linux**  
    [https://medium.com/@extio/a-comprehensive-guide-to-linux-file-system-types-fcb13cd7d3f3](https://medium.com/@extio/a-comprehensive-guide-to-linux-file-system-types-fcb13cd7d3f3)  
    → Un article pédagogique pour mieux comprendre les différents types de systèmes de fichiers et leurs usages.
    
- **Introduction au système de fichiers Ext2 – e2fsprogs**  
    [https://e2fsprogs.sourceforge.net/ext2intro.html](https://e2fsprogs.sourceforge.net/ext2intro.html)  
    → Documentation officielle décrivant les structures et principes fondamentaux d’Ext2, très utile pour comprendre les bases d’Ext3 et Ext4.
    
- **Livres de référence** :
    
    - _Operating Systems: Three Easy Pieces_ Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau
        
    - _Operating Systems: Design and Implementation_ Andrew S. Tanenbaum
        
    - _The Design of the UNIX Operating System_ Maurice J. Bach


