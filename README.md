
## API REST
```app/
└─ api/
   ├─ user/
   │  |─ role/
   │  |   └─ route.ts
   ├─ accounts/
   │  ├─ current-month/
   │  │  └─ route.ts
   │  ├─ archive/
   │  │  └─ [year]/[month]/route.ts
   │  └─ create/
   │     └─ route.ts
   ├─ transactions/
   │  ├─ create/
   │  │  └─ route.ts
   │  ├─ update/
   │  │  └─ route.ts
   │  └─ [accountId]/
   │     └─ current-month/
   │        └─ route.ts
   └─ clients/
      ├─ list/
      │  └─ route.ts
      └─ create/
         └─ route.ts
```

## Frontend

## Evolution
11.05.2025 UI correction
restant:
1. Dashboard ajouter le montant total en Dollars
2. Dashboard ajouter le montant total en Euros (optionel)
3. Page Brouillon ajouter une calculatrice  ou une table de conversion avec possibilite d'envoyer la facture en pdf 
