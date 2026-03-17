import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up duplicate tags...')

  // Find users with duplicate tags
  const duplicates = await prisma.$queryRaw`
    SELECT name, "userId", COUNT(*) as count
    FROM "Tag"
    GROUP BY name, "userId"
    HAVING COUNT(*) > 1
  `

  console.log(`Found ${Array.isArray(duplicates) ? duplicates.length : 0} tags with duplicates.`)

  if (Array.isArray(duplicates)) {
    for (const dup of duplicates) {
      console.log(`Cleaning up tag "${dup.name}" for user ${dup.userId}...`)
      
      // Get all instances of this tag for this user
      const tags = await prisma.tag.findMany({
        where: {
          name: dup.name,
          userId: dup.userId
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Keep the first one, delete the others
      const [_first, ...others] = tags
      
      for (const other of others) {
        // Before deleting, check if this specific tag instance is linked to transactions
        // and ideally move them to the first instance.
        
        await prisma.transaction.updateMany({
          where: {
            tags: {
              some: {
                id: other.id
              }
            }
          },
          data: {
            // Note: Many-to-many updateMany doesn't support easy 'connect/disconnect' 
            // but since we are deleting the tag, we should just ensure they are connected to 'first'
          }
        })
        
        // Actually, for many-to-many, we need to iterate transactions and re-connect?
        // Or just let prisma handle it if it's onDelete: Cascade? (it's not, tags are many-to-many)
        
        // Let's just delete the extra tags for now. The transactions might lose the link to the duplicate, 
        // but they should be linked to the "first" one if they were created correctly?
        // Wait, if a transaction was linked to 'other', it won't automatically be linked to 'first'.
        
        // Better: Find all transactions linked to 'other' and link them to 'first'
        const txsWithOther = await prisma.transaction.findMany({
          where: {
            tags: {
              some: { id: other.id }
            }
          }
        })

        for (const tx of txsWithOther) {
           await prisma.transaction.update({
             where: { id: tx.id },
             data: {
               tags: {
                 disconnect: { id: other.id },
                 connect: { id: _first.id }
               }
             }
           })
        }

        await prisma.tag.delete({
          where: { id: other.id }
        })
      }
    }
  }

  console.log('Cleanup complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
