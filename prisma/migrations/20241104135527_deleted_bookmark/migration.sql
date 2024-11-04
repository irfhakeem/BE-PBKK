/*
  Warnings:

  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `listBookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_postId_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- DropForeignKey
ALTER TABLE "listBookmarks" DROP CONSTRAINT "listBookmarks_bookmarkId_fkey";

-- DropForeignKey
ALTER TABLE "listBookmarks" DROP CONSTRAINT "listBookmarks_listId_fkey";

-- DropTable
DROP TABLE "bookmarks";

-- DropTable
DROP TABLE "listBookmarks";

-- CreateTable
CREATE TABLE "_PostLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostLists_AB_unique" ON "_PostLists"("A", "B");

-- CreateIndex
CREATE INDEX "_PostLists_B_index" ON "_PostLists"("B");

-- AddForeignKey
ALTER TABLE "_PostLists" ADD CONSTRAINT "_PostLists_A_fkey" FOREIGN KEY ("A") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostLists" ADD CONSTRAINT "_PostLists_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
