---
title: "VFS Linux : Le Système de Fichiers Virtuel : Architecture, Abstraction et Sécurité"
description: Le Virtual File System (VFS) est une couche d'abstraction centrale du noyau Linux, permettant une gestion unifiée des systèmes de fichiers, qu'ils soient locaux (EXT4), réseau (NFS) ou virtuels (tmpfs)
pubDate: 2025-06-27T00:00:00.000Z
author: Madhbouh Yassine
tags:
  - Linux
  - VFS
  - LSM
  - Kernel
  - AppArmor
  - SystèmeDeFichiers
  - FileSystem
---

# **Le Virtual File System (VFS) : Une abstraction puissante au cœur du noyau Linux**

## **1. Abstraction via le VFS**

Aujourd'hui, toutes les opérations sur les fichiers passent par le VFS (Virtual File System), qui sert d'abstraction entre l'utilisateur (ou les processus) et les différents types de systèmes de fichiers supportés par le noyau. Cette abstraction permet de manipuler des systèmes de fichiers variés — qu'ils soient locaux, en réseau ou virtuels — de manière unifiée.

---

## **2. Table d'inodes générique**

Plutôt que de manipuler des inodes propres à chaque système de fichiers, le noyau utilise une **table générique d'inodes**. Chaque entrée représente un fichier, avec des informations indépendantes du type de système de fichiers :

- Numéro d'inode, type de fichier, taille, UID, GID, etc.
    
- Pointeur vers la structure spécifique du FS utilisé, qui pourrait être une inode dans un système de fichiers traditionnel comme EXT4, ou une autre structure pour des systèmes de fichiers différents (comme un "bloc de métadonnées" dans certains systèmes de fichiers réseau).
    
- Pointeur vers la **bibliothèque de fonctions** spécifique au FS, permettant les opérations telles que lecture, écriture, gestion des métadonnées, etc.

La structure spécifique du FS contient les références aux **blocs de données** réels sur le disque. Ces structures sont manipulées via le VFS selon le type de système de fichiers.

---

## **3. Appels aux fonctions via pointeurs de la couche VFS**

Le VFS repose sur des **structures de pointeurs de fonctions** pour déléguer les opérations aux systèmes de fichiers concrets.

### Principales structures :

- `struct file_operations` : opérations sur les descripteurs de fichiers ouverts.
    
- `struct inode_operations` : opérations liées à l’inode (création, lien, recherche...).
    
- `struct super_operations` : opérations globales sur le système de fichiers (montage, synchronisation...).

### Exemple :

Lorsqu’un programme appelle `read(fd, buf, size)` :

- Appel de `sys_read()` → `vfs_read()`
    
- `struct file` (fd) contient un pointeur `f_op` vers `file_operations`
    
- `vfs_read()` invoque : `file->f_op->read(file, buf, size, &pos);`

> Cette fonction `read` est implémentée par le système de fichiers (ex. EXT4, NFS, tmpfs...).


![[1vfs_img1.png]]

---

## **4. Intégration des systèmes de fichiers (EXT4, NFS, tmpfs, FUSE...)**

Chaque système de fichiers fournit :

- Une structure `file_system_type`
    
- Des **callbacks** pour les opérations de bas niveau

### Montage d’un système de fichiers :

Lors du `mount`, le noyau appelle la fonction `->mount()` de `file_system_type`, qui initialise :

- `super_block`
    
- `inode`
    
- `file_operations`, etc.

### Qu'est-ce que "monter" un FS ?

> Monter un système de fichiers consiste à le **connecter à un point de l’arborescence du système** (ex. `/mnt/usb`, `/home`).

Montage = dire au système :

> « Voici où trouver les fichiers de ce périphérique, dans l’arborescence. »

Un disque, une clé USB ou une partition n’est pas accessible tant que son FS n’est pas monté.

---

## **5. Vérification des droits d’accès par le VFS**

Avant toute opération, le VFS vérifie les **droits d’accès** :

- Mode de l’inode (lecture/écriture/exécution)
    
- UID et GID du fichier
    
- Credentials du processus (`current->cred`)
    
- ACLs éventuelles

Fonction clé : **`inode_permission()`**  
Cette fonction vérifie les permissions POSIX sur l’inode, selon le contexte utilisateur courant.

Ce que cela implique :

- Le VFS est responsable de la vérification des droits d’accès, **pas chaque système de fichiers indépendamment**.
    
- Il consulte les métadonnées POSIX stockées dans l’inode (`i_mode`, `i_uid`, `i_gid`).
    
- Il compare ces données avec les credentials du processus (`fsuid`, `fsgid`, etc.).
    
- S’il existe une méthode `permission()` dans le système de fichiers (par exemple, pour gérer les ACLs), elle est appelée.
    
- Sinon, la fonction `generic_permission()` prend le relais pour appliquer les règles standard POSIX.

### Ressources :

