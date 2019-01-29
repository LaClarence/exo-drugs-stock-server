# Le Reacteur - Exo Drug stock serveur

## Prerequisites

- npm must be available.
- node.js must be installed.

## Installing MongoDB

Entrez les commandes suivantes, une par une, dans le terminal :

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # Installera le logiciel https://brew.sh/
brew update
brew install mongodb
sudo mkdir -p /data/db
sudo chown -R "$USER":staff /data/db
brew services start mongo
```

[MongoDB official install](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

[How to run MongoDB on macOS using Homebrew](https://www.code2bits.com/how-to-run-mongodb-on-macos/)

### MongoDB Compass

MongoDB Compass is the ultimate GUI to manage MongoDB databases.

[Install MongoDB Compass](https://www.mongodb.com/products/compass)

## Quick Start

```bash
npm install
```

## Service Web pour ajouter un nouveau médicament à l'inventaire

- URL: http://localhost:3000/create
- Méthode: POST
- Paramètres:

```json
{
  "name": "ASPEGIC",
  "quantity": 10
}
```

En cas de **succès**, le service Web devra retourner les informations concernant le médicament ajouté :

```json
{
  "_id": "5b2b9ef2c6dc7a37c8dadfc6",
  "name": "ASPEGIC",
  "quantity": 10
}
```

## Service Web pour obtenir l'état de l'inventaire

- URL: http://localhost:3000/
- Méthode: **GET**
- Réponse:

```json
[
  { "_id": "5b2b9b4db2842e190ab98229", "name": "DOLIPRANE", "quantity": 19 },
  { "_id": "5b2b9c14cddedd19129ce712", "name": "IMODIUM", "quantity": 63 },
  { "_id": "5b2bd0949d50d51afefe8558", "name": "SPEDIFEN", "quantity": 56 },
  { "_id": "5b2bd0ab9d50d51afefe8559", "name": "KARDEGIC", "quantity": 12 },
  { "_id": "5b2bd0c29d50d51afefe855a", "name": "SPASFON", "quantity": 42 },
  { "_id": "5b2b8ef005ffc63094ca7995", "name": "ISIMIG", "quantity": 13 },
  { "_id": "5b2b8f69c7e5f603e4d723d1", "name": "DAFALGAN", "quantity": 6 },
  { "_id": "5b2b9038f122b621fca03d96", "name": "LEVOTHYROX", "quantity": 0 },
  { "_id": "5b2b97aa0cb20d1470f87e84", "name": "EFFERALGAN", "quantity": 63 },
  { "_id": "5b2b97ef5cad240e580d7880", "name": "TAHOR", "quantity": 27 },
  { "_id": "5b2b9ef2c6dc7a37c8dadfc6", "name": "ASPEGIC", "quantity": 10 }
]
```

## Service Web pour ajouter dans l'inventaire

Le troisième service Web à développer permettra d'augmenter la quantité d'un médicament.

- URL: http://localhost:3000/drugs/add
- Méthode: **POST**
- Paramètres:

```json
{
  "id": "5b2b9b4db2842e190ab98229",
  "quantity": 5
}
```

Ajoutera 5 DOLIPRANE dans l'inventaire. L'id utilisé est celui attribué par la base de données contenant la collection. Cet id sera donc différent du votre.

## Service Web pour retirer de l'inventaire

- URL: http://localhost:3000/drugs/remove
- Méthode: **POST**
- Paramètres:

```json
{
  "id": "5b2b9b4db2842e190ab98229",
  "quantity": 2
}
```

Retirera 2 DOLIPRANE de l'inventaire

## Gestion des erreurs

Ajouter un médicament qui existe déjà

```json
{
  "error": {
    "message": "Drug already exists"
  }
}
```

Ajouter ou retirer un ID non répertorié devra retourner un statut 400

```json
{
  "error": {
    "message": "Bad request"
  }
}
```

Retirer une quantité supérieur au nombre de médicaments restants devra retourner un statut 400

```json
{
  "error": {
    "message": "Invalid quantity"
  }
}
```

## Bonus

- Créer un service pour récupérer la quantité d'un médicament en particulier
- Créer un service pour modifier le nom d'un médicament
- Créer un service pour supprimer un médicament de l'inventaire
- Conserver un historique de chacune des modifications de l'inventaire. Vous devrez donc sauvegarder aussi la date.
- Créer un service pour afficher l'historique
