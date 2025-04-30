-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "commission" REAL DEFAULT 0,
    "clientAmount" REAL NOT NULL DEFAULT 0,
    "paidAmount" REAL,
    "paidCurrency" TEXT,
    "type" TEXT NOT NULL DEFAULT 'income',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "accountId" TEXT,
    "clientId" TEXT,
    "emoji" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("accountId", "amount", "clientAmount", "clientId", "commission", "createdAt", "description", "emoji", "id", "paidAmount", "paidCurrency", "type") SELECT "accountId", "amount", "clientAmount", "clientId", "commission", "createdAt", "description", "emoji", "id", "paidAmount", "paidCurrency", "type" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