- [Kernel Development - Vérification des permissions](https://litux.nl/mirror/kerneldevelopment/0672327201/ch12lev1sec6.html)
    
- [Documentation officielle Linux - Filesystems](https://www.kernel.org/doc/html/v4.19/filesystems/index.html)
    

---

## **6. Intégration avec les modules de sécurité Linux (LSM, SELinux)**

Après les vérifications classiques effectuées par le VFS, une couche supplémentaire de contrôle est assurée par les **Linux Security Modules (LSM)**, tels que SELinux ou AppArmor, pour appliquer des politiques de sécurité plus fines.

> Même si le VFS autorise l'accès, un module LSM peut le refuser, renforçant ainsi la sécurité globale du système.

##### Fonction impliquée : `security_inode_permission(inode, mask);`

Cette fonction est appelée dans des fichiers du noyau comme `fs/namei.c`.

Cette fonction, fournie par le framework LSM, est responsable de l’appel aux différents modules LSM actifs (par exemple SELinux, AppArmor, etc.).

Elle est directement intégrée dans les fonctions du VFS comme `inode_permission()`, assurant que la vérification des permissions prend en compte à la fois les règles classiques POSIX et les politiques définies par les modules de sécurité.

### Ressources complémentaires :

- Documentation sur l’intégration de LSM dans le VFS :  
    [https://www.kernel.org/doc/ols/2002/ols2002-pages-604-617.pdf](https://www.kernel.org/doc/ols/2002/ols2002-pages-604-617.pdf)
    
- Code source du noyau montrant l’intégration de `security_inode_permission()` dans `inode_permission()` :  
    [https://android.googlesource.com/kernel/common/+/refs/heads/android-mainline/fs/namei.c](https://android.googlesource.com/kernel/common/+/refs/heads/android-mainline/fs/namei.c)

### Ordre des vérifications (simplifié) :
```
[ Application utilisateur ]
        |
[ Appel système : open(), read()... ]
        |
[ VFS : vérifie inode, UID, GID, mode ]
        |
[ FS : ACLs personnalisées (facultatif) ]
        |
[ LSM : règles SELinux, AppArmor, etc. ]
        |
[ Autorisation ou refus final ]
```


## **7. Ajout de nouveaux systèmes de fichiers sans modifier le noyau**

> Ressource : [Documentation kernel.org](https://docs.kernel.org/filesystems/vfs.html)

Un système de fichiers peut être ajouté dynamiquement au noyau via :

- `register_filesystem()`
    
- `unregister_filesystem()`
    

Une fois enregistré, le VFS prend en charge **le montage, l’accès, la résolution des chemins**, etc.

Cela permet d’implémenter un FS comme **module externe**, sans modifier le cœur du noyau.

---

## **8. Extension à des systèmes de fichiers non POSIX (ex : FUSE, plan9fs, S3...)**

Le VFS fournit une couche d’abstraction universelle qui permet d’intégrer des systèmes de fichiers très variés, y compris ceux qui ne respectent pas strictement le modèle POSIX.

Cette abstraction permet de :

- Masquer les différences internes des systèmes de fichiers (qu’ils soient sur disque, réseau ou virtuels).
    
- **Permettre à des systèmes de fichiers très variés de fonctionner de manière uniforme à travers les appels POSIX du noyau.**
### Structures génériques utilisées :

- `inode`
- `dentry`
- `file`
- `superblock`

Chaque FS doit **traduire ses structures internes** vers ces structures VFS via des **callbacks** comme `lookup()`, `read_inode()`, etc.

> _« The Virtual File System (…) provides an abstraction within the kernel which allows different filesystem implementations to coexist. »_  
> ([docs.kernel.org](https://docs.kernel.org/filesystems/vfs.html))


> _“The general file system model, to which any implemented file system needs to be reduced ... information about data or other metadata”_  
> (source : [https://linux-kernel-labs.github.io/refs/pull/189/merge/labs/filesystems_part1.html](https://linux-kernel-labs.github.io/refs/pull/189/merge/labs/filesystems_part1.html))

---

### Exemple : intégration de FAT

Dans le code source du noyau Linux :

- `fat_fill_inode()` : mappe les données internes vers un `struct inode` du VFS  
    ➤ [Lien vers le code source](https://elixir.bootlin.com/linux/latest/source/fs/fat/inode.c)
    
- `fat_fill_super()` : initialise le `super_block` utilisé par `mount()`
    

> C’est ainsi que les FS non POSIX exposent une interface POSIX-like au VFS.


## **Résumé final**

Le VFS constitue l’un des piliers de l’architecture du noyau Linux. Il permet d’unifier l'accès aux fichiers, quels que soient les systèmes sous-jacents (EXT4, NFS, FUSE, etc.), en proposant une couche d'abstraction générique et puissante.

Grâce à cette architecture :

- Le noyau gère de nombreux systèmes de fichiers via une interface unique.
    
- Les droits d’accès sont centralisés.
    
- La sécurité est renforcée avec l'intégration de LSM.
    
- L’ajout de nouveaux FS est modulaire et flexible.
    
- Les FS non POSIX sont parfaitement intégrés via des interfaces génériques.

Le VFS est ainsi un **élément essentiel de la portabilité, de la modularité et de la sécurité du noyau Linux**, assurant à la fois robustesse et extensibilité.

---

### ressources : 
 https://www.youtube.com/watch?v=Fq0ks85G6-o
https://www.youtube.com/watch?v=J4qWNNISdJk
